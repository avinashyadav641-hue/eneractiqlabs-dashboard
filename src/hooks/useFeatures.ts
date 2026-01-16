/**
 * React hooks for fetching feature-engineered data
 * All hooks use the new /api/features endpoints
 */

import { useState, useEffect } from 'react'
import type {
  DailyFeaturesResponse,
  SoHHistoryResponse,
  FleetAggregatedResponse,
  LatestSnapshot,
  MultiDayComparisonResponse,
} from '../types/features'

const API_BASE = 'http://localhost:5001'

// Hook: Fetch latest daily features for a drone
export const useLatestDailyFeatures = (droneId: string) => {
  const [data, setData] = useState<DailyFeaturesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_BASE}/api/features/drone/${droneId}/daily/latest`
        )
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (droneId) fetchData()
  }, [droneId])

  return { data, loading, error }
}

// Hook: Fetch daily features for specific day
export const useDailyFeatures = (droneId: string, dayIndex: number) => {
  const [data, setData] = useState<DailyFeaturesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_BASE}/api/features/drone/${droneId}/daily/${dayIndex}`
        )
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (droneId && dayIndex) fetchData()
  }, [droneId, dayIndex])

  return { data, loading, error }
}

// Hook: Fetch SoH history for a drone
export const useSoHHistory = (droneId: string) => {
  const [data, setData] = useState<SoHHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_BASE}/api/features/drone/${droneId}/soh`
        )
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (droneId) fetchData()
  }, [droneId])

  return { data, loading, error }
}

// Hook: Fetch latest snapshot (daily + SoH) for Overview tab
export const useLatestSnapshot = (droneId: string) => {
  const [data, setData] = useState<LatestSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_BASE}/api/features/drone/${droneId}/snapshot`
        )
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (droneId) fetchData()
  }, [droneId])

  return { data, loading, error }
}

// Hook: Fetch fleet aggregated data
export const useFleetAggregated = () => {
  const [data, setData] = useState<FleetAggregatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE}/api/features/fleet/aggregated`)
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// Hook: Fetch multi-day comparison (Days 1, 7, 15) for Module Drilldown
export const useMultiDayComparison = (droneId: string) => {
  const [data, setData] = useState<MultiDayComparisonResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_BASE}/api/features/drone/${droneId}/compare`
        )
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (droneId) fetchData()
  }, [droneId])

  return { data, loading, error }
}
