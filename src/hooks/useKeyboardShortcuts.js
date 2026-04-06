import { useEffect } from 'react';

/**
 * Registers global keyboard shortcuts.
 * n → open add modal, / → focus search, Escape → close modal
 */
export function useKeyboardShortcuts({ onNew, onSearch, onEscape }) {
  useEffect(() => {
    const handler = (e) => {
      // Ignore when typing in inputs
      const tag = e.target.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable;

      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      if (isInput) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onNew?.();
      } else if (e.key === '/') {
        e.preventDefault();
        onSearch?.();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNew, onSearch, onEscape]);
}
