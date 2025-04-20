import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function submitLogin(page, data) {
  await measureStep(page, 'submit_login', async (p) => {
    await p.waitForSelector(SELECTORS.loginButton, { timeout: TIMEOUTS.element });
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'load', timeout: TIMEOUTS.navigation }),
      p.click(SELECTORS.loginButton),
    ]);
    
    // Primero obtenemos los valores que necesitamos verificar
    const currentUrl = p.url();
    const dropdownText = await p.locator(SELECTORS.loginDropdown).textContent();
    
    // Luego ejecutamos los checks con valores ya recuperados
    check(p, { 
      'Regresó a pcfactory.cl': () => currentUrl.includes('pcfactory.cl'),
      'Usuario se encuentra logueado': () => dropdownText.toLowerCase().includes('hola')
    });
  }, data);
}