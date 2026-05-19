import Link from 'next/link';

type BrandVariant = 1 | 2 | 3;

export function Brand({ href = '/', variant = 3 }: { href?: string; variant?: BrandVariant }) {
  return (
    <Link href={href} className="group flex items-center gap-2">
      <BrandMark variant={variant} className="h-7 w-7 text-fg-1" />
      <span className="font-serif text-[18px] text-fg-1 group-hover:text-accent transition duration-fast">
        초희
      </span>
    </Link>
  );
}

function BrandMark({ variant, className }: { variant: BrandVariant; className?: string }) {
  if (variant === 1) {
    // 1안: 원 테두리 + 가운데 정렬된 가사선 + 아래 곡선
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="초희"
        className={className}
      >
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
        <path d="M8 9 H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 14 L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M9 23 Q16 17 23 23"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  if (variant === 2) {
    // 2안: 테두리 제거, 짧은 가사선을 위로·왼쪽 정렬, 아래에 음악 곡선
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="초희"
        className={className}
      >
        <path d="M3 8 H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 13 H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M3 23 Q12 17 22 23"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  // 3안: 짧은 선이 위, 긴 선이 아래, 긴 선의 오른쪽 끝이 곡선의 오른쪽 끝(x=22)과 일치
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="초희"
      className={className}
    >
      <path d="M3 8 H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 13 H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 13 H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M3 23 Q12.5 12 22 23"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
