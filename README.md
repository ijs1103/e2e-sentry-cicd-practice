# 🎬 Next.js 15 Movie App - E2E Sentry CICD Practice

영화 검색 애플리케이션 프로젝트로, **단위 테스트**, **E2E 테스트**, **CI/CD 파이프라인**이 완벽하게 통합되어 있습니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [테스트 구조](#테스트-구조)
- [단위 테스트](#단위-테스트)
- [E2E 테스트](#e2e-테스트)
- [CI/CD 파이프라인](#cicd-파이프라인)
- [테스트 실행 방법](#테스트-실행-방법)
- [기술 스택](#기술-스택)

---

## 🎯 프로젝트 개요

OMDb API를 활용한 영화 검색 애플리케이션입니다. Next.js 15, React 19, TypeScript를 기반으로 하며, TanStack Query를 사용한 상태 관리, Zustand를 활용한 전역 상태 관리, 그리고 Sentry를 통한 에러 모니터링을 포함합니다.

---

## 🧪 테스트 구조

프로젝트는 다음과 같은 테스트 구조를 가지고 있습니다:

```
e2e-sentry-cicd-practice/
├── __tests__/                    # 단위 테스트 디렉토리
│   ├── components/               # 컴포넌트 테스트 (7개)
│   │   ├── Button.test.tsx
│   │   ├── Header.test.tsx
│   │   ├── Headline.test.tsx
│   │   ├── Loader.test.tsx
│   │   ├── MovieItem.test.tsx
│   │   ├── MovieList.test.tsx
│   │   └── SearchBar.test.tsx
│   ├── hooks/                    # 커스텀 훅 테스트
│   │   └── movies.test.tsx
│   └── app/                      # API 라우트 테스트
│       └── api/
│           └── movies/
│               └── route.test.ts
├── cypress/                      # E2E 테스트 디렉토리
│   ├── e2e/
│   │   └── e2e-test.cy.ts       # E2E 테스트 (5개 시나리오)
│   ├── fixtures/
│   └── support/
├── jest.config.ts                # Jest 설정
├── jest.setup.ts                 # Jest 초기 설정
└── cypress.config.ts             # Cypress 설정
```

---

## 🔬 단위 테스트

### 테스트 프레임워크

- **Jest**: JavaScript 테스트 프레임워크
- **React Testing Library**: React 컴포넌트 테스트 라이브러리
- **@testing-library/user-event**: 사용자 이벤트 시뮬레이션
- **MSW (Mock Service Worker)**: API 모킹

### Jest 설정

```typescript
// jest.config.ts
{
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  }
}
```

### 컴포넌트 테스트 (7개 파일)

#### 1. Button.test.tsx
- 기본 버튼 렌더링 테스트
- children props 표시 확인
- color prop 스타일 적용 확인
- loading 상태 시 Loader 컴포넌트 표시
- onClick 이벤트 핸들러 동작 확인

#### 2. Header.test.tsx
- 헤더 컴포넌트 렌더링 확인
- 로고 및 네비게이션 요소 테스트

#### 3. Headline.test.tsx
- 제목 컴포넌트 렌더링 테스트
- 텍스트 내용 확인

#### 4. Loader.test.tsx
- 로딩 스피너 렌더링 테스트
- 커스텀 색상 prop 적용 확인
- 애니메이션 스타일 검증

#### 5. MovieItem.test.tsx
- 영화 아이템 카드 렌더링
- 영화 정보 표시 확인 (제목, 연도, 포스터)
- 링크 동작 테스트

#### 6. MovieList.test.tsx
- 영화 목록 렌더링
- 빈 상태 처리
- 영화 아이템 배열 렌더링 확인

#### 7. SearchBar.test.tsx
- 검색 입력 필드 렌더링
- 텍스트 입력 이벤트 처리
- 검색 버튼 클릭 이벤트
- 리셋 버튼 동작 확인

### 커스텀 훅 테스트

#### movies.test.tsx
**useMoviesStore 테스트:**
- `setInputText()` - 입력 텍스트 업데이트
- `setSearchText()` - 검색 텍스트 업데이트
- `setMessage()` - 메시지 상태 업데이트
- `resetMovies()` - 모든 상태 초기화

**useMovies 테스트:**
- 빈 searchText 처리 (빈 배열 반환)
- API 호출 및 영화 목록 반환
- API 에러 응답 처리
- 공백만 있는 searchText 처리
- isFetching/isLoading 상태 확인

### API 라우트 테스트

#### route.test.ts
- `GET /api/movies` - title 파라미터로 OMDB API 호출
- 응답 데이터 검증
- OMDB_API_KEY 환경변수 사용 확인

---

## 🌐 E2E 테스트

### 테스트 프레임워크

- **Cypress**: E2E 테스트 프레임워크

### Cypress 설정

```typescript
// cypress.config.ts
{
  e2e: {
    baseUrl: 'https://e2e-sentry-cicd-practice.vercel.app/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
}
```

### E2E 테스트 시나리오 (5개)

#### 시나리오 1: 페이지 방문 확인
```typescript
it('메인 페이지에 접속했을 때 타이틀이 보여야 합니다.', () => {
  cy.get('h1').contains('OMDb API')
})
```
- 메인 페이지 접속
- h1 태그에 'OMDb API' 텍스트 확인

#### 시나리오 2: 샘플 무비 버튼 클릭
```typescript
it("샘플무비 버튼을 클릭하면 'Frozen II' 데이터가 로드되어야 합니다.", () => {
  cy.contains('📽️ Sample Movie').click()
  cy.get('h1').contains('Frozen II')
})
```
- '📽️ Sample Movie' 버튼 클릭
- 'Frozen II' 영화 데이터 로드 확인

#### 시나리오 3: 영화 검색
```typescript
it("'star wars' 검색 시 10개의 영화 결과가 보여야 합니다.", () => {
  cy.get('[data-testid="input-text"]').type('star wars')
  cy.get('[data-testid="button-search"]').click()
  cy.get('li.group').should('have.length', 10)
})
```
- 검색어 'star wars' 입력
- 검색 버튼 클릭
- 10개의 영화 결과 표시 확인

#### 시나리오 4: 영화 상세 페이지 이동
```typescript
it('검색된 영화 포스터 클릭 시 상세 페이지로 이동해야 합니다.', () => {
  cy.get('[data-testid="input-text"]').type('star wars')
  cy.get('[data-testid="button-search"]').click()
  cy.get('li.group').first().find('a').click()
  cy.url().should('include', '/movies/')
  cy.get('h1').should('contain.text', 'Star Wars')
})
```
- 'star wars' 검색
- 첫 번째 영화 포스터 클릭
- 상세 페이지로 이동 확인 (`/movies/` URL 포함)
- 영화 제목 표시 확인

#### 시나리오 5: Reset 버튼
```typescript
it('Reset 버튼 클릭 시 검색창과 결과 화면이 초기화되어야 합니다.', () => {
  cy.get('[data-testid="input-text"]').type('star wars')
  cy.get('[data-testid="button-search"]').click()
  cy.get('[data-testid="button-reset"]').click()
  cy.get('[data-testid="input-text"]').should('have.value', '')
  cy.contains('p', 'Search for the movie title!')
})
```
- 'star wars' 검색
- Reset 버튼 클릭
- 검색창 초기화 확인
- 초기 메시지 표시 확인

---

## 🚀 CI/CD 파이프라인

### GitHub Actions 워크플로우

파일 위치: `.github/workflows/ci.yml`

### 워크플로우 트리거

- **Push**: `main` 브랜치로 push 시
- **Pull Request**: `main` 브랜치를 대상으로 하는 PR 생성 또는 업데이트 시

### CI 파이프라인 구조

```yaml
name: CI Tests (Unit & E2E)

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

### Job 1: 린트 및 단위 테스트 (`unit-test-and-lint`)

**실행 환경:**
- `ubuntu-latest`
- Node.js 20

**단계:**
1. **코드 체크아웃** (`actions/checkout@v4`)
2. **Node.js 설정** (`actions/setup-node@v4`)
   - Node.js 버전: 20
   - npm 캐시 활성화
3. **의존성 설치**
   ```bash
   npm ci
   ```
4. **린트 실행**
   ```bash
   npm run lint
   ```
5. **단위 테스트 실행**
   ```bash
   npm run test
   ```

### Job 2: E2E 테스트 (`e2e-test`)

**실행 환경:**
- `ubuntu-latest`
- Node.js 20
- **의존성**: `unit-test-and-lint` Job 성공 시에만 실행

**단계:**
1. **코드 체크아웃** (`actions/checkout@v4`)
2. **Node.js 설정** (`actions/setup-node@v4`)
3. **의존성 설치**
   ```bash
   npm ci
   ```
4. **Next.js 프로젝트 빌드**
   ```bash
   npm run build
   ```
5. **E2E 테스트 실행**
   ```bash
   npm run test:e2e
   ```
   - `start-server-and-test` 패키지 사용
   - 서버 시작 후 Cypress 테스트 실행

---

## ⚡ 테스트 실행 방법

### 단위 테스트

```bash
# 전체 단위 테스트 실행
npm run test

# Watch 모드로 테스트 실행
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage
```

### E2E 테스트

```bash
# Cypress 헤드리스 모드로 실행
npm run e2e

# 서버 시작 후 E2E 테스트 실행
npm run test:e2e
```

### 린트 검사

```bash
npm run lint
```

### 개발 서버 시작

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
npm start
```

---

## 🛠️ 기술 스택

### 프레임워크 & 라이브러리
- **Next.js 15.5.4** - React 프레임워크
- **React 19.1.0** - UI 라이브러리
- **TypeScript 5** - 타입 안전성

### 상태 관리
- **@tanstack/react-query 5.90.2** - 서버 상태 관리
- **Zustand 5.0.8** - 클라이언트 상태 관리

### 스타일링
- **Tailwind CSS 4** - 유틸리티 CSS 프레임워크
- **tailwind-merge** - Tailwind 클래스 병합

### 테스트
- **Jest 30.2.0** - 단위 테스트 프레임워크
- **React Testing Library 16.3.0** - React 컴포넌트 테스트
- **Cypress 15.6.0** - E2E 테스트 프레임워크
- **MSW 2.11.3** - API 모킹

### 모니터링
- **@sentry/nextjs 10.24.0** - 에러 트래킹 및 성능 모니터링

### DevOps
- **GitHub Actions** - CI/CD 파이프라인
- **start-server-and-test** - E2E 테스트 서버 관리

### HTTP 클라이언트
- **Axios 1.12.2** - HTTP 요청 라이브러리

---

## 📝 환경 변수

프로젝트 실행을 위해 다음 환경 변수가 필요합니다:

```env
OMDB_API_KEY=your_api_key_here
```

---

## 📄 라이선스

이 프로젝트는 학습 및 실습 목적으로 작성되었습니다.
