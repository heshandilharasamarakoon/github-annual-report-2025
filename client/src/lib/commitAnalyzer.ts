export interface CommitAnalysis {
  style: string;
  description: string;
  avgLength: number;
  hasEmoji: boolean;
  totalCount: number;
}

export function analyzeCommitMessages(commits: Array<{ message: string }>): CommitAnalysis {
  if (!commits || commits.length === 0) {
    return {
      style: '未知',
      description: '暂无足够数据',
      avgLength: 0,
      hasEmoji: false,
      totalCount: 0,
    };
  }

  const validCommits = commits.filter(c => c.message && c.message.trim());
  const totalCount = validCommits.length;

  if (totalCount === 0) {
    return {
      style: '未知',
      description: '暂无足够数据',
      avgLength: 0,
      hasEmoji: false,
      totalCount: 0,
    };
  }

  const avgLength = Math.round(
    validCommits.reduce((sum, c) => sum + c.message.length, 0) / totalCount
  );

  const hasEmoji = validCommits.some(c => 
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(c.message)
  );

  let style = '简洁型';
  let description = '提交信息简洁明了';

  if (avgLength > 50) {
    style = '详细型';
    description = '提交信息详细完整，注重描述';
  } else if (avgLength < 20) {
    style = '极简型';
    description = '提交信息非常简洁，点到为止';
  }

  if (hasEmoji) {
    description += '，喜欢使用表情符号';
  }

  return {
    style,
    description,
    avgLength,
    hasEmoji,
    totalCount,
  };
}

