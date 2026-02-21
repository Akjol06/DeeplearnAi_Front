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

// ===============================
// Тип ответа от Symfony backend
// ===============================
interface BackendResponse {
    transcribed_text: string;
    analysis: {
        score: number;
        correct_aspects: string[];
        mistakes: string[];
        recommendations: string[];
    };
}

// ===============================
// Адаптер (backend → frontend)
// ===============================
function mapBackendToFrontend(data: BackendResponse): AnalysisResponse {
    return {
        recognizedText: data.transcribed_text ?? "",
        comprehensionScore: Number(data.analysis.score) || 0,
        correctAspects: data.analysis.correct_aspects ?? [],
        errors: data.analysis.mistakes ?? [],
        recommendations: data.analysis.recommendations ?? [],
    };
}

// ===============================
// Основной запрос к backend
// ===============================
const API_URL = import.meta.env.VITE_API_URL;

export async function analyzeAudio(
    params: AnalysisRequest
): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append("audio", params.audio);
    formData.append("topic", params.topic);

    const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
    });

    // Если сервер вернул ошибку
    if (!response.ok) {
        let errorMessage = "Ошибка сервера";

        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch {
            // если ответ не JSON
            errorMessage = response.statusText;
        }

        throw new Error(errorMessage);
    }

    const backendData: BackendResponse = await response.json();

    return mapBackendToFrontend(backendData);
}