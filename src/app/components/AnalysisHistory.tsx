import { motion } from "motion/react";
import { History, Trash2, FileAudio, Calendar, TrendingUp } from "lucide-react";
import type { SavedAnalysis } from "../api/mockApi";

interface AnalysisHistoryProps {
  history: SavedAnalysis[];
  onSelectAnalysis: (analysis: SavedAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
  onClearHistory: () => void;
}

export function AnalysisHistory({
  history,
  onSelectAnalysis,
  onDeleteAnalysis,
  onClearHistory,
}: AnalysisHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  const safeScores = history.map((item) =>
      typeof item.comprehensionScore === "number"
          ? item.comprehensionScore
          : 0
  );

  const averageScore =
      safeScores.length > 0
          ? safeScores.reduce((sum, score) => sum + score, 0) /
          safeScores.length
          : 0;

  const bestScore =
      safeScores.length > 0 ? Math.max(...safeScores) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <History className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium">История анализов</h3>
            <p className="text-xs text-gray-500">
              {history.length} {history.length === 1 ? "запись" : "записей"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-500">Средний балл</div>
            <div className="text-lg font-medium text-purple-600">
              {averageScore.toFixed(1)}
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Очистить историю"
            >
              <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* Статистика */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Статистика</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {history.length}
            </div>
            <div className="text-xs text-gray-600">Анализов</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {bestScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Лучший</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {averageScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Средний</div>
          </div>
        </div>
      </motion.div>

      {/* Список анализов */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="group relative bg-gray-50 hover:bg-gray-100 rounded-xl p-4 cursor-pointer transition-all border border-gray-200 hover:border-purple-300"
            onClick={() => onSelectAnalysis(item)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FileAudio className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <h4 className="font-medium text-gray-900 truncate">
                    {item.topic}
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="truncate">{item.audioName}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                    item.comprehensionScore
                  )}`}
                >
                  {(item.comprehensionScore ?? 0).toFixed(1)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAnalysis(item.id);
                  }}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
