'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ActivitySelector } from './activity-selector';
import { Button } from '@/components/ui/button';
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
import { Loader2 } from 'lucide-react';
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
}

export function EntryForm({ onSubmit, isGenerating }: EntryFormProps) {
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

  const handleSubmit = async (data: FormDataType) => {
    await onSubmit(data);
    form.reset();
  };

  return (
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
                  <FormLabel>
                    Subject/Who/What <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., "Founder", "Series A Term Sheet", "Co-counsel"'
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Who or what was the focus of this activity?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Goal/Purpose <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g., "discuss funding structure", "identify control provisions"'
                      className="resize-none"
                      rows={3}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What was the purpose or goal of this activity?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Duration (Optional)</FormLabel>
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
                  <FormDescription>
                    Enter time in 0.1-hour increments (6-minute blocks)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientMatter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client/Matter (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Acme Corp - Series A"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Client name or matter reference for your records
                  </FormDescription>
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
  );
}
