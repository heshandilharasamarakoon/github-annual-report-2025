const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface CommitData {
  message: string;
  date: string;
}

export interface RepositoryData {
  name: string;
  description: string;
  language: string;
  commits2025: number;
  stargazerCount: number;
  recentCommits: Array<{ message: string }>;
}

export async function generateAIAnalysisStream(
  commits: CommitData[],
  repositories: RepositoryData[],
  style: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE}/ai-analysis/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ commits, repositories, style }),
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
            // Ignore parse errors
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    if (onError) {
      onError(error as Error);
    }
  }
}

