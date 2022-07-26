import { useEffect, useState } from 'react';

export function useIsDesktopJs() {
  const [isDesktop, setIsDesktop] = useState(window.screen.width >= 1024);

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.screen.width > 1024);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return isDesktop;
}
