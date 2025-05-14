import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function selectProductListing(page, data) {
  await measureStep(page, 'Seleccionar producto y agregar al carrito', async (p) => {
    // Obtener todos los productos
    const productItems = await p.$$(SELECTORS.productLink);
    if (productItems.length === 0) throw new Error("No hay productos para seleccionar.");

    // Buscar un producto con "pendrive" en el texto
    let targetProductIndex = 0;
    let foundPendrive = false;

    for (let i = 0; i < productItems.length; i++) {
      const productText = await productItems[i].textContent();
      if (productText.toLowerCase().includes('pendrive')) {
        console.log(`Encontrado producto con "Pendrive" en la posición ${i + 1}`);
        targetProductIndex = i;
        foundPendrive = true;
        break;
      }
    }

    if (!foundPendrive) {
      console.log('No se encontró producto con "Pendrive", seleccionando el primero');
    }

    const addToCartButtons = await productItems[targetProductIndex].$$(SELECTORS.agregarCarritoButton);

    if (addToCartButtons.length === 0) {
      console.warn('No se encontró botón "Agregar al carrito" en el listado. No se intentará navegación al detalle.');
      return;
    }

    console.log('Botón "Agregar al carrito" encontrado dentro del producto');

    // Hacer clic en el botón de agregar al carrito
    await addToCartButtons[0].click();
    console.log('Clic en botón "Agregar al carrito" realizado');

    // Esperar específicamente al botón "Ir al carro" que aparece en el modal
    try {
      const botonIrAlCarroSelector = 'a.pcf-btn--five[aria-label="ir al carrito de compra"]';

      await p.waitForSelector(botonIrAlCarroSelector, {
        state: 'visible',
        timeout: TIMEOUTS.element,
      });

      const irAlCarro = p.locator(botonIrAlCarroSelector);
      const visible = await irAlCarro.isVisible();

      if (!visible) throw new Error('El botón "Ir al carro" no está visible después del clic en "Agregar al carrito"');

      console.log('Botón "Ir al carro" visible. Haciendo clic...');
      await irAlCarro.click();
      console.log('Clic en "Ir al carro" realizado');

      // Verificar navegación al carrito
      await p.waitForURL('**/carro', { timeout: TIMEOUTS.navigation });
      console.log('Navegación al carrito exitosa');
    } catch (error) {
      console.error(`Error al procesar el modal o el botón "Ir al carro": ${error.message}`);

      // Capturar para depuración
      await p.screenshot({ path: 'error_modal.png' });
      const html = await p.evaluate(() => document.body.innerHTML);
      console.log('HTML de la página para depuración:', html.substring(0, 500) + '...');

      throw new Error(`No se pudo completar el flujo del carrito: ${error.message}`);
    }
  }, data);
}
