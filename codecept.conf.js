// Headless por defecto. Para correr en modo headed: HEADED=true npm run test:headed
exports.config = {
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'https://www.liverpool.com.mx/tienda/home',
      show: process.env.HEADED === 'true',
      video: true,
      pressKeyDelay: 100,
      trace: true,
      keepTraceForPassedTests: true,
    },
    PlaywrigthVideoAllure: {
      require: './utils/playwrightVideoAllure_helper.js'
    },

    NetworkHelper: {
      require: './helpers/NetworkHelper.js'
    }
  },
  include: {
    I: './steps_file.js',
    SearchPage: './pages/SearchPage.js'
  },
  mocha: {},
  bootstrap: null,
  timeout: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: './features/*.feature',
    steps: [
      './step_definitions/steps.js',
      './step_definitions/SearchSteps.js',
    ]
  },
  plugins: {
    screenshot: {
      enabled: true,
      on: 'fail'
    },
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy',
      outputDir: './output/allure-results'
    }
  },
  stepTimeout: 0,
  stepTimeoutOverride: [{
      pattern: 'wait.*',
      timeout: 0
    },
    {
      pattern: 'amOnPage',
      timeout: 0
    }
  ],
  tests: './tests/*_test.js',
  noGlobals: true,
  name: 'TestQA'
}