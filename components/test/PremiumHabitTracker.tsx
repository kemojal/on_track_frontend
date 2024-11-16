import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Settings2, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PremiumHabitTracker = ({ 
  selectedHabit, 
  isTracking, 
  elapsed, 
  handleStartTracking, 
  handleStopTracking, 
  setShowSettingsDialog,
  habits,
  formatTime 
}) => {
  return (
    <AnimatePresence mode="wait">
      {selectedHabit ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center justify-center space-y-8 py-12"
        >
          <Card className="relative p-8 backdrop-blur-sm bg-background/50 shadow-xl rounded-xl border border-primary/10">
            <div className="absolute -top-3 -right-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-primary/50" />
              </motion.div>
            </div>
            
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: isTracking ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-64 h-64 rounded-full bg-primary/5"
                />
              </div>
              
              <motion.div
                animate={{ rotate: isTracking ? 360 : 0 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="relative z-10"
              >
                <CircularProgressbar
                  value={isTracking ? (elapsed / (25 * 60)) * 100 : 0}
                  text={formatTime(elapsed)}
                  styles={{
                    root: { width: '100%', height: '100%' },
                    path: {
                      stroke: selectedHabit?.color || 'hsl(var(--primary))',
                      strokeLinecap: 'round',
                      transition: 'stroke-dashoffset 0.5s ease 0s',
                      filter: 'drop-shadow(0 0 8px hsl(var(--primary)))',
                    },
                    trail: {
                      stroke: 'hsl(var(--muted))',
                      strokeLinecap: 'round',
                    },
                    text: {
                      fill: 'hsl(var(--foreground))',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              {!isTracking ? (
                <Button
                  onClick={handleStartTracking}
                  size="lg"
                  className="relative px-8 py-6 overflow-hidden group"
                >
                  <div className="absolute inset-0 w-3 bg-primary transition-all duration-[250ms] ease-out group-hover:w-full" />
                  <div className="relative text-primary-foreground group-hover:text-white text-lg font-medium transition-colors">
                    Start Tracking
                  </div>
                </Button>
              ) : (
                <Button
                  onClick={handleStopTracking}
                  size="lg"
                  variant="destructive"
                  className="relative px-8 py-6 overflow-hidden group transition-all"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform rotate-12 translate-x-1 bg-white opacity-10 group-hover:translate-x-0" />
                  <span className="relative text-lg font-medium">Stop</span>
                </Button>
              )}
              
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSettingsDialog(true)}
                className="relative p-3 group"
              >
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-primary/10 transition-opacity" />
                <Settings2 className="w-5 h-5 transition-transform group-hover:rotate-90" />
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center justify-center py-12 space-y-4"
        >
          <Award className="w-16 h-16 text-primary/30" />
          <p className="text-lg text-muted-foreground">
            {habits.length > 0
              ? "Select a habit to begin your journey"
              : "Create a habit to start building better routines"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumHabitTracker;