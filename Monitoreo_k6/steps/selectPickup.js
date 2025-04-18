import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function selectPickup(page, data) {
  await measureStep(page, 'Seleccionar tienda', async (p) => {
    await p.locator(SELECTORS.pickupRadio).click();
    await p.locator(SELECTORS.storeModal).waitFor({ state: 'visible', timeout: TIMEOUTS.element });
    const storeButtons = await p.$$(SELECTORS.firstAvailableStoreRadio);
    if (storeButtons.length === 0) throw new Error('No store radio buttons found.');

    let storeSelected = false;
    for (let i = 0; i < storeButtons.length; i++) {
      try {
        await storeButtons[i].click({ force: true, timeout: TIMEOUTS.element });
        if (await storeButtons[i].isChecked()) {
          console.log(`Store ${i + 1} selected successfully`);
          storeSelected = true;
          break;
        }
      } catch (error) {
        console.log(`Error al seleccionar la tienda ${i + 1}: ${error.message}`);
      }
    }
    if (!storeSelected) throw new Error('No se pudo seleccionar ninguna tienda.');

    await p.locator(SELECTORS.selectStoreBtn).click();
    await p.locator(SELECTORS.checkoutContinueBtn).waitFor({ state: 'visible', timeout: TIMEOUTS.element });
    await check(p, {
      'El botón de continuar debe estar disponible después de seleccionar la tienda': () => p.locator(SELECTORS.checkoutContinueBtn).isVisible(),
    });
  }, data);
}