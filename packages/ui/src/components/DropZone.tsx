'use client';
import { useCallback, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { cn } from '../utils';

interface DropZoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title?: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

export function DropZone({
  accept,
  multiple = false,
  onFiles,
  title = '파일을 끌어다 놓거나 선택하세요',
  hint,
  icon,
  className,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(multiple ? files : [files[0]!]);
    },
    [onFiles, multiple],
  );

  return (
    <div
      className={cn(
        'flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg border-[1.5px] border-dashed px-6 py-10 text-center transition duration-base',
        dragging
          ? 'border-accent bg-accent-soft'
          : 'border-bd-2 bg-bg-1 hover:border-bd-2 hover:bg-bg-2',
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {icon}
      <div className="flex flex-col gap-1">
        <p className="text-[14px] font-medium text-fg-1">{title}</p>
        {hint && <p className="text-[12px] text-fg-3">{hint}</p>}
      </div>
      <button
        type="button"
        className="rounded-md border border-bd-2 bg-bg-2 px-4 py-2 text-[12px] font-medium text-fg-1 transition duration-fast hover:bg-bg-3"
        onClick={() => inputRef.current?.click()}
      >
        파일 선택
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
