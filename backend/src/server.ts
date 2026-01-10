import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// GET /api/fleet/summary
app.get('/api/fleet/summary', async (_req: Request, res: Response) => {
  try {
    console.log('📊 Fetching fleet summary...')

    const assets = await prisma.asset.findMany({
      include: { state: true },
    })

    const activeFlights = assets.filter((a: any) => a.state?.isFlying).length
    const chargingCount = assets.filter((a: any) => a.state?.isCharging).length
    const criticalAlerts = assets.reduce((sum: number, a: any) => sum + (a.state?.criticalFaultCount || 0), 0)

    const summary = {
      fleetAvailabilityPct: 100,
      availabilityDeltaPct: 0,
      activeFlights,
      chargingCount,
      avgChargeTimeMin: 0,
      criticalAlerts,
    }

    console.log('✅ Fleet summary:', summary)
    res.json(summary)
  } catch (error) {
    console.error('❌ Error fetching fleet summary:', error)
    res.status(500).json({ error: 'Failed to fetch fleet summary' })
  }
})

// GET /api/fleet/assets
app.get('/api/fleet/assets', async (_req: Request, res: Response) => {
  try {
    console.log('🚁 Fetching fleet assets...')

    const assets = await prisma.asset.findMany({
      include: { state: true },
    })

    const response = assets.map((asset: any) => {
      const state = asset.state
      if (!state) {
        return null
      }

      // Determine health ring color
      let healthRing: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN'
      if (state.soh < 85 || state.criticalFaultCount > 0) {
        healthRing = 'RED'
      } else if (state.soh < 90) {
        healthRing = 'YELLOW'
      }

      return {
        assetId: asset.id,
        name: asset.name,
        status: state.status,
        soc: state.soc,
        soh: state.soh,
        healthRing,
        faultFlags: state.criticalFaultCount > 0 ? ['CRITICAL_FAULT'] : [],
      }
    }).filter(Boolean)

    console.log(`✅ Found ${response.length} assets`)
    res.json(response)
  } catch (error) {
    console.error('❌ Error fetching assets:', error)
    res.status(500).json({ error: 'Failed to fetch assets' })
  }
})

// GET /api/assets/:assetId/telemetry/days
app.get('/api/assets/:assetId/telemetry/days', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params
    console.log(`📊 Fetching telemetry days for ${assetId}...`)

    // Get distinct days with sample counts
    const days = await prisma.telemetrySample.groupBy({
      by: ['dayIndex'],
      where: { assetId },
      _count: { id: true },
      orderBy: { dayIndex: 'asc' },
    })

    const response = days.map((day: any) => ({
      dayIndex: day.dayIndex,
      sampleCount: day._count.id,
    }))

    console.log(`✅ Found ${response.length} days`)
    res.json(response)
  } catch (error) {
    console.error('❌ Error fetching telemetry days:', error)
    res.status(500).json({ error: 'Failed to fetch telemetry days' })
  }
})

// GET /api/assets/:assetId/telemetry/day/:dayIndex
app.get('/api/assets/:assetId/telemetry/day/:dayIndex', async (req: Request, res: Response) => {
  try {
    const { assetId, dayIndex } = req.params
    const dayNum = parseInt(dayIndex, 10)
    
    console.log(`📊 Fetching telemetry for ${assetId} day ${dayNum}...`)

    // Fetch telemetry samples with cell data (exclude problematic timestamp fields)
    const samples = await prisma.telemetrySample.findMany({
      where: {
        assetId,
        dayIndex: dayNum,
      },
      select: {
        id: true,
        dayIndex: true,
        cycleIndex: true,
        missionId: true,
        currentA: true,
        temperatureC: true,
        cells: {
          select: {
            cellIndex: true,
            voltage: true,
          },
          orderBy: { cellIndex: 'asc' },
        },
      },
      take: 50, // Limit to 50 samples to avoid timeout
    })

    console.log(`🔍 Found ${samples.length} samples`)

    if (samples.length === 0) {
      return res.status(404).json({ error: `No telemetry found for day ${dayNum}` })
    }

    // Transform to API response format
    const response = samples.map((sample: any) => {
      const cellVoltages: { [key: string]: number } = {}
      sample.cells.forEach((cell: any) => {
        cellVoltages[`V${cell.cellIndex}`] = cell.voltage
      })

      return {
        dayIndex: sample.dayIndex,
        cycleIndex: sample.cycleIndex,
        missionId: sample.missionId,
        currentA: sample.currentA,
        temperatureC: sample.temperatureC,
        ...cellVoltages,
      }
    })

    console.log(`✅ Found ${response.length} samples for day ${dayNum}`)
    res.json(response)
  } catch (error) {
    console.error('❌ Error fetching telemetry day:', error)
    res.status(500).json({ error: 'Failed to fetch telemetry day' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📡 API endpoints:`)
  console.log(`   - GET http://localhost:${PORT}/api/fleet/summary`)
  console.log(`   - GET http://localhost:${PORT}/api/fleet/assets`)
  console.log(`   - GET http://localhost:${PORT}/api/assets/:assetId/telemetry/days`)
  console.log(`   - GET http://localhost:${PORT}/api/assets/:assetId/telemetry/day/:dayIndex`)
  console.log(`   - GET http://localhost:${PORT}/health`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})
