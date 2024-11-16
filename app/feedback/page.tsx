"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useHabitStore } from "@/lib/store";
import {
  MessageSquare,
  Send,
  Smile,
  Frown,
  Meh,
  Sparkles,
  Star,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const feedbackTypes = [
  {
    value: "bug",
    label: "Report a Bug",
    icon: Frown,
    description: "Help us squash bugs and improve stability",
    gradient: "from-red-500/10 to-orange-500/10",
    iconColor: "text-red-500",
  },
  {
    value: "feature",
    label: "Feature Request",
    icon: Sparkles,
    description: "Share your ideas for new features",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
  },
  {
    value: "improvement",
    label: "Suggest Improvement",
    icon: ThumbsUp,
    description: "Help us make existing features better",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    value: "other",
    label: "General Feedback",
    icon: Star,
    description: "Share any other thoughts",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FeedbackPage() {
  const { isPro } = useHabitStore();
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 1000;

  useEffect(() => {
    setCharCount(feedback.length);
  }, [feedback]);

  const selectedType = feedbackTypes.find(
    (type) => type.value === feedbackType
  );

  const handleSubmit = async () => {
    if (!feedbackType || !feedback.trim()) return;

    setIsSubmitting(true);
    // Here you would typically send the feedback to your backend
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setFeedbackType("");
      setFeedback("");
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div className="container max-w-3xl mx-auto p-4 space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Feedback</h1>
            {isPro && (
              <Badge className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-500 ml-2">
                PRO
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Your feedback helps shape the future of On Track. We carefully
            review every submission to make our product better.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-sm bg-gradient-to-r from-card/50 to-card border-muted/20">
            <CardHeader className="space-y-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  Share Your Thoughts
                  <Zap className="w-5 h-5 text-yellow-500" />
                </CardTitle>
                <CardDescription className="text-base">
                  Help us improve On Track by sharing your experience and ideas.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-medium">Type of Feedback</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbackTypes.map(
                    ({
                      value,
                      label,
                      icon: Icon,
                      description,
                      gradient,
                      iconColor,
                    }) => (
                      <motion.div
                        key={value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFeedbackType(value)}
                        className={cn(
                          "cursor-pointer p-4 rounded-xl transition-all duration-200",
                          "bg-gradient-to-r",
                          gradient,
                          feedbackType === value
                            ? "ring-2 ring-primary"
                            : "hover:ring-1 hover:ring-primary/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg",
                              iconColor,
                              "bg-white/10"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{label}</h3>
                            <p className="text-sm text-muted-foreground">
                              {description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {feedbackType && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        Your Feedback
                      </label>
                      <span
                        className={cn(
                          "text-sm",
                          charCount > maxChars
                            ? "text-red-500"
                            : "text-muted-foreground"
                        )}
                      >
                        {charCount}/{maxChars}
                      </span>
                    </div>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={
                        selectedType
                          ? `Tell us about your ${selectedType.label.toLowerCase()}...`
                          : "Your feedback"
                      }
                      className="min-h-[200px] resize-none bg-background/50 backdrop-blur-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={false}
                animate={{
                  height: feedbackType && feedback ? "auto" : 0,
                  opacity: feedbackType && feedback ? 1 : 0,
                }}
                className="overflow-hidden"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !feedbackType ||
                    !feedback.trim() ||
                    isSubmitting ||
                    charCount > maxChars
                  }
                  className={cn(
                    "w-full bg-gradient-to-r",
                    selectedType?.gradient || "from-primary to-primary",
                    "hover:opacity-90 transition-opacity"
                  )}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                  ) : isSubmitted ? (
                    <span className="flex items-center gap-2">
                      Thank you for your feedback!
                      <Smile className="w-5 h-5" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Submit Feedback
                      <Send className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
