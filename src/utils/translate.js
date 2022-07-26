import { injectJS } from 'utils/loadJs';

async function waitForTranslator() {
  return new Promise((resolve, reject) => {
    let counter = 0;
    const interval = setInterval(() => {
      if (window?.google?.translate?.TranslateElement) {
        clearInterval(interval);
        resolve();
      }
      if (counter > 10) {
        clearInterval(interval);
        reject();
      }
      counter++;
    }, 300);
  });
}

export async function loadTranslator() {
  await injectJS('google-translate', 'https://translate.google.com/translate_a/element.js');
  await waitForTranslator();
  return window.google.translate.TranslateElement;
}

export function resetTranslatorBody() {
  let counter = 0;
  const interval = setInterval(() => {
    if (counter > 10) {
      clearInterval(interval);
      return;
    }
    if (document.body.style.top !== '0px') {
      document.body.style.top = '0px';
      clearInterval(interval);
      return;
    }
    counter += 1;
  }, 200);
}
