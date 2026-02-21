import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnalysisForm } from "./components/AnalysisForm";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { AnalysisHistory } from "./components/AnalysisHistory";

import { analyzeAudio, type AnalysisResponse } from "./api/realApi";

import {
  saveAnalysis,
  getAnalysisHistory,
  clearAnalysisHistory,
  deleteAnalysis,
  type SavedAnalysis,
} from "./api/mockApi";

import { GraduationCap, AlertCircle } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [currentAudioName, setCurrentAudioName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = getAnalysisHistory();
    setHistory(savedHistory);
    setShowHistory(savedHistory.length > 0);
  };

  const handleAnalyze = async (topic: string, audio: File) => {
    setIsLoading(true);
    setError(null);
    setCurrentTopic(topic);
    setCurrentAudioName(audio.name);

    try {
      const response = await analyzeAudio({ topic, audio });
      setResults(response);

      // Сохраняем в историю
      const savedAnalysis: SavedAnalysis = {
        ...response,
        id: Date.now().toString(),
        topic,
        date: new Date().toISOString(),
        audioName: audio.name,
      };
      saveAnalysis(savedAnalysis);
      loadHistory();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при анализе. Попробуйте снова."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setCurrentTopic("");
    setCurrentAudioName("");
  };

  const handleSelectAnalysis = (analysis: SavedAnalysis) => {
    setResults(analysis);
    setCurrentTopic(analysis.topic);
    setCurrentAudioName(analysis.audioName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteAnalysis = (id: string) => {
    deleteAnalysis(id);

    const updatedHistory = getAnalysisHistory();
    setHistory(updatedHistory);

    if (!updatedHistory.find((h) => h.id === id)) {
      handleReset();
    }
  };

  const handleClearHistory = () => {
    if (
      confirm("Вы уверены, что хотите удалить всю историю анализов?")
    ) {
      clearAnalysisHistory();
      loadHistory();
      if (results) {
        handleReset();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Заголовок */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl">Анализ устного ответа</h1>
                <p className="text-sm text-gray-600">
                  Оценка понимания материала с помощью ИИ
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                {showHistory ? "Скрыть историю" : "Показать историю"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 mb-1">Ошибка</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная колонка */}
          <div className="lg:col-span-2 space-y-6">
            {!results ? (
              <AnalysisForm onSubmit={handleAnalyze} isLoading={isLoading} />
            ) : (
              <ResultsDisplay
                results={results}
                topic={currentTopic}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Боковая панель с историей */}
          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-1"
              >
                <div className="lg:sticky lg:top-24">
                  <AnalysisHistory
                    history={history}
                    onSelectAnalysis={handleSelectAnalysis}
                    onDeleteAnalysis={handleDeleteAnalysis}
                    onClearHistory={handleClearHistory}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>


    </div>
  );
}
