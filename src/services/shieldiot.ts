export type ModelStatus = 'connected' | 'connecting' | 'unavailable' | 'demo'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

async function request<T>(path: string, body?: unknown): Promise<T> {
  if (!apiBaseUrl) throw new Error('Backend is not configured; ShieldIoT is in demo mode.')
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json() as Promise<T>
}

export const shieldIoTApi = {
  modelStatus: () => apiBaseUrl ? request<{ status: ModelStatus }>('/health/model') : Promise.resolve({ status: 'demo' as ModelStatus }),
  assessDevice: (payload: { manufacturer?: string; model?: string; firmware?: string }) => request('/assessments/devices', payload),
  analyzeCode: (payload: { code: string; language: string }) => request('/audits/code', payload),
  chat: (payload: { message: string; conversationId?: string }) => request('/ai/chat', payload),
  explainIncident: (payload: { incidentId: string }) => request('/incidents/explain', payload),
  reports: () => request('/reports'),
}
