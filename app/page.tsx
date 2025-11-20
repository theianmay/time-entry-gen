'use client';

import { useState } from 'react';
import { EntryForm } from '@/components/entry-form';
import { OutputDisplay } from '@/components/output-display';
import { OutputSkeleton } from '@/components/output-skeleton';
import { SessionHistory } from '@/components/session-history';
import { ThemeToggle } from '@/components/theme-toggle';
import { FormData, HistoryEntry } from '@/types';
import { FileText, Sparkles } from 'lucide-react';
import { generateWithFallback } from '@/lib/transformation-engine';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Home() {
  const [output, setOutput] = useState<string | null>(null);
  const [time, setTime] = useState<number | undefined>(undefined);
  const [clientMatter, setClientMatter] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleGenerate = async (data: FormData) => {
    setIsGenerating(true);
    setUsedFallback(false);

    try {
      // Generate billing narrative using AI with fallback
      const result = await generateWithFallback({
        activity: data.activity,
        subject: data.subject,
        goal: data.goal,
      });

      setOutput(result.output);
      setTime(data.time);
      setClientMatter(data.clientMatter);
      setUsedFallback(result.method === 'fallback');

      // Add to history
      const historyEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        input: data,
        output: result.output,
        usedFallback: result.method === 'fallback',
      };
      setHistory((prev) => [historyEntry, ...prev]); // Newest first
    } catch (error) {
      console.error('Generation failed:', error);
      // Show error to user with toast
      toast.error('Generation failed', {
        description: 'Please try again or check your connection',
      });
      setOutput('Error: Failed to generate narrative. Please try again.');
      setUsedFallback(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setOutput(null);
    setTime(undefined);
    setUsedFallback(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient */}
      <header className="border-b relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-emerald-500/5" />
        
        <div className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-3 shadow-lg">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  TimeCraft
                </h1>
                <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Transform time entries into polished billing narratives in seconds
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl" role="main">
        <div className="space-y-8">
          {/* Form Section */}
          <section>
            <EntryForm onSubmit={handleGenerate} isGenerating={isGenerating} />
          </section>

          {/* Loading Skeleton */}
          {isGenerating && (
            <section>
              <OutputSkeleton />
            </section>
          )}

          {/* Output Section */}
          {!isGenerating && output && (
            <section>
              <OutputDisplay
                output={output}
                time={time}
                clientMatter={clientMatter}
                usedFallback={usedFallback}
                onClear={handleClear}
              />
            </section>
          )}

          {/* Help Text */}
          {!output && !isGenerating && (
            <motion.section 
              className="text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 text-muted-foreground text-sm bg-muted/50 px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <p>Select an activity type to begin</p>
              </div>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                All entries follow the <span className="font-semibold text-foreground">Golden Formula</span>: 
                ActionVerb + SpecificTask + Context/Reason
              </p>
            </motion.section>
          )}

          {/* Session History */}
          {history.length > 0 && (
            <section>
              <SessionHistory history={history} onClear={handleClearHistory} />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg p-1.5">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <p>
                TimeCraft <span className="text-xs">v0.1.0</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p>Built with</p>
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <p>for legal professionals</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
