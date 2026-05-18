# D1 마이그레이션 절차

> Cloudflare D1 + Drizzle 마이그레이션 관리.

## 언제 사용하는가

- DB 스키마를 변경할 때 (테이블/컬럼/인덱스 추가)
- 마이그레이션 실패 후 복구할 때
- 로컬과 프로덕션 D1을 동기화할 때

## 디렉토리 구조

```
packages/db/
  src/schema/         # Drizzle 스키마 정의
  drizzle/            # 생성된 SQL 마이그레이션 (커밋함)
    0000_initial.sql
    meta/             # drizzle-kit이 만드는 메타 (커밋함)
  drizzle.config.ts
```

마이그레이션 파일은 wrangler가 `apps/api/wrangler.toml`의 `migrations_dir = "../../packages/db/drizzle"` 설정으로 읽는다.

## 워크플로

### 1. 스키마 변경

`packages/db/src/schema/*.ts` 수정. 새 컬럼은 nullable 또는 default 값 설정 권장 (기존 데이터 호환).

### 2. 마이그레이션 생성

```
pnpm db:generate
```

→ `packages/db/drizzle/000X_<name>.sql` 자동 생성. 내용을 검토하고 필요시 수동 보정 (특히 데이터 보존 변경).

### 3. 로컬 적용

```
pnpm db:migrate:local
```

→ `.wrangler/state/v3/d1/`의 로컬 SQLite에 적용. `wrangler dev`로 즉시 검증 가능.

### 4. 프로덕션 적용

```
pnpm db:migrate:prod
```

→ Cloudflare D1 원격에 적용. 적용 전 백업 권장 (D1은 PITR 지원하므로 큰 변경 전 시점 메모).

## D1 제약

- SQLite 기반. PostgreSQL 전용 기능(예: array, jsonb, partial unique with expression) 사용 불가.
- 트랜잭션: 단일 statement 자동 트랜잭션 또는 명시적 `BEGIN ... COMMIT`. 무거운 마이그레이션은 여러 statement로 쪼개기.
- 인덱스/외래 키 제약은 SQLite 규칙 따름. 외래 키는 `PRAGMA foreign_keys = ON`이 기본 활성화돼있으나 확인 필요.
- 컬럼 삭제/타입 변경은 SQLite에서 복잡 → 새 테이블 생성 → 데이터 이전 → 기존 삭제 패턴 (drizzle-kit이 지원).

## 데이터 보존

- 컬럼 추가 (nullable 또는 default): 안전
- 컬럼 삭제: drizzle-kit이 자동 처리하지만, 데이터 손실 확인 필수. 가능하면 1단계로 미사용 처리 → 2단계로 삭제.
- 인덱스 추가: 큰 테이블에선 시간 소요. 운영 트래픽 적은 시간대에 적용.

## 흔한 함정

- `migrations_dir` 경로를 wrangler.toml에서 잘못 적으면 `wrangler d1 migrations`이 빈 목록을 보고 노옵.
- 마이그레이션 파일명에 한글/공백 포함 시 적용 실패 — 영문/숫자/underscore만.
- 로컬 DB는 `.wrangler/state/v3/d1/`에 저장. `wrangler dev`를 끄고 직접 sqlite로 열어볼 수 있음 (디버깅에 유용).
- 외래 키 cascade가 의도와 다르면 데이터 대량 삭제 사고 → 새 외래 키 추가 시 `onDelete` 정책 명시.

## 시드 데이터 (개발용)

`packages/db/src/seed.ts`로 별도 스크립트 작성 가능. wrangler의 `d1 execute --local --file` 또는 코드 안에서 직접 insert.
운영 데이터엔 절대 자동 시드 금지.
