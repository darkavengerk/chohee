<script lang="ts">
  import AppShell from '@chohee/ui/components/AppShell.svelte';
  import Avatar from '@chohee/ui/components/Avatar.svelte';
  import type { SidebarGroup } from '@chohee/ui/components/Sidebar.svelte';
  import { page } from '$app/state';

  let { children, data } = $props();

  const groups: SidebarGroup[] = [
    {
      label: '탐색',
      items: [
        { key: 'home', label: '홈', href: '/', icon: '◇' },
        { key: 'discover', label: '둘러보기', href: '/discover', icon: '○' },
        { key: 'library', label: '내 라이브러리', href: '/me', icon: '◎' },
      ],
    },
    {
      label: '창작',
      items: [
        { key: 'upload-track', label: '곡 올리기', href: '/upload/track', icon: '♪' },
        { key: 'upload-lyrics', label: '가사 쓰기', href: '/upload/lyrics', icon: '✎' },
        { key: 'upload-album', label: '앨범 만들기', href: '/upload/album', icon: '◫' },
      ],
    },
  ];

  const activeKey = $derived(deriveActive(page.url.pathname));

  function deriveActive(path: string): string | undefined {
    if (path === '/') return 'home';
    if (path.startsWith('/discover')) return 'discover';
    if (path.startsWith('/me')) return 'library';
    if (path.startsWith('/upload/track')) return 'upload-track';
    if (path.startsWith('/upload/lyrics')) return 'upload-lyrics';
    if (path.startsWith('/upload/album')) return 'upload-album';
    return undefined;
  }
</script>

<AppShell {groups} {activeKey}>
  {#snippet topRight()}
    {#if data.user}
      <a
        href="/me"
        class="bg-bg-2 border-bd-1 hover:bg-bg-3 flex items-center gap-2 rounded-pill border px-2 py-1 text-xs"
      >
        <Avatar src={data.user.avatarUrl} name={data.user.displayName ?? data.user.handle} size={20} />
        <span class="text-fg-2 max-w-[120px] truncate">{data.user.displayName ?? data.user.handle}</span>
      </a>
      <form method="POST" action="/auth/logout">
        <button
          type="submit"
          aria-label="로그아웃"
          class="text-fg-3 hover:bg-bg-2 hover:text-fg-1 inline-flex h-8 w-8 items-center justify-center rounded-md transition"
        >
          ⎋
        </button>
      </form>
    {/if}
  {/snippet}

  {@render children?.()}
</AppShell>
