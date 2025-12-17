import OpenAI from 'openai';
import { env } from '../utils/env';
import { logger } from '../utils/logger';
import { presets } from '../utils/presets';
import type { AICommentRequest } from '../types';

export class AIService {
  private static openai: OpenAI | null = null;

  private static getClient(): OpenAI | null {
    if (!env.AI_API_KEY) {
      return null;
    }

    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: env.AI_API_KEY,
        baseURL: env.AI_API_URL,
      });
    }

    return this.openai;
  }

  static async generateComment(request: AICommentRequest): Promise<string> {
    const client = this.getClient();

    if (!client) {
      logger.warn('AI_API_KEY not configured, using fallback comments');
      return this.getFallbackComment(request.persona, request.style);
    }

    const personaDescriptions: Record<string, string> = {
      'high-achiever': '高产开发者，你的代码贡献量令人惊叹',
      'burst-coder': '爆发型开发者，单日贡献能力超强',
      'streak-master': '连续贡献者，你的坚持令人敬佩',
      'language-explorer': '语言探索者，你精通多种编程语言',
      'collaborator': '协作达人，你擅长团队协作和代码审查',
      'maintainer': '维护者，你专注于项目的持续改进',
      'weekend-warrior': '周末战士，休息日依然在代码世界征战',
      'consistent-contributor': '稳定贡献者，每天都有你的足迹',
      'focused-coder': '专注型开发者，你在特定时期集中发力',
      'night-owl': '夜猫子程序员，深夜才是你的黄金时段',
      'steady-builder': '稳步建设者，你以稳定的节奏持续贡献',
      'early-bird': '早起鸟工程师，清晨的阳光见证你的勤奋',
      'default': '代码创造者'
    };

    const styleMapping: Record<string, string> = {
      zako: 'zako',
      tsundere: 'tsundere',
      wholesome: 'wholesome',
      praise: 'praise',
    };

    const personaDesc = personaDescriptions[request.persona] || personaDescriptions['default'];
    const style = request.style || 'praise';
    const presetKey = styleMapping[style] || 'praise';
    const preset = presets[presetKey];
    const stats = request.stats;

    const languagesText = stats?.topLanguages
      ?.map(l => `${l.name}(${l.percentage.toFixed(1)}%)`)
      .join('、') || '未知';

    const commitActivityText = stats?.commitActivity
      ?.map(m => `${m.month}: ${m.count}次`)
      .slice(-6)
      .join('、') || '';

    const currentDayOfYear = Math.floor((Date.now() - new Date('2025-01-01T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const activityRate = stats?.activeDays && stats.activeDays > 0
      ? ((stats.activeDays / currentDayOfYear) * 100).toFixed(1)
      : '0';

    const dataContext = `
开发者画像：${personaDesc}

核心数据：
- 提交：${stats?.totalCommits || 0}次 | PR：${stats?.totalPRs || 0}个 | Review：${stats?.totalReviews || 0}次 | Issue：${stats?.totalIssues || 0}个
- 星标：${stats?.totalStars || 0}个 | Fork：${stats?.totalForks || 0}次 | 仓库：${stats?.totalRepos || 0}个
- 活跃：${stats?.activeDays || 0}天(${activityRate}%) | 连续：${stats?.longestStreak || 0}天 | 日均：${(stats?.averageCommitsPerDay || 0).toFixed(1)}次
- 最忙：${stats?.busiestDay?.date || ''}(${stats?.busiestDay?.count || 0}次)
- 语言：${languagesText}
- 趋势：${commitActivityText}
`;

    const prompt = `${preset?.styleGuide || '生成一段年度总结'}GitHub 2025年数据：${dataContext}`;

    logger.info('AI prompt:', prompt);
  try {
      const completion = await client.chat.completions.create({
        model: env.AI_MODEL,
        messages: [
          {
            role: 'system',
            content: preset?.systemPrompt || '你是一个GitHub年度总结撰写者。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.85,
        max_tokens: 400,
      });

      const comment = completion.choices[0]?.message?.content?.trim();
      
      if (!comment) {
        logger.warn('AI returned empty comment, using fallback');
        return this.getFallbackComment(request.persona, style);
      }

      logger.info('AI comment generated successfully');
      return comment;

    } catch (error: any) {
      logger.error('AI generation failed:', error.message);
      return this.getFallbackComment(request.persona, style);
    }
  }

  static async *generateCommentStream(persona: string, style?: string, stats?: any): AsyncGenerator<string> {
    const client = this.getClient();

    if (!client) {
      const fallback = this.getFallbackComment(persona, style);
      for (const char of fallback) {
        yield `data: ${JSON.stringify({ content: char })}\n\n`;
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      yield `data: ${JSON.stringify({ done: true })}\n\n`;
      return;
    }

    try {
      const styleMapping: Record<string, string> = {
        zako: 'zako',
        tsundere: 'tsundere',
        wholesome: 'wholesome',
        praise: 'praise',
      };

      const presetKey = styleMapping[style as string] || 'praise';
      const preset = presets[presetKey];

      let streamPrompt: string = `${preset?.styleGuide || '生成一段年度总结'}\n\n请生成一段GitHub 2025年度评论（100-150字）。`;

      if (stats) {
        const personaDescriptions: Record<string, string> = {
          'high-achiever': '高产开发者，你的代码贡献量令人惊叹',
          'burst-coder': '爆发型开发者，单日贡献能力超强',
          'streak-master': '连续贡献者，你的坚持令人敬佩',
          'language-explorer': '语言探索者，你精通多种编程语言',
          'collaborator': '协作达人，你擅长团队协作和代码审查',
          'maintainer': '维护者，你专注于项目的持续改进',
          'weekend-warrior': '周末战士，休息日依然在代码世界征战',
          'consistent-contributor': '稳定贡献者，每天都有你的足迹',
          'focused-coder': '专注型开发者，你在特定时期集中发力',
          'night-owl': '夜猫子程序员，深夜才是你的黄金时段',
          'steady-builder': '稳步建设者，你以稳定的节奏持续贡献',
          'early-bird': '早起鸟工程师，清晨的阳光见证你的勤奋',
          'default': '代码创造者'
        };

        const personaDesc = personaDescriptions[persona] || personaDescriptions['default'];

        const languagesText = stats?.topLanguages
          ?.map((l: any) => `${l.name}(${l.percentage.toFixed(1)}%)`)
          .join('、') || '未知';

        const commitActivityText = stats?.commitActivity
          ?.map((m: any) => `${m.month}: ${m.count}次`)
          .slice(-6)
          .join('、') || '';

        const currentDayOfYear = Math.floor((Date.now() - new Date('2025-01-01T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const activityRate = stats?.activeDays && stats.activeDays > 0
          ? ((stats.activeDays / currentDayOfYear) * 100).toFixed(1)
          : '0';

        const dataContext = `
开发者画像：${personaDesc}

核心数据：
- 提交：${stats?.totalCommits || 0}次 | PR：${stats?.totalPRs || 0}个 | Review：${stats?.totalReviews || 0}次 | Issue：${stats?.totalIssues || 0}个
- 星标：${stats?.totalStars || 0}个 | Fork：${stats?.totalForks || 0}次 | 仓库：${stats?.totalRepos || 0}个
- 活跃：${stats?.activeDays || 0}天(${activityRate}%) | 连续：${stats?.longestStreak || 0}天 | 日均：${(stats?.averageCommitsPerDay || 0).toFixed(1)}次
- 最忙：${stats?.busiestDay?.date || ''}(${stats?.busiestDay?.count || 0}次)
- 语言：${languagesText}
- 趋势：${commitActivityText}
`;

        streamPrompt = `${preset?.styleGuide || '生成一段年度总结'}

GitHub 2025年数据：
${dataContext}`;
      }

      logger.info('AI stream prompt:', streamPrompt);

      const stream = await client.chat.completions.create({
        model: env.AI_MODEL,
        messages: [
          {
            role: 'system',
            content: preset?.systemPrompt || '你是一个GitHub年度总结撰写者。'
          },
          {
            role: 'user',
            content: streamPrompt
          }
        ],
        temperature: 0.85,
        max_tokens: 400,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield `data: ${JSON.stringify({ content })}\n\n`;
        }
      }

      yield `data: ${JSON.stringify({ done: true })}\n\n`;
    } catch (error: any) {
      logger.error('Stream generation failed:', error);
      const fallback = this.getFallbackComment(persona, style);
      yield `data: ${JSON.stringify({ content: fallback, done: true })}\n\n`;
    }
  }

  static async *generateAnalysisStream(
    commits: Array<{ message: string; date: string }>,
    repositories: Array<{ name: string; description: string; language: string; commits2025: number; stargazerCount: number; recentCommits: Array<{ message: string }> }>,
    style?: string
  ): AsyncGenerator<string> {
    const client = this.getClient();

    if (!client) {
      const fallback = '你的代码风格简洁明了，项目维护良好。';
      for (const char of fallback) {
        yield `data: ${JSON.stringify({ content: char })}\n\n`;
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      yield `data: ${JSON.stringify({ done: true })}\n\n`;
      return;
    }

    try {
      const commitMessages = commits.map(c => c.message).filter(m => m && m.trim()).slice(0, 20);
      const topRepos = repositories.slice(0, 5);

      const commitStyle = commitMessages.length > 0
        ? commitMessages.reduce((sum, m) => sum + m.length, 0) / commitMessages.length
        : 0;

      const hasEmoji = commitMessages.some(m => 
        /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(m)
      );

      const repoDetails = topRepos.map(r => ({
        name: r.name,
        description: r.description || '无描述',
        language: r.language,
        commits: r.commits2025,
        stars: r.stargazerCount,
        sampleCommits: r.recentCommits.slice(0, 3).map(c => c.message),
      }));

      const analysisPrompt = `分析以下 GitHub 2025 年的 Commit 和仓库数据，生成一段有趣的分析（150-200字）：

Commit 风格：
- 平均长度：${Math.round(commitStyle)}字符
- 使用Emoji：${hasEmoji ? '是' : '否'}
- 样本数量：${commitMessages.length}条

热门项目（Top 5）：
${repoDetails.map((r, idx) => `
${idx + 1}. ${r.name} (${r.language})
   - 描述：${r.description}
   - 2025年提交：${r.commits}次
   - 星标：${r.stars}个
   - 示例提交：
     ${r.sampleCommits.map(c => `* "${c.substring(0, 40)}${c.length > 40 ? '...' : ''}"`).join('\n     ') || '暂无'}
`).join('')}

请基于这些数据，生成一段生动有趣的分析，重点关注代码习惯、项目特点和个人风格。`;

      const styleMapping: Record<string, string> = {
        zako: 'zako',
        tsundere: 'tsundere',
        wholesome: 'wholesome',
        praise: 'praise',
      };

      const presetKey = styleMapping[style as string] || 'praise';
      const preset = presets[presetKey];

      const stream = await client.chat.completions.create({
        model: env.AI_MODEL,
        messages: [
          {
            role: 'system',
            content: preset?.systemPrompt || '你是一个代码分析专家，擅长从 Commit 和仓库数据中发现有趣的模式和特点。'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.85,
        max_tokens: 500,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield `data: ${JSON.stringify({ content })}\n\n`;
        }
      }

      yield `data: ${JSON.stringify({ done: true })}\n\n`;
    } catch (error: any) {
      logger.error('Analysis generation failed:', error);
      const fallback = '你的代码风格简洁明了，项目维护良好。';
      for (const char of fallback) {
        yield `data: ${JSON.stringify({ content: char })}\n\n`;
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      yield `data: ${JSON.stringify({ done: true })}\n\n`;
    }
  }

  private static getFallbackComment(persona: string, style: string = 'praise'): string {
    const fallbackComments: Record<string, string> = {
      zako: '哼，哥哥今年的代码也就那样啦，杂鱼杂鱼~不过嘛，姐姐还是勉强夸你一下，继续加油哦，别被我甩太远了呢！',
      tsundere: '哼，别以为提交了这么多我就会夸你，这只是程序员的本分而已！不过……勉强承认你有点进步吧。才不是在关心你呢，笨蛋。',
      wholesome: '辛苦啦~这一年真的很棒哦，无论遇到什么困难，姐姐都觉得你超级厉害！明年也要继续加油，记得照顾好自己，你是最棒的工程师！',
      praise: '这一年你的努力和成长都很耀眼，每一次提交都是进步的见证。继续保持，未来一定会更好！',
    };
    return (fallbackComments[style] ?? fallbackComments.praise) as string;
  }
}

