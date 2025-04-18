import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function selectProduct(page, data) {
  await measureStep(page, 'Seleccionar producto', async (p) => {
    const firstProduct = await p.$$(SELECTORS.productLink);
    if (firstProduct.length === 0) throw new Error("No hay productos para seleccionar.");

    let foundBolsa = false;
    for (let i = 0; i < firstProduct.length; i++) {
      const productText = await firstProduct[i].textContent();
      if (productText.toLowerCase().includes('bolsa')) {
        console.log(`Encontrado producto con "Bolsa" en la posición ${i + 1}`);
        await firstProduct[i].click();
        foundBolsa = true;
        break;
      }
    }
    if (!foundBolsa) {
      console.log('No se encontró producto con "Bolsa", seleccionando el primero');
      await firstProduct[0].click();
    }

    await p.locator(SELECTORS.productAddToCartBtn).waitFor({ timeout: TIMEOUTS.element });
    await check(p, {
      'La URL debe indicar que estamos en la página de detalle de producto': () => p.url().includes('producto'),
      'El botón de añadir al carrito debe estar disponible': () => p.locator(SELECTORS.productAddToCartBtn).isVisible(),
    });
  }, data);
}