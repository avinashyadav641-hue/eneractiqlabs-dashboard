import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'eVTOL API Server is running' })
})

// Fleet data endpoint
app.get('/api/fleet', (_req: Request, res: Response) => {
  res.json({
    fleetAvailability: 90,
    activeFlights: 4,
    charging: 5,
    criticalAlerts: 1,
  })
})

// Drones data endpoint
app.get('/api/drones', (_req: Request, res: Response) => {
  const drones = [
    {
      id: '001',
      name: 'Orca 001',
      status: 'flight',
      soh: 98,
      soc: 72,
      voltage: 402.5,
      cycleCount: 298,
    },
    {
      id: '004',
      name: 'Orca 004',
      status: 'fault',
      soh: 82,
      soc: 45,
      voltage: 385.2,
      cycleCount: 520,
    },
    {
      id: '007',
      name: 'Orca 007',
      status: 'charging',
      soh: 88,
      soc: 65,
      voltage: 395.8,
      cycleCount: 412,
    },
  ]
  res.json(drones)
})

// Single drone details
app.get('/api/drones/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const drone = {
    id,
    name: `Orca ${id}`,
    status: 'flight',
    soh: 98,
    soc: 72,
    voltage: 402.5,
    cycleCount: 298,
    modules: Array.from({ length: 10 }, (_, i) => ({
      id: `MOD-${String(i + 1).padStart(2, '0')}`,
      status: 'normal',
      soc: 85 + Math.floor(Math.random() * 10),
      soh: 98 + Math.random() * 2,
      voltage: 44 + Math.random() * 0.5,
    })),
  }
  res.json(drone)
})

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

export default app
