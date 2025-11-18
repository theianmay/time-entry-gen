'use client';

import { useState } from 'react';
import { EntryForm } from '@/components/entry-form';
import { OutputDisplay } from '@/components/output-display';
import { ThemeToggle } from '@/components/theme-toggle';
import { FormData } from '@/types';
import { FileText } from 'lucide-react';

export default function Home() {
  const [output, setOutput] = useState<string | null>(null);
  const [time, setTime] = useState<number | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  const handleGenerate = async (data: FormData) => {
    setIsGenerating(true);
    setUsedFallback(false);

    try {
      // TODO: Implement API call in Phase 2
      // For now, mock output
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockOutput = `Telephone conference with ${data.subject} regarding ${data.goal} to determine next steps and strategic approach.`;
      setOutput(mockOutput);
      setTime(data.time);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setOutput(null);
    setTime(undefined);
    setUsedFallback(false);
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
              <h1 className="text-xl font-bold">Legal Billing Generator</h1>
              <p className="text-sm text-muted-foreground">
                Transform time entries into compliant narratives
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
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
        </div>
      </main>
    </div>
  );
}
