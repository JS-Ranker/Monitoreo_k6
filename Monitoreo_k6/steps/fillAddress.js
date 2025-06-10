import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';
import { GUEST_DATA } from '../config/constants.js';

export async function fillAddress(page, data) {
  await measureStep(page, 'Completar dirección de despacho', async (p) => {
    // 1. Completar campo general de dirección
    const inputCompleto = p.locator('#dispatch-address-from-maps');
    await inputCompleto.waitFor({ state: 'visible', timeout: 5000 });
    await inputCompleto.fill(GUEST_DATA.address.street_Complete);

    // 2. Esperar a que aparezca el menú de sugerencias de Google Maps
    await p.waitForTimeout(1500);

    // 3. Usar navegación por teclado para seleccionar la primera opción
    await inputCompleto.press('ArrowDown');
    await p.waitForTimeout(500);
    await inputCompleto.press('Enter');

    // 4. Esperar a que se completen automáticamente los campos
    await p.waitForTimeout(2000);

    // 4.1 Seleccionar ciudad
    const cityInput = p.locator('#dispatch-address-city');
    await cityInput.waitFor({ state: 'visible', timeout: 5000 });
    await cityInput.click();
    await p.waitForTimeout(500);

    // Seleccionar la opción de la lista desplegable
    const cityOption = p.locator('xpath=//*[@id="dispatch-address"]/span/form/div[1]/div[5]/span/div/div/span');
    await cityOption.waitFor({ state: 'visible', timeout: 5000 });
    await cityOption.click();
    await p.waitForTimeout(500);

    // 5. Guardar dirección 
    const botonGuardar = p.locator('#submit-address-btn');
    await botonGuardar.waitFor({ state: 'visible', timeout: 5000 });
    await botonGuardar.click();
    await p.waitForTimeout(2000);

    // 6. Seleccionar el radio button de despacho a domicilio por XPath exacto
    const radioButton = p.locator('xpath=//*[@id="pcf-checkout-view"]/div[1]/div[1]/div[2]/section[2]/div/div/div[2]/div[2]/div/div/div[1]/input');
    try {
      await radioButton.waitFor({ state: 'visible', timeout: 10000 });
      await radioButton.click();
      await p.waitForTimeout(500);
    } catch (e) {
    
      const bodyHtml = await p.locator('body').innerHTML();
      console.log('No se encontró el radio button por XPath. HTML del body:', bodyHtml);
      throw new Error('No se encontró el radio button de despacho a domicilio en el DOM');
    }

    
  }, data);
}