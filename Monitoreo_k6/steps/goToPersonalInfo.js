import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function goToPersonalInfo(page, data) {
  await measureStep(page, 'Ir a la sección Información personal', async (p) => {
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'load', timeout: TIMEOUTS.navigation }),
      p.locator(SELECTORS.checkoutContinueBtn).click(),
    ]);
    await p.locator(SELECTORS.receiptNameInput).waitFor({ state: 'visible', timeout: TIMEOUTS.element });
    await check(p, {
      'El campo de nombre debe estar presente': () => p.locator(SELECTORS.receiptNameInput).isVisible(),
    });
  }, data);
}