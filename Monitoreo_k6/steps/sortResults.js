import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function sortResults(page, data) {
  await measureStep(page, 'Resultados de la búsqueda', async (p) => {
    await p.locator(SELECTORS.sortDropdown).click();
    await p.locator(SELECTORS.sortPriceAsc).click();
    await p.waitForLoadState('networkidle', { timeout: TIMEOUTS.networkIdle });
    await check(p, {
      'La lista de productos debe permanecer visible después de ordenar': () => p.locator(SELECTORS.productListSection).isVisible(),
    });
  }, data);
}