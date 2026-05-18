import Link from 'next/link';

export function Brand({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-fg font-serif text-[16px] font-semibold">
        초
      </span>
      <span className="font-serif text-[18px] text-fg-1 group-hover:text-accent transition duration-fast">
        초희
      </span>
    </Link>
  );
}
