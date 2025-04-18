import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function selectPaymentMethod(page, data, paymentMethodId, paymentMethodName) {
  await measureStep(page, 'Seleccionar Método de Pago', async (p) => {
    await p.locator(SELECTORS.paymentMethodRadio(paymentMethodId)).click({ force: true, timeout: TIMEOUTS.element });
    await p.locator(SELECTORS.payButton).waitFor({ timeout: TIMEOUTS.element });
    await check(p, {
      'El botón de pago debe estar disponible después de seleccionar el método de pago': () => p.locator(SELECTORS.payButton).isVisible()
    });
  }, data, { payment_method_name: paymentMethodName });
}