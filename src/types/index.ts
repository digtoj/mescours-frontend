export interface Course {
  id: string;
  title: string;
  category: string;
  content: string;
  pageCount: number;
  createdAt: Date;
  summary?: string;
  keyPoints?: string[];
  audioScript?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UploadResponse {
  text: string;
  page_count: number;
  success: boolean;
  error?: string;
}

export interface SummaryResponse {
  summary: string;
  key_points: string[];
  audio_script: string;
}

export interface AskResponse {
  answer: string;
  referenced_content?: string;
}
