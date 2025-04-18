import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function addToCart(page, data) {
  await measureStep(page, 'Agregar al carrito', async (p) => {
    await p.locator(SELECTORS.productAddToCartBtn).click();
    await p.locator(SELECTORS.modalGoToCartBtn).waitFor({ timeout: TIMEOUTS.element });
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'load', timeout: TIMEOUTS.navigation }),
      p.locator(SELECTORS.modalGoToCartBtn).click(),
    ]);
    await check(p, {
      'La URL debe indicar que estamos en la página del carrito': () => p.url().includes('carro'),
      'El botón para continuar al checkout debe estar presente': () => p.locator(SELECTORS.cartContinueBtn).isVisible(),
    });
  }, data);
}