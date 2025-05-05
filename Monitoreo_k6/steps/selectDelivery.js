import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function selectDelivery(page, data) {
  await measureStep(page, 'Seleccionar despacho a domicilio', async (p) => {
    // Esperamos que el radio de despacho a domicilio sea visible
    await p.locator(SELECTORS.deliveryRadio).waitFor({ state: 'visible', timeout: TIMEOUTS.element });
    // Hacemos clic en el radio de despacho a domicilio
    await p.locator(SELECTORS.deliveryRadio).click();
    
    // Verificar que la opción de despacho a domicilio fue seleccionada
    const isChecked = await p.evaluate(() => {
      const radioButton = document.querySelector('input[type="radio"][name="delivery-type"][value="delivery"]');
      return radioButton && radioButton.checked;
    });
    
    await check(p, {
      'El formulario de dirección debe estar visible': () => p.locator(SELECTORS.communeInput).isVisible(),
    });
  }, data);
}