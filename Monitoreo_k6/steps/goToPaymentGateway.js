import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function goToPaymentGateway(page, data, paymentGatewayUrl) {
  await measureStep(page, 'Ir a la pasarela de pago', async (p) => {
    await Promise.all([
      p.locator(SELECTORS.payButton).click(),
      p.waitForNavigation({ waitUntil: 'networkidle', timeout: TIMEOUTS.navigation + 5000 }),
    ]);
    const finalUrl = p.url();
    console.log(`Redirigido a: ${finalUrl}`);
    await check(p, {
      [`La URL debe redirigir a la pasarela de pago (${paymentGatewayUrl})`]: () => finalUrl.includes(paymentGatewayUrl),
    });
  }, data);
}