import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsyncAction } from '../useAsyncAction.js';

describe('useAsyncAction', () => {
  it('initializes with correct default state', () => {
    const mockAction = jest.fn();
    const { result } = renderHook(() => useAsyncAction(mockAction));

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(false);
  });

  it('sets isSubmitting to true while action runs', async () => {
    const mockAction = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
    const { result } = renderHook(() => useAsyncAction(mockAction));

    act(() => {
      result.current.run('arg1', 'arg2');
    });

    expect(result.current.isSubmitting).toBe(true);

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it('calls action with provided arguments', async () => {
    const mockAction = jest.fn(() => Promise.resolve('result'));
    const { result } = renderHook(() => useAsyncAction(mockAction));

    await act(async () => {
      await result.current.run('arg1', 'arg2');
    });

    expect(mockAction).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('sets success to true on successful action', async () => {
    const mockAction = jest.fn(() => Promise.resolve('result'));
    const { result } = renderHook(() => useAsyncAction(mockAction));

    await act(async () => {
      await result.current.run();
    });

    expect(result.current.success).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('returns the action result', async () => {
    const mockResult = { id: '123', name: 'Test' };
    const mockAction = jest.fn(() => Promise.resolve(mockResult));
    const { result } = renderHook(() => useAsyncAction(mockAction));

    let returnedResult;
    await act(async () => {
      returnedResult = await result.current.run();
    });

    expect(returnedResult).toEqual(mockResult);
  });

  it('sets error on action failure', async () => {
    const mockError = new Error('Action failed');
    const mockAction = jest.fn(() => Promise.reject(mockError));
    const { result } = renderHook(() => useAsyncAction(mockAction));

    await act(async () => {
      try {
        await result.current.run();
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Action failed');
    expect(result.current.success).toBe(false);
  });

  it('handles errors without message property', async () => {
    const mockAction = jest.fn(() => Promise.reject(new Error()));
    const { result } = renderHook(() => useAsyncAction(mockAction));

    await act(async () => {
      try {
        await result.current.run();
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Something went wrong. Please try again.');
  });

  it('handles non-Error rejections', async () => {
    const mockAction = jest.fn(() => Promise.reject('string error'));
    const { result } = renderHook(() => useAsyncAction(mockAction));

    await act(async () => {
      try {
        await result.current.run();
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Something went wrong. Please try again.');
  });

  it('resets error and success state', async () => {
    const mockAction = jest.fn(() => Promise.resolve('result'));
    const { result } = renderHook(() => useAsyncAction(mockAction));

    await act(async () => {
      await result.current.run();
    });

    expect(result.current.success).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('clears previous error on new action', async () => {
    const mockAction = jest.fn();
    mockAction.mockRejectedValueOnce(new Error('First error'));
    mockAction.mockResolvedValueOnce('success');

    const { result } = renderHook(() => useAsyncAction(mockAction));

    // First call fails
    await act(async () => {
      try {
        await result.current.run();
      } catch {
        // Expected
      }
    });

    expect(result.current.error).toBe('First error');

    // Second call succeeds and clears error
    await act(async () => {
      await result.current.run();
    });

    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(true);
  });

  it('updates action dependency when action changes', async () => {
    const mockAction1 = jest.fn(() => Promise.resolve('result1'));
    const mockAction2 = jest.fn(() => Promise.resolve('result2'));

    const { result, rerender } = renderHook(({ action }) => useAsyncAction(action), {
      initialProps: { action: mockAction1 },
    });

    await act(async () => {
      await result.current.run();
    });

    expect(mockAction1).toHaveBeenCalled();
    expect(mockAction2).not.toHaveBeenCalled();

    rerender({ action: mockAction2 });

    mockAction1.mockClear();
    await act(async () => {
      await result.current.run();
    });

    expect(mockAction1).not.toHaveBeenCalled();
    expect(mockAction2).toHaveBeenCalled();
  });
});
