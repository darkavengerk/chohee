import { cn } from '../utils';

interface LyricsProps {
  text: string;
  size?: 'base' | 'lg' | 'xl';
  className?: string;
  showLineNumbers?: boolean;
}

export function Lyrics({ text, size = 'base', className, showLineNumbers = false }: LyricsProps) {
  const stanzas = text.split(/\n\s*\n/).map((s) => s.replace(/^\n+|\n+$/g, ''));
  const sizeClass = size === 'xl' ? 'lyrics--xl' : size === 'lg' ? 'lyrics--lg' : '';
  let lineCounter = 0;
  return (
    <div className={cn('lyrics', sizeClass, className)}>
      {stanzas.map((stanza, sIdx) => {
        const verses = stanza.split('\n');
        return (
          <div key={sIdx} className="stanza">
            {verses.map((line, lIdx) => {
              lineCounter += 1;
              return (
                <span key={lIdx} className="verse flex gap-3">
                  {showLineNumbers && (
                    <span className="mono w-8 shrink-0 text-right text-[10.5px] text-fg-4">
                      {lineCounter.toString().padStart(2, '0')}
                    </span>
                  )}
                  <span>{line || ' '}</span>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
