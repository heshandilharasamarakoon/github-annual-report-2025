export async function captureElement(element: HTMLElement): Promise<Blob> {
  const html2canvas = (await import('html2canvas')).default;
  
  const canvas = await html2canvas(element, {
    backgroundColor: '#000000',
    scale: 2,
    logging: false,
    useCORS: true,
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob: Blob | null) => {
      resolve(blob!);
    }, 'image/png');
  });
}

export async function captureCurrentSlide(): Promise<Blob | null> {
  const slideElement = document.querySelector('[data-slide]') as HTMLElement;
  if (!slideElement) {
    console.error('No slide element found');
    return null;
  }

  try {
    return await captureElement(slideElement);
  } catch (error) {
    console.error('Failed to capture slide:', error);
    return null;
  }
}

