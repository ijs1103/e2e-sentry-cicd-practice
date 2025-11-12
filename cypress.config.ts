import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // ⭐️ 테스트할 웹사이트의 기본 URL을 설정합니다.
    baseUrl: 'https://e2e-sentry-cicd-practice.vercel.app/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
})
