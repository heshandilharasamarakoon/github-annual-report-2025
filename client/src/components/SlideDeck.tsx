import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { WelcomeSlide } from './slides/WelcomeSlide';
import { StatsOverviewSlide } from './slides/StatsOverviewSlide';
import { RepositoriesSlide } from './slides/RepositoriesSlide';
import { LanguageSlide } from './slides/LanguageSlide';
import { ActivityTrendSlide } from './slides/ActivityTrendSlide';
import { QuarterAnalysisSlide } from './slides/QuarterAnalysisSlide';
import { HeatmapSlide } from './slides/HeatmapSlide';
import { RadarSlide } from './slides/RadarSlide';
import { FinalSlide } from './slides/FinalSlide';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useCallback } from 'react';

const slides = [
  WelcomeSlide,
  StatsOverviewSlide,
  RepositoriesSlide,
  LanguageSlide,
  ActivityTrendSlide,
  QuarterAnalysisSlide,
  HeatmapSlide,
  RadarSlide,
  FinalSlide,
];

export function SlideDeck() {
  const { currentSlide, setCurrentSlide } = useAppStore();

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, setCurrentSlide]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide, setCurrentSlide]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  }, [handleNext, handlePrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="min-h-screen pt-12"
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <Button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          variant="outline"
          size="icon"
          className="bg-black/50 border-white/10 hover:border-[#10b981]/50 backdrop-blur"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-[#10b981] w-8' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          variant="outline"
          size="icon"
          className="bg-black/50 border-white/10 hover:border-[#10b981]/50 backdrop-blur"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

