import { createContext, useContext } from 'react';

export const WebContext = createContext({
  data: {}
});

export function useWebData() {
  return useContext(WebContext).data;
}
