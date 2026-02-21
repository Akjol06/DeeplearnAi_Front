import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ScoreIndicatorProps {
  score: number;
}

export function ScoreIndicator({ score }: ScoreIndicatorProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);

    // Анимация числа
    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(score, increment * step);
      setDisplayScore(current);

      if (step >= steps) {
        clearInterval(interval);
        setDisplayScore(score);
      }
    }, duration / steps);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return "from-green-500 to-emerald-500";
    if (score >= 6) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const getGlowColor = (score: number) => {
    if (score >= 8) return "shadow-green-500/50";
    if (score >= 6) return "shadow-yellow-500/50";
    return "shadow-red-500/50";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg mb-1">Оценка понимания темы</h3>
          <p className="text-sm text-gray-500">
            {score >= 8 && "Отлично! Глубокое понимание материала"}
            {score >= 6 && score < 8 && "Хорошо! Есть пространство для улучшения"}
            {score < 6 && "Требуется дополнительное изучение"}
          </p>
        </div>
        <motion.div
          className={`relative ${getScoreColor(score)}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
        >
          <motion.div
            className={`absolute inset-0 blur-2xl ${getGlowColor(score)} opacity-50`}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative text-6xl font-bold">
            {displayScore.toFixed(1)}
            <span className="text-2xl text-gray-400 font-normal">/10</span>
          </div>
        </motion.div>
      </div>

      <div className="relative">
        <div className="h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor(
              score
            )} rounded-full relative overflow-hidden shadow-lg`}
            initial={{ width: 0 }}
            animate={{ width: `${(animatedScore / 10) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          >
            {/* Анимированный блеск */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: 1.5,
              }}
            />
          </motion.div>
        </div>

        {/* Метки прогресса */}
        <div className="flex justify-between mt-2 px-1">
          {[0, 2, 4, 6, 8, 10].map((mark) => (
            <div
              key={mark}
              className="flex flex-col items-center"
              style={{ opacity: animatedScore >= mark ? 1 : 0.3 }}
            >
              <div className="w-px h-2 bg-gray-400" />
              <span className="text-xs text-gray-500 mt-1">{mark}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Процентная шкала */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex justify-between text-sm"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">
            {((displayScore / 10) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">Успешность</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">
            {score >= 8 ? "A" : score >= 6 ? "B" : score >= 4 ? "C" : "D"}
          </div>
          <div className="text-xs text-gray-500">Оценка</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">
            {10 - Math.floor(score)}
          </div>
          <div className="text-xs text-gray-500">До 10</div>
        </div>
      </motion.div>
    </div>
  );
}
