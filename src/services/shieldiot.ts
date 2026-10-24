export type ModelStatus = 'connected' | 'connecting' | 'unavailable' | 'demo';
export type Risk = 'Low' | 'Medium' | 'High';

export interface DeviceAssessmentPayload {
  manufacturer?: string;
  model?: string;
  firmware?: string;
  labelText?: string;
  qrCode?: string;
}

export interface AssessmentFinding {
  risk: Risk;
  title: string;
  text: string;
  cwe?: string;
  recommendation?: string;
}

export interface AssessmentResult {
  id?: number;
  device: {
    manufacturer: string;
    model: string;
    firmware: string;
  };
  score: number;
  risk: Risk;
  findingsCount: number;
  highRiskCount: number;
  findings: AssessmentFinding[];
  recommendations: string[];
  confidence: string;
  timestamp: string;
  summary: string;
}

export interface CodeAuditFinding {
  risk: Risk;
  line: number | string;
  cwe?: string;
  title: string;
  text: string;
  remediation?: string;
}

export interface CodeAuditResult {
  id?: number;
  language: string;
  findingsCount: number;
  highRiskCount: number;
  risk: Risk;
  findings: CodeAuditFinding[];
  remediationCode: string;
  timestamp: string;
}

export interface ChatMessageResult {
  text: string;
  role: 'ai' | 'user';
  evidence?: string;
  model?: string;
  timestamp: string;
  conversationId?: string;
}

export interface ExtractedVisualMetadata {
  manufacturer: string;
  model: string;
  firmware: string;
  serialNumber?: string;
  fccId?: string;
  macAddress?: string;
  qrData?: string;
  confidence: string;
  labelText?: string;
}

export interface VisionScanResult {
  success: boolean;
  scanType: string;
  extracted: ExtractedVisualMetadata;
  assessment: AssessmentResult;
  timestamp: string;
}

export interface ReportItem {
  id?: number;
  category: string;
  title: string;
  risk: Risk;
  summary?: string;
  date: string;
  details?: Record<string, unknown>;
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const apiBaseUrl = rawBaseUrl.replace(/\/+$/, '');

async function request<T>(path: string, body?: unknown, method?: string): Promise<T> {
  const url = `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const response = await fetch(url, {
    method: method || (body ? 'POST' : 'GET'),
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const shieldIoTApi = {
  modelStatus: async (): Promise<{ status: ModelStatus; model?: string; engine?: string }> => {
    try {
      return await request<{ status: ModelStatus; model?: string; engine?: string }>('/health/model');
    } catch {
      return { status: 'demo' };
    }
  },
  assessDevice: (payload: DeviceAssessmentPayload): Promise<AssessmentResult> =>
    request<AssessmentResult>('/assessments/devices', payload),
  visionScan: (payload: { imageBase64?: string; fileName?: string; labelText?: string; qrCode?: string }): Promise<VisionScanResult> =>
    request<VisionScanResult>('/assessments/vision-scan', payload),
  analyzeCode: (payload: { code: string; language: string }): Promise<CodeAuditResult> =>
    request<CodeAuditResult>('/audits/code', payload),
  chat: (payload: { message: string; conversationId?: string }): Promise<ChatMessageResult> =>
    request<ChatMessageResult>('/ai/chat', payload),
  explainIncident: (payload: { incidentId: string }): Promise<Record<string, unknown>> =>
    request<Record<string, unknown>>('/incidents/explain', payload),
  reports: (query?: { category?: string; search?: string }): Promise<ReportItem[]> => {
    const params = new URLSearchParams();
    if (query?.category && query.category !== 'All') params.append('category', query.category);
    if (query?.search) params.append('search', query.search);
    const qs = params.toString();
    return request<ReportItem[]>(`/reports${qs ? `?${qs}` : ''}`);
  },
  devices: (): Promise<Array<Record<string, unknown>>> => request<Array<Record<string, unknown>>>('/devices'),
  overview: (): Promise<Record<string, unknown>> => request<Record<string, unknown>>('/overview'),
  runSimulator: (payload: { type: string; targetId?: number }) =>
    request<Record<string, unknown>>('/simulator/scenario', payload),
  isolateDevice: (deviceId: number) =>
    request<{ success: boolean; isolated: boolean }>('/simulator/isolate', { deviceId }),
  restoreDevice: (deviceId: number) =>
    request<{ success: boolean; isolated: boolean }>('/simulator/restore', { deviceId }),
};
