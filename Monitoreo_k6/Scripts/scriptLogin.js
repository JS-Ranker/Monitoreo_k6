import e2eLogin from '../scenarios/e2eLogin.js';

export const options = {
  scenarios: {
    k6_pcf_e2e_login: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      startTime: '0s',
      maxDuration: '1m',
      options: {
        browser: {
          type: 'chromium',
          ignoreHTTPSErrors: true
        }
      }
    }
  }
};

export default e2eLogin;