// See https://svelte.dev/docs/kit/types#app

// $lib/workers/encoder는 Vite의 ?worker 변환을 거치는데, 그 타입을 명시.
declare module '$lib/workers/encoder?worker' {
  const WorkerCtor: { new (): Worker };
  export default WorkerCtor;
}

declare global {
  namespace App {
    interface Locals {
      accessToken?: string;
      user?: CurrentUser;
    }
    interface PageData {
      user?: CurrentUser;
    }
    // interface PageState {}
    interface Platform {
      env?: {
        // Cloudflare Pages bindings은 필요해질 때 추가.
      };
    }
  }
}

export interface CurrentUser {
  id: string;
  handle: string;
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
}

export {};
