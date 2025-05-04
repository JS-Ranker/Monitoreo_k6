import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function selectDelivery(page, data) {
  await measureStep(page, 'Seleccionar despacho a domicilio', async (p) => {
    // Seleccionar la opción de despacho a domicilio
    const radio = p.locator(SELECTORS.deliveryRadio);
    await radio.waitFor({ state: 'visible', timeout: TIMEOUTS.short });
    await radio.click();

    
    // Esperar a que la interfaz se actualice para mostrar el formulario de dirección
    await p.waitForTimeout(1000); // Breve espera para asegurar que el DOM se actualice
    
    await check(p, {
      'El formulario de dirección debe estar visible': () => p.locator(SELECTORS.addressRegionSelect).isVisible(),
    });
  }, data);
}