# apps/web

Next.js 14 App Router 기반 사용자 웹.

## 개발 실행

```bash
pnpm dev    # 루트에서 (모든 앱 동시) 또는
pnpm --filter @chohee/web dev
```

## 주요 경로

- `/` — 홈 (Hero + 신규 곡/가사/앨범)
- `/login` — 카카오 로그인
- `/me`, `/me/edit` — 마이페이지/프로필 수정
- `/upload` — 무엇을 올릴지 분기
- `/upload/track` — 곡 업로드 (ffmpeg.wasm 인코딩 포함)
- `/upload/lyrics` — 가사 작성 + "음악 제안 받기" 의향 발행 (Phase 2에서 다른 사용자의 제안 수집·채택 UI 추가)
- `/upload/album` — 앨범 생성 + 항목 배치
- `/discover` — 둘러보기 (Phase 2에서 채워짐)
- `/api/auth/kakao/callback` — 카카오 redirect_uri (Route Handler)

## 주의

- COOP/COEP 헤더가 모든 페이지에 적용됨 (ffmpeg.wasm용). 외부 임베드가 깨질 수 있어 후속에 업로드 라우트로 격리 검토.
- 디자인 토큰은 `@chohee/ui`의 Tailwind 프리셋을 통해 자동 주입.
- 보호된 라우트(`/me`, `/upload`, `/library`)는 `middleware.ts`에서 쿠키 확인 후 `/login`으로 리다이렉트.
