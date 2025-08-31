export enum AppMode {
  JSON_PROMPTING = 'JSON_PROMPTING',
  VEO_HACK = 'VEO_HACK',
}

export interface JsonHistoryItem {
  id: string;
  prompt: string;
  schema: string;
}

export type Theme = 'light' | 'dark' | 'system';