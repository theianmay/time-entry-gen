'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HistoryEntry } from '@/types';
import { Clock, Copy, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export function SessionHistory({ history, onClear }: SessionHistoryProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedFullId, setCopiedFullId] = useState<string | null>(null);
  const [copiedNarrativeId, setCopiedNarrativeId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleCopyFull = async (entry: HistoryEntry) => {
    try {
      let textToCopy = entry.output;
      
      if (entry.input.time) {
        textToCopy += `\n\nTime: ${entry.input.time} hours (${Math.round(entry.input.time * 60)} minutes)`;
      }
      
      if (entry.input.clientMatter) {
        textToCopy += `\nClient/Matter: ${entry.input.clientMatter}`;
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopiedFullId(entry.id);
      setTimeout(() => setCopiedFullId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyNarrative = async (entry: HistoryEntry) => {
    try {
      await navigator.clipboard.writeText(entry.output);
      setCopiedNarrativeId(entry.id);
      setTimeout(() => setCopiedNarrativeId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Session History</CardTitle>
            <CardDescription>
              {history.length} {history.length === 1 ? 'entry' : 'entries'} generated this session
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((entry) => {
            const isExpanded = expandedIds.has(entry.id);
            const isCopiedFull = copiedFullId === entry.id;
            const isCopiedNarrative = copiedNarrativeId === entry.id;

            return (
              <div
                key={entry.id}
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {formatTime(entry.timestamp)}
                      </span>
                      {entry.usedFallback && (
                        <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                          Fallback
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium mt-1 truncate">
                      {entry.input.activity.replace('-', ' ')} • {entry.input.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyFull(entry)}
                      className="h-8 px-2"
                      aria-label={isCopiedFull ? "Copied all" : "Copy all"}
                      title="Copy with details"
                    >
                      <Copy className={cn(
                        "h-3.5 w-3.5",
                        isCopiedFull && "text-green-600"
                      )} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyNarrative(entry)}
                      className="h-8 px-2"
                      aria-label={isCopiedNarrative ? "Copied narrative" : "Copy narrative only"}
                      title="Copy narrative only"
                    >
                      <Copy className={cn(
                        "h-3.5 w-3.5 opacity-60",
                        isCopiedNarrative && "text-green-600 opacity-100"
                      )} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(entry.id)}
                      className="h-8 w-8 p-0"
                      aria-label={isExpanded ? "Collapse details" : "Expand details"}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <div className="text-xs space-y-1">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Goal:</span> {entry.input.goal}
                      </p>
                      {entry.input.time && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Time:</span> {entry.input.time} hours
                        </p>
                      )}
                      {entry.input.clientMatter && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Client/Matter:</span> {entry.input.clientMatter}
                        </p>
                      )}
                    </div>
                    <div className="bg-muted rounded p-2 text-xs font-mono">
                      {entry.output}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
