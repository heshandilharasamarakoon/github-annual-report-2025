import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { fetchUserData, fetchGitHubStats } from './lib/github';
import { IntroView } from './components/IntroView';
import { SlideDeck } from './components/SlideDeck';
import { LoadingScreen } from './components/LoadingScreen';
import { StyleSelectionSlide } from './components/slides/StyleSelectionSlide';
import { Button } from './components/ui/button';
import { Github } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export function App() {
  const { token, userData, slidesData, setToken, setUserData, setSlidesData, setLoading, isLoading, aiStyle } = useAppStore();
  const [showIntro, setShowIntro] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('正在连接 GitHub...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      window.history.replaceState({}, '', '/');
    }
  }, [setToken]);

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      
      setLoading(true);

      try {
        setLoadingMessage('正在获取用户信息');
        const user = await fetchUserData(token);
        setUserData(user);

        setLoadingMessage('正在分析 2025 年数据');
        await new Promise(resolve => setTimeout(resolve, 500));

        setLoadingMessage('正在计算统计数据');
        const stats = await fetchGitHubStats(token, user.login);
        setSlidesData(stats);

        setLoadingMessage('正在生成报告');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setLoading(false);
        setShowIntro(true);
      } catch (error) {
        console.error('Failed to load data:', error);
        alert('加载数据失败，请重试');
        setToken('');
        setLoading(false);
      }
    };

    if (token && !userData) {
      loadData();
    }
  }, [token, userData, setToken, setUserData, setSlidesData, setLoading]);

  const handleLogin = () => {
    const authUrl = import.meta.env.VITE_GITHUB_OAUTH_AUTHORIZE_URL || 'http://localhost:3000/auth/github';
    window.location.href = authUrl;
  };

  if (isLoading) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50 cursor-pointer hover:opacity-80" onClick={() => window.location.href = 'https://github.com/BingyanStudio/github-annual-report-2025'}>
          <Github className="w-6 h-6 text-white" />
        </div>
        <LoadingScreen message={loadingMessage} />
      </>
    );
  }

  if (showIntro && slidesData) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50 cursor-pointer hover:opacity-80" onClick={() => window.location.href = 'https://github.com/BingyanStudio/github-annual-report-2025'}>
          <Github className="w-6 h-6 text-white" />
        </div>
        <AnimatePresence mode="wait">
          <IntroView onComplete={() => setShowIntro(false)} />
        </AnimatePresence>
      </>
    );
  }

  if (!token || !userData || !slidesData) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50 cursor-pointer hover:opacity-80" onClick={() => window.location.href = 'https://github.com/BingyanStudio/github-annual-report-2025'}>
          <Github className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="text-center max-w-md px-4">
            <div className="text-6xl mb-8">📊</div>
            <h1 className="text-5xl font-bold mb-4">
              GitHub <span className="neon-green neon-glow">2025</span>
            </h1>
            <h2 className="text-3xl font-bold mb-6">年度总结</h2>
            <p className="text-gray-400 mb-8">
              回顾你在 2025 年的代码旅程，看看你的成长和贡献
            </p>
            <Button
              onClick={handleLogin}
              size="lg"
              className="bg-[#10b981] hover:bg-[#059669] text-black font-bold text-lg"
            >
              <Github className="w-5 h-5 mr-2" />
              使用 GitHub 登录
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (!aiStyle) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50 cursor-pointer hover:opacity-80" onClick={() => window.location.href = 'https://github.com/BingyanStudio/github-annual-report-2025'}>
          <Github className="w-6 h-6 text-white" />
        </div>
        <StyleSelectionSlide />
      </>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 cursor-pointer hover:opacity-80" onClick={() => window.location.href = 'https://github.com/BingyanStudio/github-annual-report-2025'}>
        <Github className="w-6 h-6 text-white" />
      </div>
      <SlideDeck />
    </>
  );
}

export default App;
