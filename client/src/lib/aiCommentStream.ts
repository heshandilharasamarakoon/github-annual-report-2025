import type { AICommentStyle } from './aiComment';
import type { SlidesData } from '../store/useAppStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function generateAICommentStream(
  persona: string,
  style: AICommentStyle,
  stats: SlidesData,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE}/ai-comment/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ persona, style, stats }),
      }
    );

    if (!response.ok) {
      throw new Error('Stream request failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No readable stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            if (data.content) {
              onChunk(data.content);
            }
            if (data.done) {
              onComplete();
              return;
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    console.error('Stream error:', error);
    if (onError) {
      onError(error as Error);
    }
  }
}

