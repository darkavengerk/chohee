import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';

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

  if (!apiRes.ok) {
    await apiRes.text().catch(() => null);
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', `api_${apiRes.status}`);
    return NextResponse.redirect(url);
  }

  // API가 Set-Cookie 헤더로 쿠키를 발급. 같은 도메인에서 다시 set 해주는 편이 안전하다.
  const cookieHeader = apiRes.headers.get('set-cookie');
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = '/me';
  redirectUrl.search = '';
  const res = NextResponse.redirect(redirectUrl);
  if (cookieHeader) {
    res.headers.set('set-cookie', cookieHeader);
  }
  return res;
}
