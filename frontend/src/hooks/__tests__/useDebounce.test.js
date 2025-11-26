import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devrait retourner la valeur initiale immédiatement', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('devrait mettre à jour la valeur après le délai', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 500 } }
    );

    expect(result.current).toBe('test');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('test'); // Pas encore mis à jour

    vi.advanceTimersByTime(500);
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('devrait annuler le timer précédent si la valeur change avant la fin du délai', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test1', delay: 500 } }
    );

    rerender({ value: 'test2', delay: 500 });
    vi.advanceTimersByTime(300);
    
    rerender({ value: 'test3', delay: 500 });
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current).toBe('test3');
    });
  });
});

