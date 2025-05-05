import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function goToPersonalInfo(page, data) {
  await measureStep(page, 'Ir a la sección Información personal', async (p) => {
    // Esperamos a que el botón de continuar esté visible
    await p.locator(SELECTORS.checkoutContinueBtn).waitFor({ state: 'visible', timeout: TIMEOUTS.element });
    
    // Hacemos clic en el botón de continuar
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'load', timeout: TIMEOUTS.navigation }),
      p.locator(SELECTORS.checkoutContinueBtn).click(),
    ]);
    
    // Esperamos a que el formulario de datos personales sea visible
    await p.locator(SELECTORS.receiptNameInput).waitFor({ state: 'visible', timeout: TIMEOUTS.element });
    
    // Verificamos que estamos en la página correcta
    await check(p, {
      'El campo de nombre debe estar presente': () => p.locator(SELECTORS.receiptNameInput).isVisible(),
      'El campo de email debe estar presente': () => p.locator(SELECTORS.receiptEmailInput).isVisible(),
    });
  }, data);
}