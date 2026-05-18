// Cloudflare Workers: crypto.randomUUID() 사용 가능
export function newId(): string {
  return crypto.randomUUID();
}

export function newHandle(seed?: string | null): string {
  const base = (seed ?? '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  const suffix = Math.random().toString(36).slice(2, 8);
  const prefix = base || 'chohee';
  return `${prefix.slice(0, 16)}_${suffix}`;
}
