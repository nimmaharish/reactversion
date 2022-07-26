export function useIsWebView() {
  return !!(window && window.flutter_inappwebview);
}
