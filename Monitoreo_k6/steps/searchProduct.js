import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';
import { searchResultsCount } from '../metrics/metrics.js';

export async function searchProduct(page, data, SEARCH_TERM) {
  await measureStep(page, 'Buscar producto', async (p) => {
    await p.locator(SELECTORS.searchInput).fill(SEARCH_TERM);
    await p.locator(SELECTORS.searchButton).click();
    await p.locator(SELECTORS.productListSection).waitFor({ timeout: TIMEOUTS.element });
    const results = await p.$$(SELECTORS.productLink);
    searchResultsCount.add(results.length);
    await check(p, {
      'La URL debe contener el término de búsqueda': () => p.url().includes(SEARCH_TERM.toLowerCase()),
      'La búsqueda debe retornar al menos un resultado': () => results.length > 0,
    });
  }, data);
}