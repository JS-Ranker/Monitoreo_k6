import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function openLoginDropdown(page, data) {
  await measureStep(page, 'abrir_dropdown_login', async (p) => {
    await p.waitForSelector(SELECTORS.loginDropdown, { timeout: TIMEOUTS.element });
    await p.click(SELECTORS.loginDropdown);
    await check(p, {
      'El dropdown de login debe estar visible': () => p.locator(SELECTORS.loginMenuLink).isVisible()
    });
  }, data);
}