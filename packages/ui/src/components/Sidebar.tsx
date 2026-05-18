'use client';
import type { ReactNode } from 'react';
import { cn } from '../utils';

interface SidebarItem {
  key: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

interface SidebarProps {
  activeKey?: string;
  groups: SidebarGroup[];
  brand?: ReactNode;
  footer?: ReactNode;
  linkComponent?: (props: { href: string; children: ReactNode; className?: string }) => ReactNode;
  className?: string;
}

export function Sidebar({
  activeKey,
  groups,
  brand,
  footer,
  linkComponent,
  className,
}: SidebarProps) {
  const LinkCmp = linkComponent;
  return (
    <aside
      className={cn(
        'flex h-screen w-[248px] shrink-0 flex-col border-r border-bd-1 bg-bg-0 px-4 py-6',
        className,
      )}
    >
      {brand && <div className="mb-6 px-2">{brand}</div>}
      <nav className="flex flex-1 flex-col gap-6">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="px-2 text-[10.5px] font-medium uppercase tracking-wider text-fg-4">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = item.key === activeKey;
              const className = cn(
                'flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] transition duration-fast',
                isActive
                  ? 'bg-accent-soft text-accent'
                  : 'text-fg-2 hover:bg-bg-2 hover:text-fg-1',
              );
              const inner = (
                <>
                  {item.icon}
                  <span>{item.label}</span>
                </>
              );
              if (item.href && LinkCmp) {
                return (
                  <LinkCmp key={item.key} href={item.href} className={className}>
                    {inner}
                  </LinkCmp>
                );
              }
              return (
                <button key={item.key} className={className} onClick={item.onClick}>
                  {inner}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      {footer && <div className="mt-4 border-t border-bd-1 pt-4">{footer}</div>}
    </aside>
  );
}
