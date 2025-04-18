import { browser } from 'k6/browser';
import { registerMetricTags } from '../helpers/registerMetricTags.js';
import { TARGET_URL, SEARCH_TERM, GUEST_DATA } from '../config/constants.js';

// Import step functions
import { loadHomepage } from '../steps/loadHomepage.js';
import { searchProduct } from '../steps/searchProduct.js';
import { sortResults } from '../steps/sortResults.js';
import { selectProduct } from '../steps/selectProduct.js';
import { addToCart } from '../steps/addToCart.js';
import { goToCheckout } from '../steps/goToCheckout.js';
import { continueAsGuest } from '../steps/continueAsGuest.js';
import { selectPickup } from '../steps/selectPickup.js';
import { goToPersonalInfo } from '../steps/goToPersonalInfo.js';
import { fillPersonalInfo } from '../steps/fillPersonalInfo.js';
import { selectPaymentMethod } from '../steps/selectPaymentMethod.js';
import { goToPaymentGateway } from '../steps/goToPaymentGateway.js';

// Función principal que ejecuta el flujo de compra end-to-end
export default async function (data) {
  const page = await browser.newPage();
  const paymentMethodId = data.paymentMethodId;
  const paymentMethodName = data.paymentMethodName;
  const paymentGatewayUrl = data.paymentGatewayUrl;

  // Registra etiquetas de métricas para el monitoreo
  registerMetricTags(page, paymentGatewayUrl, data.paymentGatewayGroup);

  console.log(`Método de pago: ${paymentMethodName}`);

  const executionId = `e2e-${Date.now()}`;
  console.log(`Iniciando ejecución de monitoreo ${executionId}. URL: ${TARGET_URL}, Término búsqueda: ${SEARCH_TERM}`);

  const journeyStartTime = Date.now();
  let journeySuccessful = false;

  try {
    // Ejecutar paso a paso el flujo de compra
    await loadHomepage(page, data, TARGET_URL);
    await searchProduct(page, data, SEARCH_TERM);
    await sortResults(page, data);
    await selectProduct(page, data);
    await addToCart(page, data);
    await goToCheckout(page, data);
    await continueAsGuest(page, data);
    await selectPickup(page, data);
    await goToPersonalInfo(page, data);
    await fillPersonalInfo(page, data, GUEST_DATA);
    await selectPaymentMethod(page, data, paymentMethodId, paymentMethodName);
    await goToPaymentGateway(page, data, paymentGatewayUrl);

    journeySuccessful = true;
  } catch (error) {
    console.error(`Error en la ejecución: ${error.message}`);
  } finally {
    const journeyDurationSeconds = (Date.now() - journeyStartTime) / 1000;
    console.log(`Duración del flujo: ${journeyDurationSeconds.toFixed(2)}s`);
    await page.close();
  }
}