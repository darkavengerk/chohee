<script lang="ts" module>
  export interface SidebarItem {
    key: string;
    label: string;
    href: string;
    icon?: string;
  }
  export interface SidebarGroup {
    label?: string;
    items: SidebarItem[];
  }
</script>

<script lang="ts">
  import { cn } from '../utils';
  import Brand from './Brand.svelte';

  interface Props {
    groups: SidebarGroup[];
    activeKey?: string;
    class?: string;
  }

  let { groups, activeKey, class: klass = '' }: Props = $props();
</script>

<aside
  class={cn(
    'bg-bg-1 border-bd-1 flex h-screen w-60 flex-col gap-6 overflow-y-auto border-r px-4 py-5',
    klass,
  )}
>
  <div class="px-2">
    <Brand />
  </div>

  <nav class="flex flex-col gap-5">
    {#each groups as group (group.label ?? '_')}
      <div>
        {#if group.label}
          <p class="text-fg-4 mb-2 px-2 text-[10px] font-medium uppercase tracking-wider">
            {group.label}
          </p>
        {/if}
        <ul class="flex flex-col gap-0.5">
          {#each group.items as item (item.key)}
            <li>
              <a
                href={item.href}
                class={cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition',
                  activeKey === item.key
                    ? 'bg-bg-3 text-fg-1'
                    : 'text-fg-2 hover:bg-bg-2 hover:text-fg-1',
                )}
              >
                {#if item.icon}
                  <span class="text-fg-3 text-base" aria-hidden="true">{item.icon}</span>
                {/if}
                <span>{item.label}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>
</aside>
