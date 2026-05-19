<script lang="ts">
  import Sidebar, { type SidebarGroup } from './Sidebar.svelte';
  import TopBar from './TopBar.svelte';

  interface Props {
    groups: SidebarGroup[];
    activeKey?: string;
    title?: string;
    children?: import('svelte').Snippet;
    topRight?: import('svelte').Snippet;
    topLeft?: import('svelte').Snippet;
  }

  let { groups, activeKey, title, children, topRight, topLeft }: Props = $props();

  let mobileOpen = $state(false);
</script>

<div class="bg-bg-0 flex h-screen overflow-hidden">
  <!-- desktop sidebar -->
  <div class="hidden lg:block">
    <Sidebar {groups} {activeKey} />
  </div>

  <!-- mobile drawer -->
  {#if mobileOpen}
    <button
      type="button"
      aria-label="메뉴 닫기"
      onclick={() => (mobileOpen = false)}
      class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
    ></button>
    <div class="fixed inset-y-0 left-0 z-40 lg:hidden">
      <Sidebar {groups} {activeKey} class="shadow-3" />
    </div>
  {/if}

  <div class="flex flex-1 flex-col overflow-hidden">
    <TopBar {title}>
      {#snippet left()}
        <button
          type="button"
          aria-label="메뉴 열기"
          onclick={() => (mobileOpen = true)}
          class="text-fg-2 hover:bg-bg-2 hover:text-fg-1 inline-flex h-9 w-9 items-center justify-center rounded-md transition lg:hidden"
        >
          ☰
        </button>
        {@render topLeft?.()}
      {/snippet}
      {#snippet right()}
        {@render topRight?.()}
      {/snippet}
    </TopBar>

    <main class="flex-1 overflow-y-auto">
      {@render children?.()}
    </main>
  </div>
</div>
