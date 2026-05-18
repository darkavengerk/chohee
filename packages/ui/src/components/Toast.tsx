'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../utils';

export type ToastTone = 'info' | 'success' | 'warn' | 'danger';

interface ToastItem {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  show: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const toneClasses: Record<ToastTone, string> = {
  info: 'border-info/30 bg-info/10 text-info',
  success: 'border-success/30 bg-success/10 text-success',
  warn: 'border-warn/30 bg-warn/10 text-warn',
  danger: 'border-danger/30 bg-danger/10 text-danger',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastContextValue['show']>(
    (toast) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setItems((prev) => [...prev, { ...toast, id }]);
      const duration = toast.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => remove(id), duration);
      }
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-[320px] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto animate-fade-in rounded-lg border bg-bg-1 px-4 py-3 shadow-2',
              'flex items-start gap-3',
            )}
          >
            <span
              className={cn('mt-1 inline-block h-2 w-2 rounded-pill', toneClasses[t.tone])}
              aria-hidden
            />
            <div className="flex-1">
              <p className="text-[13px] font-medium text-fg-1">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[12px] text-fg-3">{t.description}</p>}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-fg-3 hover:text-fg-1"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useEphemeralToast(): void {
  useEffect(() => {
    // no-op, exists so that consumers can declare side-effects elsewhere
  }, []);
}
