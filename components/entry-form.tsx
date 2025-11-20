'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ActivitySelector } from './activity-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, User, Target, Clock, HelpCircle, NotebookPen, Scale   } from 'lucide-react';
import { FormData as FormDataType } from '@/types';

// Zod schema for form validation
const formSchema = z.object({
  activity: z.string().min(1, 'Please select an activity type'),
  subject: z.string().min(1, 'Subject/Who/What is required'),
  goal: z.string().min(1, 'Goal/Purpose is required'),
  time: z
    .number()
    .min(0.1, 'Time must be at least 0.1 hours')
    .step(0.1, 'Time must be in 0.1 hour increments')
    .optional()
    .or(z.literal(undefined)),
  clientMatter: z.string().optional(),
});

interface EntryFormProps {
  onSubmit: (data: FormDataType) => Promise<void>;
  isGenerating: boolean;
  onActivityChange?: (activity: string) => void;
}

export function EntryForm({ onSubmit, isGenerating, onActivityChange }: EntryFormProps) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity: '',
      subject: '',
      goal: '',
      time: undefined,
      clientMatter: '',
    },
  });

  // Watch activity selection for progressive disclosure
  const selectedActivity = form.watch('activity');
  
  // Notify parent component when activity changes
  React.useEffect(() => {
    if (onActivityChange) {
      onActivityChange(selectedActivity);
    }
  }, [selectedActivity, onActivityChange]);

  const handleSubmit = async (data: FormDataType) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-xl">Create Time Entry</CardTitle>
          </div>
          <CardDescription>
            Elevate your notes into structured, polished, write-off resistant narratives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Activity Selection */}
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ActivitySelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        {/* Progressive Disclosure: Subject field appears after activity selection */}
        <AnimatePresence mode="wait">
          {selectedActivity && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="space-y-6"
            >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <FormLabel className="text-base font-semibold mb-0">
                      Subject/Who/What
                    </FormLabel>
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive ring-1 ring-inset ring-destructive/20">
                      Required
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">Who or what was involved? Examples: "Founder", "Series A Term Sheet", "Co-counsel"</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Input
                      placeholder='e.g., "Founder", "Series A Term Sheet", "Co-counsel"'
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <FormLabel className="text-base font-semibold mb-0">
                      Goal/Purpose
                    </FormLabel>
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive ring-1 ring-inset ring-destructive/20">
                      Required
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">What was the objective? Examples: "discuss funding structure", "identify control provisions"</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder='e.g., "discuss funding structure", "identify control provisions"'
                      className="resize-none"
                      rows={3}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <FormLabel className="text-base font-semibold mb-0">
                      Time Duration
                    </FormLabel>
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                      Optional
                    </span>
                  </div>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="0.5"
                        className="w-32"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? undefined : parseFloat(value));
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        hours (0.1 = 6 minutes)
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientMatter"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <FormLabel className="text-base font-semibold mb-0">
                      Client/Matter
                    </FormLabel>
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                      Optional
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="e.g., Acme Corp - Series A"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Billing Narrative'
              )}
            </Button>
            </motion.div>
          )}
        </AnimatePresence>
          </form>
        </Form>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
}
