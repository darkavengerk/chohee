import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  errorMessage?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, errorMessage, leftSlot, rightSlot, id, ...rest },
  ref,
) {
  const inputId = id ?? (label ? `field-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[12px] text-fg-2">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2 rounded-md border border-bd-1 bg-bg-3 px-3 transition duration-fast',
          'focus-within:border-accent focus-within:shadow-glow/0',
          errorMessage && 'border-danger/60',
        )}
      >
        {leftSlot}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-9 flex-1 bg-transparent text-[13px] text-fg-1 outline-none',
            'placeholder:text-fg-3',
            className,
          )}
          {...rest}
        />
        {rightSlot}
      </div>
      {(hint || errorMessage) && (
        <p
          className={cn(
            'text-[11px]',
            errorMessage ? 'text-danger' : 'text-fg-3',
          )}
        >
          {errorMessage ?? hint}
        </p>
      )}
    </div>
  );
});
