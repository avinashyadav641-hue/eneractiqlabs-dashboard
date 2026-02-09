/**
 * API Service Layer for Analytics Backend
 * Centralized API calls to https://api.eneractiqlabs.in
 */

// Use Vite environment variable, fallback to production URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.eneractiqlabs.in';

// Types for API responses
export interface OverviewResponse {
  total_rows: number;
  device_count: number;
  min_timestamp: string | null;
  max_timestamp: string | null;
}

export interface Device {
  device_id: string;
  first_seen: string;
  last_seen: string;
  total_records: number;
}

export interface DevicesResponse {
  count: number;
  devices: Device[];
}

export interface DeviceLatest {
  device_id: string;
  timestamp: string;
  voltage?: number;
  current?: number;
  temperature?: number;
  soc?: number;
  soh?: number;
  [key: string]: unknown;
}

export interface DevicesLatestResponse {
  count: number;
  data: DeviceLatest[];
}

export interface DailySummaryItem {
  device_id: string;
  date: string;
  avg_voltage?: number;
  max_temperature?: number;
  avg_soc?: number;
}

export interface DailySummaryResponse {
  count: number;
  data: DailySummaryItem[];
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch fleet overview statistics
 */
export async function fetchOverview(): Promise<OverviewResponse> {
  return fetchAPI<OverviewResponse>('/overview');
}

/**
 * Fetch all devices with summary stats
 */
export async function fetchDevices(): Promise<DevicesResponse> {
  return fetchAPI<DevicesResponse>('/devices');
}

/**
 * Fetch latest telemetry reading per device
 */
export async function fetchDevicesLatest(): Promise<DevicesLatestResponse> {
  return fetchAPI<DevicesLatestResponse>('/devices/latest');
}

/**
 * Fetch daily summary per device
 */
export async function fetchDailySummary(): Promise<DailySummaryResponse> {
  return fetchAPI<DailySummaryResponse>('/daily-summary');
}

/**
 * Health check - useful for connection testing
 */
export async function checkHealth(): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>('/health');
}
