export function injectJS(id, src) {
  return new Promise((resolve, reject) => {
    if (!document) {
      resolve();
      return;
    }

    if (document.getElementById(id)) {
      resolve('JS already loaded.');
      return;
    }

    const script = document.createElement('script');

    script.id = id;
    script.async = true;
    script.defer = true;
    script.src = src;

    script.addEventListener('load', () => resolve('JS loaded.'));

    script.addEventListener('error', () => reject(new Error('unable to load script')));
    script.addEventListener('abort', () => reject(new Error('unable to load script')));

    document.head.appendChild(script);
  });
}
