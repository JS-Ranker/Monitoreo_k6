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
    
    // 5. Guardar dirección 
    const botonGuardar = p.locator('#submit-address-btn');
    await botonGuardar.waitFor({ state: 'visible', timeout: 5000 });
    await botonGuardar.click();
    await p.waitForTimeout(2000);
    
    // 6. Esperar navegación
    await p.waitForNavigation({ waitUntil: 'networkidle', timeout: TIMEOUTS.navigation });

    // 7. Seleccionar el radio button especificado
    const radioXPath = '//*[@id="pcf-checkout-view"]/div[1]/div[1]/div[2]/section[2]/div/div/div[2]/div[2]/div/div/div[1]/input';
    const radioButton = p.locator(`xpath=${radioXPath}`);
    
    try {
      await radioButton.waitFor({ state: 'visible', timeout: 5000 });
      await radioButton.click();
      console.log('Radio button seleccionado correctamente');
    } catch (error) {
      console.log('Error al seleccionar el radio button:', error.message);
      
      // Plan B: Usar evaluate si el botón no es directamente clickeable
      try {
        await p.evaluate((xpath) => {
          const radio = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (radio) {
            radio.click();
            return true;
          }
          return false;
        }, radioXPath);
        console.log('Radio button seleccionado mediante evaluate');
      } catch (evaluateError) {
        console.log('Error también al usar evaluate:', evaluateError.message);
      }
    }
    
    // 8. Obtener información de los radios y mostrarla en consola (en el entorno K6)
    const radiosInfo = await p.evaluate(() => {
      const radios = Array.from(document.querySelectorAll('input[type="radio"][name="dispatchMethod"]'));
      return radios.map(r => ({
        value: r.value,
        checked: r.checked,
        disabled: r.disabled,
        visible: r.offsetParent !== null, // visibilidad real
      }));
    });
    
    console.log('Radios encontrados:', radiosInfo);
  }, data);
}