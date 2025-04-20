import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function enterCredentials(page, data, credentials) {
  await measureStep(page, 'ingresar_credenciales', async (p) => {
    await p.waitForSelector(SELECTORS.usernameInput, { timeout: TIMEOUTS.element });
    await p.waitForSelector(SELECTORS.passwordInput, { timeout: TIMEOUTS.element });
    
    // Ingresar credenciales
    await p.fill(SELECTORS.usernameInput, credentials.rut);
    await p.fill(SELECTORS.passwordInput, credentials.password);
    
    // Obtener valores para verificar (antes de ejecutar el check)
    const usernameValue = await p.locator(SELECTORS.usernameInput).inputValue();
    const passwordValue = await p.locator(SELECTORS.passwordInput).inputValue();
    
    // Ejecutar check con valores ya obtenidos (no funciones asíncronas)
    check(p, {
      'El campo de usuario está lleno': () => usernameValue.length > 0,
      'El campo de contraseña está lleno': () => passwordValue.length > 0
    });
  }, data);
}