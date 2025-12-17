import { useState } from 'react';
import { Download, FileImage } from 'lucide-react';
import { Button } from './ui/button';
import { useAppStore } from '../store/useAppStore';
import { generateReportImage, downloadBlob } from '../lib/canvas';

interface DownloadMenuProps {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function DownloadMenu({ variant = 'outline', size = 'lg' }: DownloadMenuProps) {
  const { userData, slidesData } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadSummary = async () => {
    if (!userData || !slidesData) return;

    setIsDownloading(true);
    try {
      const blob = await generateReportImage(userData, slidesData);
      const filename = `github-2025-${userData.login}-summary.png`;
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('生成图片失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadSummary}
      disabled={isDownloading}
      variant={variant}
      className="border-white/20 hover:border-[#10b981]/50"
      size={size}
    >
      {isDownloading ? (
        <>
          <FileImage className="w-5 h-5 mr-2 animate-pulse" />
          生成中...
        </>
      ) : (
        <>
          <Download className="w-5 h-5 mr-2" />
          下载报告
        </>
      )}
    </Button>
  );
}

