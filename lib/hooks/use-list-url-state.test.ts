import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useListUrlState, useUrlSearchInput } from './use-list-url-state';

const replace = vi.fn();
let currentParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/asociados',
  useSearchParams: () => currentParams,
}));

describe('useListUrlState', () => {
  beforeEach(() => {
    replace.mockClear();
    currentParams = new URLSearchParams();
  });

  it('la página por defecto es 1 cuando la URL no la trae', () => {
    const { result } = renderHook(() => useListUrlState());
    expect(result.current.page).toBe(1);
  });

  it('lee la página de la URL e ignora valores inválidos', () => {
    currentParams = new URLSearchParams('page=3');
    expect(renderHook(() => useListUrlState()).result.current.page).toBe(3);

    currentParams = new URLSearchParams('page=abc');
    expect(renderHook(() => useListUrlState()).result.current.page).toBe(1);

    currentParams = new URLSearchParams('page=-2');
    expect(renderHook(() => useListUrlState()).result.current.page).toBe(1);
  });

  it('no escribe la página 1 en la URL (queda limpia)', () => {
    currentParams = new URLSearchParams('page=4');
    const { result } = renderHook(() => useListUrlState());

    act(() => result.current.setPage(1));

    expect(replace).toHaveBeenCalledWith('/asociados', { scroll: false });
  });

  it('conserva los demás parámetros al cambiar uno', () => {
    currentParams = new URLSearchParams('q=perez&sort=names%3Aasc');
    const { result } = renderHook(() => useListUrlState());

    act(() => result.current.setPage(2));

    expect(replace).toHaveBeenCalledWith(
      '/asociados?q=perez&sort=names%3Aasc&page=2',
      { scroll: false },
    );
  });

  it('borra el parámetro cuando el valor es vacío o indefinido', () => {
    currentParams = new URLSearchParams('deudor=123&page=2');
    const { result } = renderHook(() => useListUrlState());

    act(() => result.current.setParams({ deudor: undefined }));

    expect(replace).toHaveBeenCalledWith('/asociados?page=2', {
      scroll: false,
    });
  });
});

describe('useUrlSearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('aplica el término a la URL tras el debounce y resetea la página', () => {
    const setParams = vi.fn();
    const { result } = renderHook(() => useUrlSearchInput(setParams, ''));

    act(() => result.current.setInput('per'));
    expect(setParams).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(setParams).toHaveBeenCalledWith({ q: 'per', page: undefined });
  });

  it('manda `undefined` al limpiar la búsqueda (no un string vacío)', () => {
    const setParams = vi.fn();
    const { result } = renderHook(() => useUrlSearchInput(setParams, 'perez'));

    act(() => result.current.setInput(''));
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(setParams).toHaveBeenCalledWith({ q: undefined, page: undefined });
  });

  it('al navegar atrás, la URL manda sobre el input', () => {
    const setParams = vi.fn();
    const { result, rerender } = renderHook(
      ({ urlValue }) => useUrlSearchInput(setParams, urlValue),
      { initialProps: { urlValue: 'perez' } },
    );

    expect(result.current.input).toBe('perez');

    rerender({ urlValue: '' });
    expect(result.current.input).toBe('');
  });
});
