import { Activity } from '@/types';

// Activity type definitions
export const ACTIVITIES: Activity[] = [
  {
    id: 'call',
    label: 'Call',
    icon: 'Phone',
    description: 'Telephone conference or video call',
  },
  {
    id: 'document-review',
    label: 'Document Review',
    icon: 'FileText',
    description: 'Review and analyze documents',
  },
  {
    id: 'drafting',
    label: 'Drafting',
    icon: 'FileEdit',
    description: 'Draft documents or correspondence',
  },
  {
    id: 'research',
    label: 'Research',
    icon: 'Search',
    description: 'Legal research and analysis',
  },
  {
    id: 'email',
    label: 'Email/Correspondence',
    icon: 'Mail',
    description: 'Email or written correspondence',
  },
  {
    id: 'meeting',
    label: 'Meeting',
    icon: 'Users',
    description: 'In-person or virtual meeting',
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: 'BarChart',
    description: 'Strategic analysis or planning',
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
