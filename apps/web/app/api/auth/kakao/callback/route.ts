import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';

// route handler는 layout 상속을 안 받으므로 명시 필요.
export const runtime = 'edge';

// 카카오 OAuth redirect_uri. 받은 code를 API(Workers)에 전달하여
// 자체 JWT 쿠키로 교환한다. 카카오 access token은 서버 간에만 흘러간다.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const errorParam = req.nextUrl.searchParams.get('error');
  if (errorParam || !code) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', errorParam ?? 'missing_code');
    return NextResponse.redirect(url);
  }

  const apiRes = await fetch(`${env.API_BASE_URL}/auth/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  // API가 Set-Cookie 헤더로 쿠키를 발급. Workers와 web이 다른 origin이면
  // 브라우저가 third-party 쿠키로 처리할 수 있으므로 우리가 같은 도메인에서
  // 다시 set 해주는 편이 안전하다.
  if (!apiRes.ok) {
    await apiRes.text().catch(() => null);
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', `api_${apiRes.status}`);
    return NextResponse.redirect(url);
  }

  const cookieHeader = apiRes.headers.get('set-cookie');
  const next = req.nextUrl.searchParams.get('state') ? '/me' : '/me';
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = next;
  redirectUrl.search = '';
  const res = NextResponse.redirect(redirectUrl);
  if (cookieHeader) {
    // 여러 Set-Cookie를 한 줄로 합쳤을 수 있음 → 모두 그대로 전달
    res.headers.set('set-cookie', cookieHeader);
  }
  return res;
}
