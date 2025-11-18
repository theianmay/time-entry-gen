'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutputDisplayProps {
  output: string;
  time?: number;
  usedFallback: boolean;
  onClear: () => void;
}

export function OutputDisplay({ output, time, usedFallback, onClear }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Build the full text to copy including time if present
      let textToCopy = output;
      if (time) {
        textToCopy += `\n\nTime: ${time} hours (${Math.round(time * 60)} minutes)`;
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Generated Billing Narrative</CardTitle>
            <CardDescription>
              Copy this to your billing system
            </CardDescription>
          </div>
          {usedFallback && (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Fallback Mode</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {usedFallback && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">AI service unavailable</p>
            <p className="text-xs">
              Using rule-based transformation. Output follows core rules but may be less polished.
            </p>
          </div>
        )}

        <div className="bg-muted rounded-lg p-4 font-mono text-sm leading-relaxed">
          {output}
        </div>

        {time && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">Time:</span>
            <span className="font-semibold">{time} hours</span>
            <span className="text-muted-foreground">
              ({Math.round(time * 60)} minutes)
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="default"
            className="flex-1"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <Button onClick={onClear} variant="outline">
            Generate New Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
