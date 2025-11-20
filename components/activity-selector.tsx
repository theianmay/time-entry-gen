'use client';

import { ACTIVITIES } from '@/lib/constants';
import { ActivityType } from '@/types';
import { Card } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ActivitySelectorProps {
  value: string;
  onChange: (value: ActivityType) => void;
}

export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Activity Type <span className="text-destructive">*</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {ACTIVITIES.map((activity, index) => {
          const Icon = Icons[activity.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
          const isSelected = value === activity.id;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={cn(
                  'relative cursor-pointer transition-all duration-300',
                  'p-4 flex flex-col items-center text-center gap-2 overflow-hidden',
                  'hover:shadow-xl',
                  isSelected && 'ring-2 ring-offset-2 shadow-xl',
                  isSelected && `ring-${activity.color}-500`
                )}
                onClick={() => onChange(activity.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(activity.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Select ${activity.label}: ${activity.description}`}
              >
                {/* Gradient overlay on hover/selected */}
                {isSelected && (
                  <motion.div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br opacity-5',
                      activity.gradient
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.08 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <div
                  className={cn(
                    'rounded-full p-3 transition-all duration-300 relative z-10',
                    isSelected
                      ? `bg-gradient-to-br ${activity.gradient} text-white shadow-lg`
                      : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="relative z-10">
                  <p
                    className={cn(
                      'font-semibold text-sm transition-colors',
                      isSelected && `text-${activity.color}-600 dark:text-${activity.color}-400`
                    )}
                  >
                    {activity.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
