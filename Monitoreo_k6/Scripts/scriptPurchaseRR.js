import e2ePurchase from '../scenarios/e2ePurchaseRR.js';
import { selectPaymentMethod } from '../helpers/setupPayment.js';

export const options = {
  scenarios: {
    k6_pcf_e2e_purchase: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      startTime: '0s',
      maxDuration: '2m',
      options: { browser: { type: 'chromium', ignoreHTTPSErrors: true } }
    }
  }
};

export async function setup() {
  return selectPaymentMethod();
}

export default e2ePurchase;