import { motion } from "motion/react";
import { CheckCircle2, XCircle, Lightbulb, FileText, Sparkles, TrendingUp } from "lucide-react";
import { ScoreIndicator } from "./ScoreIndicator";
import type { AnalysisResponse } from "../api/mockApi";

interface ResultsDisplayProps {
  results: AnalysisResponse;
  topic: string;
  onReset: () => void;
}

export function ResultsDisplay({ results, topic, onReset }: ResultsDisplayProps) {
  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🎉"; // отлично
    if (score >= 80) return "🌟"; // хорошо
    if (score >= 70) return "👍"; // удовлетворительно
    if (score >= 60) return "📝"; // слабовато
    return "📚"; // плохо
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Отличное понимание темы!";
    if (score >= 80) return "Хорошее понимание материала";
    if (score >= 70) return "Удовлетворительное понимание";
    if (score >= 60) return "Необходимо углубить знания";
    return "Требуется дополнительное изучение";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Заголовок с темой */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm opacity-90">Анализ завершен</span>
            </div>
            <h2 className="text-2xl">Тема: {topic}</h2>
          </div>
          <div className="text-5xl">{getScoreEmoji(results.comprehensionScore)}</div>
        </div>
      </motion.div>

      {/* Оценка понимания */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ScoreIndicator score={results.comprehensionScore} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
        >
          <p className="text-center text-gray-700 font-medium">
            {getScoreMessage(results.comprehensionScore)}
          </p>
        </motion.div>
      </motion.div>

      {/* Сетка с результатами */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Правильные аспекты */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Правильные аспекты</h3>
              <p className="text-xs text-gray-500">{results.correctAspects.length} пунктов</p>
            </div>
          </div>
          <ul className="space-y-3">
            {results.correctAspects.map((aspect, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-green-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{aspect}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Ошибки */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium">Ошибки и упущения</h3>
              <p className="text-xs text-gray-500">{results.errors.length} пунктов</p>
            </div>
          </div>
          <ul className="space-y-3">
            {results.errors.map((error, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-red-50 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
              >
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Распознанный текст */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">Распознанный текст</h3>
            <p className="text-xs text-gray-500">Транскрипция аудиозаписи</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 max-h-64 overflow-y-auto border border-gray-200">
          <p className="text-gray-700 leading-relaxed text-sm">
            {results.recognizedText}
          </p>
        </div>
      </motion.div>

      {/* Рекомендации */}
      <motion.div
        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 border border-yellow-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-medium">Рекомендации по улучшению</h3>
            <p className="text-xs text-gray-600">Следуйте этим советам для повышения уровня</p>
          </div>
        </div>
        <ul className="space-y-3">
          {results.recommendations.map((recommendation, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-3 text-sm text-gray-700 p-4 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <div className="p-1 bg-yellow-100 rounded">
                <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              </div>
              <span>{recommendation}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Кнопка повторного анализа */}
      <motion.div
        className="flex justify-center pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button
          onClick={onReset}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Провести новый анализ
        </button>
      </motion.div>
    </motion.div>
  );
}
