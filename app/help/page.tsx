"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/lib/store";
import {
  Search,
  HelpCircle,
  Book,
  Zap,
  Calendar,
  Settings,
  Timer,
  Trophy,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Mail,
  X,
  Send,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
    questions: [
      {
        q: "How do I create my first habit?",
        a: "To create a new habit, click the '+' button on the dashboard. Enter your habit details, set your target frequency, and click 'Create'. Your new habit will appear on your dashboard ready to be tracked.",
      },
      {
        q: "What are habit streaks?",
        a: "Streaks show how many consecutive days you've completed a habit. They help motivate you by visualizing your consistency. Keep your streak alive by completing your habits daily!",
      },
      {
        q: "How do I track my progress?",
        a: "Your progress is automatically tracked on the dashboard and in detailed analytics. View daily, weekly, and monthly trends, completion rates, and streaks to understand your habit-forming journey.",
      },
    ],
  },
  {
    id: "tracking",
    title: "Habit Tracking",
    icon: Timer,
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
    questions: [
      {
        q: "How do I mark a habit as complete?",
        a: "Simply click the checkbox next to your habit to mark it as complete. The app automatically records the completion time and updates your statistics.",
      },
      {
        q: "Can I track habits for previous days?",
        a: "Yes! Use the calendar view to navigate to previous days and update your habit completions. This helps maintain accurate records if you forget to log a completion.",
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Insights",
    icon: TrendingUp,
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-500",
    questions: [
      {
        q: "What do the analytics show?",
        a: "Analytics provide insights into your habit performance, including completion rates, streaks, best performing days, and trend analysis. Use these insights to optimize your habit-forming journey.",
      },
      {
        q: "How are streaks calculated?",
        a: "Streaks count consecutive days where you've completed a habit. They reset if you miss a day, unless you have streak protection enabled with a Pro subscription.",
      },
    ],
  },
  {
    id: "pro-features",
    title: "Pro Features",
    icon: Trophy,
    gradient: "from-amber-500/10 to-yellow-500/10",
    iconColor: "text-amber-500",
    questions: [
      {
        q: "What's included in Pro?",
        a: "Pro includes advanced analytics, unlimited habits, streak protection, custom categories, priority support, and more. Upgrade to Pro to unlock the full potential of your habit tracking.",
      },
      {
        q: "How do I upgrade to Pro?",
        a: "Click the 'Upgrade to Pro' button in the settings or upgrade prompts throughout the app. Choose your preferred billing cycle and complete the payment process to instantly unlock all Pro features.",
      },
    ],
  },
];

interface ContactFormData {
  email: string;
  subject: string;
  message: string;
}
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

export default function HelpPage() {
  const { isPro } = useHabitStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    email: "",
    subject: "",
    message: "",
  });

  const filteredCategories = helpCategories.filter((category) => {
    const matchesSearch =
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.questions.some(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  const handleContactSubmit = async () => {
    if (!formData.email || !formData.subject || !formData.message) return;

    setIsSubmitting(true);
    // Here you would typically send the contact form data to your backend
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after delay
    setTimeout(() => {
      setIsSubmitted(false);
      setIsContactOpen(false);
      setFormData({ email: "", subject: "", message: "" });
    }, 2000);
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Help Center</h1>
            {isPro && (
              <Badge className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-500 ml-2">
                PRO
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Find answers to common questions and learn how to make the most of
            On Track.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help..."
              className="pl-10 py-6 text-lg bg-background/50 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "backdrop-blur-sm bg-gradient-to-r border-muted/20",
                    category.gradient
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          category.iconColor,
                          "bg-white/10"
                        )}
                      >
                        <category.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {category.questions.length} articles
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {category.questions.map((question, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category.id}-${index}`}
                        >
                          <AccordionTrigger className="text-left">
                            {question.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {question.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Still need help?</h3>
                    <p className="text-muted-foreground">
                      Contact our support team for personalized assistance
                    </p>
                  </div>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setIsContactOpen(true)}
                >
                  <span className="flex items-center gap-2">
                    Contact Support
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Dialog */}
        <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Support
              </DialogTitle>
              <DialogDescription>
                Send us a message and we'll get back to you as soon as possible.
                {isPro && (
                  <span className="flex items-center gap-2 mt-2 text-violet-500">
                    <Zap className="w-4 h-4" />
                    Priority support enabled
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  type="email"
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Describe your issue or question..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="min-h-[150px] bg-muted/50"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsContactOpen(false)}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleContactSubmit}
                disabled={
                  !formData.email ||
                  !formData.subject ||
                  !formData.message ||
                  isSubmitting
                }
                className={cn(
                  "bg-primary",
                  isPro ? "bg-gradient-to-r from-violet-500 to-purple-500" : ""
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
                    <Zap className="w-4 h-4" />
                  </motion.div>
                ) : isSubmitted ? (
                  <span className="flex items-center gap-2">
                    Sent Successfully
                    <Check className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message
                    <Send className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
