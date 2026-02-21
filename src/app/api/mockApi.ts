export interface AnalysisRequest {
  topic: string;
  audio: File;
}

export interface AnalysisResponse {
  recognizedText: string;
  comprehensionScore: number;
  correctAspects: string[];
  errors: string[];
  recommendations: string[];
}

export interface SavedAnalysis extends AnalysisResponse {
  id: string;
  topic: string;
  date: string;
  audioName: string;
  audioUrl?: string;
}

// Работа с локальным хранилищем
const STORAGE_KEY = "analysis_history";

export function saveAnalysis(analysis: SavedAnalysis): void {
  const history = getAnalysisHistory();
  history.unshift(analysis);
  // Храним максимум 10 записей
  const trimmedHistory = history.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
}

export function getAnalysisHistory(): SavedAnalysis[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearAnalysisHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteAnalysis(id: string): void {
  const history = getAnalysisHistory();
  const filtered = history.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
