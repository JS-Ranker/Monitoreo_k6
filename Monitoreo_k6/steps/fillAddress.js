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
    
    // 5. Guardar dirección usando el selector específico proporcionado
    const botonGuardar = p.locator('#submit-address-btn');
    await botonGuardar.waitFor({ state: 'visible', timeout: 5000 });
    await botonGuardar.click();
    await p.waitForTimeout(2000);
    
    // 6. Esperar navegación
    await p.waitForNavigation({ waitUntil: 'networkidle', timeout: TIMEOUTS.navigation });

    // falta completar .....

  }, data);
}