import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function goToCheckout(page, data) {
  await measureStep(page, 'Ir a la página de Checkout', async (p) => {
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'load', timeout: TIMEOUTS.navigation }),
      p.locator(SELECTORS.cartContinueBtn).click(),
    ]);
    await check(p, {
      'La opción de compra como invitado debe estar disponible': () => p.locator(SELECTORS.guestContinueBtn).isVisible(),
    });
  }, data);
}