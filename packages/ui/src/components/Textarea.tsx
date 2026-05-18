import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  errorMessage?: string;
  serif?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, hint, errorMessage, serif = false, id, ...rest },
  ref,
) {
  const inputId = id ?? (label ? `ta-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[12px] text-fg-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'min-h-[120px] rounded-md border border-bd-1 bg-bg-3 px-3 py-2.5 text-[13px] text-fg-1 outline-none transition duration-fast',
          'placeholder:text-fg-3 focus:border-accent',
          serif && 'font-serif text-[16px] leading-[1.9]',
          errorMessage && 'border-danger/60',
          className,
        )}
        {...rest}
      />
      {(hint || errorMessage) && (
        <p className={cn('text-[11px]', errorMessage ? 'text-danger' : 'text-fg-3')}>
          {errorMessage ?? hint}
        </p>
      )}
    </div>
  );
});
