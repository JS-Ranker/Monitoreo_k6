import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function fillAddress(page, data, GUEST_DATA) {
  await measureStep(page, 'Completar dirección de despacho', async (p) => {
    // Seleccionamos la comuna
    await p.locator(SELECTORS.communeInput).fill('Santiago');
    await p.waitForTimeout(1000); // Esperamos que aparezca el dropdown
    
    // Seleccionamos la primera opción del dropdown
    const communeOptions = await p.$$(SELECTORS.communeDropdownItem);
    if (communeOptions.length === 0) throw new Error('No se encontraron opciones de comuna');
    
    await communeOptions[0].click();
    
    // Completamos el resto de campos de la dirección
    await p.locator(SELECTORS.streetInput).fill(GUEST_DATA.address.street);
    await p.locator(SELECTORS.numberInput).fill(GUEST_DATA.address.number);
    await p.locator(SELECTORS.deptInput).fill(GUEST_DATA.address.complement);
    
    // Hacemos clic en el botón de continuar
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'networkidle', timeout: TIMEOUTS.navigation }),
      p.locator(SELECTORS.continueAddressBtn).click(),
    ]);
    
    // Verificamos que hemos avanzado correctamente
    await check(p, {
      'El botón de continuar al siguiente paso debe estar visible': () => p.locator(SELECTORS.checkoutContinueBtn).isVisible(),
    });
  }, data);
}