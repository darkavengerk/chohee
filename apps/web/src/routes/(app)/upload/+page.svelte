<script lang="ts">
  import Card from '@chohee/ui/components/Card.svelte';

  const options = [
    {
      href: '/upload/track',
      icon: '♪',
      title: '곡 올리기',
      desc: '오디오 파일을 올려 멀티 비트레이트로 변환하고 메타데이터와 함께 게시.',
    },
    {
      href: '/upload/lyrics',
      icon: '✎',
      title: '가사 쓰기',
      desc: '가사 텍스트를 발행. 원하면 다른 사용자에게 음악 제안을 받을 수 있어.',
    },
    {
      href: '/upload/album',
      icon: '◫',
      title: '앨범 만들기',
      desc: '곡과 가사를 컨셉으로 묶어. 순서와 무드 태그로 통일감을 부여.',
    },
  ] as const;
</script>

<svelte:head>
  <title>업로드 — Chohee</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-12">
  <h1 class="text-3xl font-semibold">무엇을 올릴까요?</h1>
  <p class="text-fg-3 mt-2 text-sm">
    트랙, 가사, 앨범 — 세 가지 콘텐츠 모두 1급 시민입니다.
  </p>

  <div class="mt-10 grid gap-4 md:grid-cols-3">
    {#each options as opt (opt.href)}
      <a href={opt.href} class="block">
        <Card padding="lg" class="hover:border-accent hover:bg-bg-2 h-full transition-colors">
          <span class="text-accent text-3xl">{opt.icon}</span>
          <h2 class="mt-4 text-lg font-medium">{opt.title}</h2>
          <p class="text-fg-3 mt-2 text-sm leading-relaxed">{opt.desc}</p>
        </Card>
      </a>
    {/each}
  </div>
</div>
