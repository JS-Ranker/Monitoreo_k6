import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function selectProductListing(page, data) {
  await measureStep(page, 'Seleccionar producto y agregar al carrito', async (p) => {
    const productItems = await p.$$(SELECTORS.productLink);
    if (productItems.length === 0) throw new Error("No hay productos para seleccionar.");

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

    await addToCartButtons[0].click();
    console.log('Clic en botón "Agregar al carrito" realizado');

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

      let urlCambiada = false;
      const timeoutMs = TIMEOUTS.navigation;
      const start = Date.now();

      while (Date.now() - start < timeoutMs) {
        const currentUrl = page.url();
        if (currentUrl.includes('/carro')) {
          urlCambiada = true;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (!urlCambiada) {
        throw new Error(`No se detectó navegación al carrito dentro de ${timeoutMs} ms`);
      }

      console.log('Navegación al carrito exitosa');

      // ✅ NUEVO PASO: hacer clic en "Continuar" para ir al checkout
      const botonContinuarSelector = 'a.pcf-btn--five[aria-label="ir al checkout"]';

      await p.waitForSelector(botonContinuarSelector, {
        state: 'visible',
        timeout: TIMEOUTS.element,
      });

      const botonContinuar = p.locator(botonContinuarSelector);
      const continuarVisible = await botonContinuar.isVisible();

      if (!continuarVisible) throw new Error('El botón "Continuar" no está visible en el carrito');

      console.log('Botón "Continuar" visible. Haciendo clic...');
      await botonContinuar.click();
      console.log('Clic en "Continuar" hacia el checkout realizado');

    } catch (error) {
      console.error(`Error al procesar el flujo del carrito: ${error.message}`);

      await p.screenshot({ path: 'error_modal.png' });
      const html = await p.evaluate(() => document.body.innerHTML);
      console.log('HTML de la página para depuración:', html.substring(0, 500) + '...');

      throw new Error(`No se pudo completar el flujo del carrito: ${error.message}`);
    }
  }, data);
}
