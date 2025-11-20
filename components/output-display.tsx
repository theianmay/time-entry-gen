'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, AlertTriangle, ListOrdered, List, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { OutputFormat } from '@/types';

interface OutputDisplayProps {
  output: string;
  time?: number;
  clientMatter?: string;
  format: OutputFormat;
  usedFallback: boolean;
  onClear: () => void;
}

export function OutputDisplay({ output, time, clientMatter, format: initialFormat, usedFallback, onClear }: OutputDisplayProps) {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedNarrative, setCopiedNarrative] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<OutputFormat>(initialFormat);
  const copyCountRef = useRef(0);
  const nextConfettiAtRef = useRef(0);

  // Format options for toggle buttons
  const FORMAT_OPTIONS = [
    { value: 'numbered' as OutputFormat, icon: ListOrdered, label: '1,2,3' },
    { value: 'bullets' as OutputFormat, icon: List, label: '• • •' },
    { value: 'hyphens' as OutputFormat, icon: Minus, label: '- - -' },
    { value: 'none' as OutputFormat, icon: X, label: 'None' },
  ];

  // Transform output based on format
  const formatOutput = (text: string, format: OutputFormat): string => {
    // Split by lines and identify numbered items
    const lines = text.split('\n');
    const formattedLines = lines.map((line) => {
      // Match numbered list items (e.g., "1. ", "2. ", etc.)
      const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
      
      if (numberedMatch) {
        const [, , content] = numberedMatch;
        switch (format) {
          case 'numbered':
            return line; // Keep as is
          case 'bullets':
            return `• ${content}`;
          case 'hyphens':
            return `- ${content}`;
          case 'none':
            return content;
          default:
            return line;
        }
      }
      return line;
    });
    return formattedLines.join('\n');
  };

  const formattedOutput = formatOutput(output, currentFormat);

  const shouldTriggerConfetti = () => {
    copyCountRef.current += 1;
    
    // First copy always gets confetti
    if (copyCountRef.current === 1) {
      // Set next confetti trigger to random number between 20-100
      nextConfettiAtRef.current = Math.floor(Math.random() * 81) + 20; // 20-100
      return true;
    }
    
    // Check if we've reached the random trigger point
    if (copyCountRef.current >= nextConfettiAtRef.current) {
      // Reset for next random occurrence
      nextConfettiAtRef.current = copyCountRef.current + Math.floor(Math.random() * 81) + 20;
      return true;
    }
    
    return false;
  };

  const triggerConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleCopyFull = async () => {
    try {
      // Build the full text to copy including time and client/matter if present
      let textToCopy = output;
      
      if (time) {
        textToCopy += `\n\nTime: ${time} hours (${Math.round(time * 60)} minutes)`;
      }
      
      if (clientMatter) {
        textToCopy += `\nClient/Matter: ${clientMatter}`;
      }
      
      const formattedText = formatOutput(textToCopy, currentFormat);
      await navigator.clipboard.writeText(formattedText);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
      
      // Trigger confetti only on first copy or random occurrence
      if (shouldTriggerConfetti()) {
        triggerConfetti();
      }
      
      toast.success('Copied to clipboard!', {
        description: 'Narrative with time and client/matter details',
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy', {
        description: 'Please try again',
      });
    }
  };

  const handleCopyNarrative = async () => {
    try {
      // Copy only the narrative text, no metadata
      await navigator.clipboard.writeText(formattedOutput);
      setCopiedNarrative(true);
      setTimeout(() => setCopiedNarrative(false), 2000);
      
      // Trigger confetti only on first copy or random occurrence
      if (shouldTriggerConfetti()) {
        triggerConfetti();
      }
      
      toast.success('Copied to clipboard!', {
        description: 'Narrative text only',
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy', {
        description: 'Please try again',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="border-2 shadow-xl">
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

        {/* Format Toggle Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pb-2 border-b">
          <span className="text-sm font-medium text-muted-foreground shrink-0">Format:</span>
          <div className="flex flex-wrap gap-1">
            {FORMAT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = currentFormat === option.value;
              return (
                <Button
                  key={option.value}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentFormat(option.value)}
                  className={cn(
                    'h-8 px-2 sm:px-3 transition-all',
                    isActive && 'shadow-md'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 mr-1 sm:mr-1.5" />
                  <span className="text-xs">{option.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {formattedOutput}
        </div>

        {(time || clientMatter) && (
          <div className="space-y-1">
            {time && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Time:</span>
                <span className="font-semibold">{time} hours</span>
                <span className="text-muted-foreground">
                  ({Math.round(time * 60)} minutes)
                </span>
              </div>
            )}
            {clientMatter && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Client/Matter:</span>
                <span className="font-semibold">{clientMatter}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleCopyFull}
              variant="default"
              className="flex-1"
              disabled={copiedFull}
              aria-label="Copy narrative with time and client/matter"
            >
              {copiedFull ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Copied All!</span>
                  <span className="sm:hidden">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Copy All (with details)</span>
                  <span className="sm:hidden">Copy All</span>
                </>
              )}
            </Button>
            <Button
              onClick={handleCopyNarrative}
              variant="secondary"
              className="flex-1"
              disabled={copiedNarrative}
              aria-label="Copy narrative only"
            >
              {copiedNarrative ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Copy Narrative Only</span>
                  <span className="sm:hidden">Copy Narrative</span>
                </>
              )}
            </Button>
          </div>
          <Button 
            onClick={onClear} 
            variant="outline"
            className="w-full"
            aria-label="Clear output and generate new entry"
          >
            Generate New Entry
          </Button>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
