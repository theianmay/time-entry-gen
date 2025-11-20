import { Activity } from '@/types';

// Activity type definitions with colors for visual distinction
export const ACTIVITIES: Activity[] = [
  {
    id: 'call',
    label: 'Call',
    icon: 'Phone',
    description: 'Telephone conference or video call',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'document-review',
    label: 'Document Review',
    icon: 'FileText',
    description: 'Review and analyze documents',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    id: 'drafting',
    label: 'Drafting',
    icon: 'FileEdit',
    description: 'Draft documents or correspondence',
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'research',
    label: 'Research',
    icon: 'Search',
    description: 'Legal research and analysis',
    color: 'amber',
    gradient: 'from-amber-500 to-amber-600',
  },
  {
    id: 'email',
    label: 'Correspondence',
    icon: 'Mail',
    description: 'Email or written correspondence',
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'meeting',
    label: 'Meeting',
    icon: 'Users',
    description: 'In-person or virtual meeting',
    color: 'violet',
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: 'BarChart',
    description: 'Strategic analysis or planning',
    color: 'rose',
    gradient: 'from-rose-500 to-rose-600',
  },
];

// Vocabulary mapping for Rule D
export const VOCABULARY_MAP: Record<string, string[]> = {
  review: ['Analyze', 'Audit', 'Validate', 'Examine'],
  draft: ['Structure', 'Configure', 'Prepare', 'Compose'],
  talk: ['Confer', 'Strategize', 'Advise', 'Discuss'],
  email: ['Correspond', 'Communicate'],
  fix: ['Reconcile', 'Redline', 'Refine', 'Revise'],
  research: ['Research', 'Investigate', 'Examine'],
  meet: ['Conference', 'Convene', 'Consult'],
};

// Activity to verb mapping
export const ACTIVITY_VERB_MAP: Record<string, string> = {
  call: 'Telephone conference',
  'document-review': 'Analyzed',
  drafting: 'Drafted',
  research: 'Researched',
  email: 'Correspondence',
  meeting: 'Strategy conference',
  analysis: 'Analyzed',
};
