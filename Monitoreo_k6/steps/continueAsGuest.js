import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function continueAsGuest(page, data) {
  await measureStep(page, 'Continuar como invitado', async (p) => {
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'networkidle', timeout: TIMEOUTS.navigation }),
      p.locator(SELECTORS.guestContinueBtn).click(),
    ]);
    await check(p, {
      'La opción de retiro en tienda debe estar disponible': () => p.locator(SELECTORS.pickupRadio).isVisible(),
    });
  }, data);
}