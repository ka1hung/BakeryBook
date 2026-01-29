import { useState, useCallback, useMemo } from 'react';

export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)));
  }, [items]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isAllSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items.length, selectedIds.size]
  );

  const selectedItems = useMemo(
    () => items.filter(item => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;

  return {
    selectedIds,
    setSelectedIds,
    toggleItem,
    selectAll,
    deselectAll,
    isAllSelected,
    selectedItems,
    selectedCount,
    hasSelection,
  };
}
