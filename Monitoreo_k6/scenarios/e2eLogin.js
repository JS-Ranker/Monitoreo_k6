import { browser } from 'k6/browser';
import { registerMetricTags } from '../helpers/registerMetricTags.js';
import { TARGET_URL, LOGIN_CREDENTIALS } from '../config/constants.js';
import { journeyDuration, journeySuccess } from '../metrics/metrics.js';

// Import step functions
import { loadHomepage } from '../steps/loadHomepage.js';
import { openLoginDropdown } from '../steps/openLoginDropdown.js';
import { clickLoginLink } from '../steps/clickLoginLink.js';
import { enterCredentials } from '../steps/enterCredentials.js';
import { submitLogin } from '../steps/submitLogin.js';
import { logout } from '../steps/logout.js';

// Función principal que ejecuta el flujo de login/logout
export default async function () {
  const page = await browser.newPage();
  
  // Registra etiquetas de métricas para el monitoreo
  registerMetricTags(page, '', '');

  const executionId = `login-${Date.now()}`;
  console.log(`Iniciando ejecución de monitoreo ${executionId}. URL: ${TARGET_URL}`);

  const journeyStartTime = Date.now();
  let journeySuccessful = false;
  const data = {}; // Objeto para pasar datos entre pasos

  try {
    // Ejecutar paso a paso el flujo de login
    await loadHomepage(page, data, TARGET_URL);
    await openLoginDropdown(page, data);
    await clickLoginLink(page, data);
    await enterCredentials(page, data, LOGIN_CREDENTIALS);
    await submitLogin(page, data);
    await logout(page, data);

    journeySuccessful = true;
  } catch (error) {
    console.error(`Error en la ejecución: ${error.message}`);
  } finally {
    const journeyDurationSeconds = (Date.now() - journeyStartTime) / 1000;
    journeyDuration.add(journeyDurationSeconds);
    journeySuccess.add(journeySuccessful ? 1 : 0);
    console.log(`Duración del flujo: ${journeyDurationSeconds.toFixed(2)}s`);
    await page.close();
  }
}