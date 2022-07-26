import {
  createContext, useContext, useEffect, useState
} from 'react';

export const AppContext = createContext({
  isDesktop: false,
  language: 'en',
  setLanguage: () => {},
});

export function useDesktop() {
  return useContext(AppContext).isDesktop;
}

export function useLanguage() {
  return useContext(AppContext).language;
}

export function useSetLanguage() {
  return useContext(AppContext).setLanguage;
}

export function useIsKeyboardOpen() {
  const isDesktop = useDesktop();
  const [isOpen, setIsOpen] = useState(false);
  const [height] = useState(window.innerHeight);

  useEffect(() => {
    if (isDesktop) {
      return;
    }
    const onResize = () => {
      setTimeout(() => {
        const isOpened = window.innerHeight < height * 0.8;
        setIsOpen(isOpened);
      }, 25);
    };
    if (!window?.visualViewport?.addEventListener) {
      return;
    }
    window.visualViewport.addEventListener('resize', onResize);

    return () => {
      window.visualViewport.removeEventListener('resize', onResize);
    };
  }, [isDesktop]);

  return isOpen;
}
