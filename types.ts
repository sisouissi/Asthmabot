
import type { Part } from '@google/genai';

export interface DisplayMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isStreaming?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Part[];
}
