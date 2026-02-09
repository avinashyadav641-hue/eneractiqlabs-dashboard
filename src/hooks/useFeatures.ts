/**
 * React hooks for fetching model data
 * All hooks use the new /api/features endpoints
 */

import { useState, useEffect } from 'react'
import type {
  DailyFeaturesResponse,
  SoHHistoryResponse,
  FleetAggregatedResponse,
  LatestSnapshot,
  MultiDayComparisonResponse,
  ChargingSessionResponse,
  HPPCResponse,
} from '../types/features'

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.eneractiqlabs.in'

// Note: API endpoints now use /drone/{id}/... pattern, not /api/features/drone/{id}/...

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
          `${API_BASE}/drone/${droneId}/daily/latest`
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
          `${API_BASE}/drone/${droneId}/daily/${dayIndex}`
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
          `${API_BASE}/drone/${droneId}/soh`
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
          `${API_BASE}/drone/${droneId}/snapshot`
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

// Hook: Fetch HPPC (Dynamic Power Capability) data for a drone
export const useHPPC = (droneId: string) => {
  const [data, setData] = useState<HPPCResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_BASE}/drone/${droneId}/hppc`
        )
        if (!response.ok) throw new Error('Failed to fetch HPPC data')
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

export const useFleetAggregated = () => {
  const [data, setData] = useState<FleetAggregatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE}/fleet/aggregated`)
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
          `${API_BASE}/drone/${droneId}/compare`
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

// Hook: Fetch charging session plan for a drone
export const useChargingSession = (droneId: string) => {
  const [data, setData] = useState<ChargingSessionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_BASE}/drone/${droneId}/charging`
        )
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Return null data on error/404 to trigger "Awaiting data" state
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (droneId) fetchData()
  }, [droneId])

  return { data, loading, error }
}
