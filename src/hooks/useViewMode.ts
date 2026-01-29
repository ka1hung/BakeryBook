import { useLocalStorage } from './useLocalStorage';

export type ViewMode = 'card' | 'table';

export function useViewMode(storageKey: string): [ViewMode, (mode: ViewMode) => void] {
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(storageKey, 'card');
  return [viewMode, setViewMode];
}
