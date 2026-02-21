export interface AnalysisResponse {
    transcribed_text: string;
    analysis: {
        score: number;
        correct_aspects: string[];
        mistakes: string[];
        recommendations: string[];
    };
}