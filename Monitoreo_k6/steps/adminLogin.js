import { check } from 'k6';
import { measureStep } from '../helpers/measureStep.js';

export async function adminLogin(page, data) {
  await measureStep(page, 'Login admin PCFactory', async (p) => {
    await p.goto('https://ww3.pcfactory.cl/admin/login', { waitUntil: 'load', timeout: 15000 });

    // Esperar y llenar usuario
    await p.waitForSelector('//*[@id="user_session_username"]', { timeout: 10000 });
    await p.fill('//*[@id="user_session_username"]', 'hsanhueza@pcfactory.cl');

    // Esperar y llenar contraseña
    await p.waitForSelector('//*[@id="user_session_password"]', { timeout: 10000 });
    await p.fill('//*[@id="user_session_password"]', 'Xr7!bLp2@qWe');

    // Click en Entrar
    await Promise.all([
      p.waitForNavigation({ waitUntil: 'load', timeout: 15000 }),
      p.click('//*[@id="submit_button"]'),
    ]);

    // Validar que el login fue exitoso (ajusta el selector según la página de destino)
    check(p, {
      'Login exitoso': () => !p.url().includes('/admin/login'),
    });
  }, data);
}