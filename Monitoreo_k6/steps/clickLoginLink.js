import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function clickLoginLink(page, data) {
  await measureStep(page, 'click_inicia_sesion', async (p) => {
    await p.waitForSelector(SELECTORS.loginMenuLink, { timeout: TIMEOUTS.element });
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'load', timeout: TIMEOUTS.navigation }),
      p.click(SELECTORS.loginMenuLink),
    ]);
    await check(p, { 
      'Redirige a auth.pcfactory.cl': () => p.url().includes('auth.pcfactory.cl')
    });
  }, data);
}