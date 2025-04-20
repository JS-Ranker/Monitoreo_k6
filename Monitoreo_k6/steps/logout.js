import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .replace(/\s+/g, ' ')  // reemplaza múltiples espacios y saltos de línea por un solo espacio
    .trim();
}

export async function logout(page, data) {
  await measureStep(page, 'logout_pc_factory', async (p) => {
    const dropdown = await p.waitForSelector(SELECTORS.loginDropdown, { timeout: TIMEOUTS.element });
    if (!dropdown) throw new Error('No se encontró el botón de usuario (dropdown)');
    
    await dropdown.click();
    await p.waitForTimeout(1000);
    
    // Capturamos el texto *antes* de cerrar sesión
    const dropdownTextBefore = await dropdown.textContent();
    
    const logoutLink = await p.waitForSelector(SELECTORS.logoutLink, { timeout: TIMEOUTS.element });
    if (!logoutLink) throw new Error('No se encontró el enlace de cerrar sesión');
    
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'load', timeout: TIMEOUTS.navigation }),
      logoutLink.click(),
    ]);

    // Esperamos un momento para asegurar que el DOM se actualice
    await p.waitForTimeout(1000);

    // Obtenemos los valores necesarios para los checks
    const finalUrl = p.url();
    const dropdownTextAfter = await p.locator(SELECTORS.loginDropdown).textContent();

    // Normalizamos el texto para los checks
    const textoAntes = normalizarTexto(dropdownTextBefore);
    const textoDespues = normalizarTexto(dropdownTextAfter);


    check(p, {
      'Redirigido a home después de logout': () => finalUrl.includes('pcfactory.cl'),
      'Botón indicaba usuario logueado antes': () => textoAntes.includes('hola,'),
      'El botón de usuario ahora indica no logueado': () => textoDespues.includes('hola, ingresa')
    });
  }, data);
}
