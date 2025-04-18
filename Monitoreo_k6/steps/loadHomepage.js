import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function loadHomepage(page, data, TARGET_URL) {
  await measureStep(page, 'Cargar página de inicio', async (p) => {
    await p.goto(TARGET_URL, { waitUntil: 'load', timeout: TIMEOUTS.pageLoad });
    await p.locator(SELECTORS.searchInput).waitFor({ timeout: TIMEOUTS.element });
    await check(p, {
      'La URL debe pertenecer al dominio de PCFactory': () => p.url().includes('pcfactory.cl'),
      'El campo de búsqueda debe estar presente en la página de inicio': () => p.locator(SELECTORS.searchInput).isVisible()
    });
  }, data);
}