'use client';

import { ACTIVITIES } from '@/lib/constants';
import { ActivityType } from '@/types';
import { Card } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

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
        {ACTIVITIES.map((activity) => {
          const Icon = Icons[activity.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
          const isSelected = value === activity.id;

          return (
            <Card
              key={activity.id}
              className={cn(
                'relative cursor-pointer transition-all hover:border-primary hover:shadow-md',
                'p-4 flex flex-col items-center text-center gap-2',
                isSelected && 'border-primary bg-primary/5 shadow-md'
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
              <div
                className={cn(
                  'rounded-full p-3 transition-colors',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className={cn('font-medium text-sm', isSelected && 'text-primary')}>
                  {activity.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
