import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { readFileSync, readdirSync } from 'fs'

// Import shared types
import type {
  DailyFeaturesResponse,
  SoHHistoryResponse,
  FleetAggregatedResponse,
  LatestSnapshot,
  MultiDayComparisonResponse,
} from './types/features'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json())

// Feature data paths
const FEATURES_BASE = path.join(__dirname, '../data/features')
const DAILY_PATH = path.join(FEATURES_BASE, 'daily')
const SOH_PATH = path.join(FEATURES_BASE, 'SoH')
const AGGREGATED_PATH = path.join(FEATURES_BASE, 'aggregated')

// Helper: Read parquet as JSON using Python
const readParquet = (filePath: string): any[] => {
  const { execSync } = require('child_process')
  try {
    const result = execSync(
      `python3 -c "import pandas as pd; import json; df = pd.read_parquet('${filePath}'); print(json.dumps(df.to_dict('records')))"`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    )
    return JSON.parse(result)
  } catch (error) {
    console.error(`Failed to read parquet: ${filePath}`, error)
    return []
  }
}

// Helper: Get latest day for a drone
const getLatestDay = (droneId: string): number => {
  const files = readdirSync(DAILY_PATH)
  const droneFiles = files.filter((f) =>
    f.startsWith(`features_daily_${droneId}_day_`)
  )
  const days = droneFiles.map((f) => {
    const match = f.match(/_day_(\d+)\.parquet$/)
    return match ? parseInt(match[1], 10) : 0
  })
  return Math.max(...days, 0)
}

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// GET /api/features/drone/:droneId/daily/latest
// Returns latest daily features for a drone
app.get('/api/features/drone/:droneId/daily/latest', (req: Request, res: Response) => {
  try {
    const { droneId } = req.params
    const latestDay = getLatestDay(droneId)

    if (latestDay === 0) {
      return res.status(404).json({ error: `No daily features found for ${droneId}` })
    }

    const filePath = path.join(
      DAILY_PATH,
      `features_daily_${droneId}_day_${String(latestDay).padStart(2, '0')}.parquet`
    )
    const data = readParquet(filePath)

    if (data.length === 0) {
      return res.status(404).json({ error: 'No data in file' })
    }

    const response: DailyFeaturesResponse = {
      drone_id: droneId,
      day_index: latestDay,
      features: data[0],
    }

    res.json(response)
  } catch (error) {
    console.error('Error fetching daily features:', error)
    res.status(500).json({ error: 'Failed to fetch daily features' })
  }
})

// GET /api/features/drone/:droneId/daily/:dayIndex
// Returns daily features for specific day
app.get('/api/features/drone/:droneId/daily/:dayIndex', (req: Request, res: Response) => {
  try {
    const { droneId, dayIndex } = req.params
    const day = parseInt(dayIndex, 10)

    const filePath = path.join(
      DAILY_PATH,
      `features_daily_${droneId}_day_${String(day).padStart(2, '0')}.parquet`
    )
    const data = readParquet(filePath)

    if (data.length === 0) {
      return res.status(404).json({ error: `No features found for ${droneId} day ${day}` })
    }

    const response: DailyFeaturesResponse = {
      drone_id: droneId,
      day_index: day,
      features: data[0],
    }

    res.json(response)
  } catch (error) {
    console.error('Error fetching daily features:', error)
    res.status(500).json({ error: 'Failed to fetch daily features' })
  }
})

// GET /api/features/drone/:droneId/soh
// Returns full SoH history for a drone
app.get('/api/features/drone/:droneId/soh', (req: Request, res: Response) => {
  try {
    const { droneId } = req.params

    const filePath = path.join(SOH_PATH, `features_daily_${droneId}_with_SoH.parquet`)
    const data = readParquet(filePath)

    if (data.length === 0) {
      return res.status(404).json({ error: `No SoH history found for ${droneId}` })
    }

    const response: SoHHistoryResponse = {
      drone_id: droneId,
      total_days: data.length,
      history: data,
    }

    res.json(response)
  } catch (error) {
    console.error('Error fetching SoH history:', error)
    res.status(500).json({ error: 'Failed to fetch SoH history' })
  }
})

// GET /api/features/drone/:droneId/snapshot
// Returns latest daily + latest SoH for Overview tab
app.get('/api/features/drone/:droneId/snapshot', (req: Request, res: Response) => {
  try {
    const { droneId } = req.params
    const latestDay = getLatestDay(droneId)

    if (latestDay === 0) {
      return res.status(404).json({ error: `No features found for ${droneId}` })
    }

    // Get latest daily features
    const dailyPath = path.join(
      DAILY_PATH,
      `features_daily_${droneId}_day_${String(latestDay).padStart(2, '0')}.parquet`
    )
    const dailyData = readParquet(dailyPath)

    if (dailyData.length === 0) {
      return res.status(404).json({ error: 'No daily data' })
    }

    // Get SoH snapshot (latest entry)
    let sohSnapshot = null
    try {
      const sohPath = path.join(SOH_PATH, `features_daily_${droneId}_with_SoH.parquet`)
      const sohData = readParquet(sohPath)
      if (sohData.length > 0) {
        const latest = sohData[sohData.length - 1]
        sohSnapshot = {
          EFC_lifetime: latest.EFC_lifetime,
          SoH: latest.SoH,
        }
      }
    } catch (e) {
      console.warn(`No SoH data for ${droneId}`)
    }

    const response: LatestSnapshot = {
      drone_id: droneId,
      day_index: latestDay,
      daily_features: dailyData[0],
      soh_snapshot: sohSnapshot,
    }

    res.json(response)
  } catch (error) {
    console.error('Error fetching snapshot:', error)
    res.status(500).json({ error: 'Failed to fetch snapshot' })
  }
})

// GET /api/features/fleet/aggregated
// Returns fleet-level aggregated metrics
app.get('/api/features/fleet/aggregated', (_req: Request, res: Response) => {
  try {
    const filePath = path.join(AGGREGATED_PATH, 'features_daily_fleet_with_lifetime.parquet')
    const data = readParquet(filePath)

    if (data.length === 0) {
      return res.status(404).json({ error: 'No fleet data found' })
    }

    // Count unique drones
    const uniqueDrones = new Set(data.map((d: any) => d.drone_id))

    const response: FleetAggregatedResponse = {
      total_drones: uniqueDrones.size,
      total_days: Math.max(...data.map((d: any) => d.day_index)),
      data: data,
    }

    res.json(response)
  } catch (error) {
    console.error('Error fetching fleet data:', error)
    res.status(500).json({ error: 'Failed to fetch fleet data' })
  }
})

// GET /api/features/drone/:droneId/compare
// Returns features for Days 1, 7, 15 for module comparison
app.get('/api/features/drone/:droneId/compare', (req: Request, res: Response) => {
  try {
    const { droneId } = req.params
    const comparisonDays = [1, 7, 15]
    const features: any[] = []

    for (const day of comparisonDays) {
      const filePath = path.join(
        DAILY_PATH,
        `features_daily_${droneId}_day_${String(day).padStart(2, '0')}.parquet`
      )
      const data = readParquet(filePath)
      if (data.length > 0) {
        features.push(data[0])
      }
    }

    if (features.length === 0) {
      return res.status(404).json({ error: `No comparison data found for ${droneId}` })
    }

    const response: MultiDayComparisonResponse = {
      drone_id: droneId,
      days: comparisonDays.slice(0, features.length),
      features: features,
    }

    res.json(response)
  } catch (error) {
    console.error('Error fetching comparison data:', error)
    res.status(500).json({ error: 'Failed to fetch comparison data' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Feature API Server running on http://localhost:${PORT}`)
  console.log(`📡 Available endpoints:`)
  console.log(`   - GET /api/features/drone/:droneId/daily/latest`)
  console.log(`   - GET /api/features/drone/:droneId/daily/:dayIndex`)
  console.log(`   - GET /api/features/drone/:droneId/soh`)
  console.log(`   - GET /api/features/drone/:droneId/snapshot`)
  console.log(`   - GET /api/features/drone/:droneId/compare`)
  console.log(`   - GET /api/features/fleet/aggregated`)
  console.log(`   - GET /health`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...')
  process.exit(0)
})
