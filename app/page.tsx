'use client';

import { useState } from 'react';
import { EntryForm } from '@/components/entry-form';
import { OutputDisplay } from '@/components/output-display';
import { SessionHistory } from '@/components/session-history';
import { ThemeToggle } from '@/components/theme-toggle';
import { FormData, HistoryEntry } from '@/types';
import { FileText } from 'lucide-react';
import { generateWithFallback } from '@/lib/transformation-engine';

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
      // Show error to user
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
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TimeCraft</h1>
              <p className="text-sm text-muted-foreground">
                Helping legal professionals craft polished billing descriptions in seconds
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl" role="main">
        <div className="space-y-8">
          {/* Form Section */}
          <section>
            <EntryForm onSubmit={handleGenerate} isGenerating={isGenerating} />
          </section>

          {/* Output Section */}
          {output && (
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
          {!output && (
            <section className="text-center text-muted-foreground text-sm space-y-2">
              <p>Select an activity type to begin</p>
              <p className="text-xs">
                All entries will follow the Golden Formula: ActionVerb + SpecificTask + Context/Reason
              </p>
            </section>
          )}

          {/* Session History */}
          {history.length > 0 && (
            <section>
              <SessionHistory history={history} onClear={handleClearHistory} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
