import { browser } from 'k6/browser';
import { registerMetricTags } from '../helpers/registerMetricTags.js';
import { TARGET_URL, SEARCH_TERM, GUEST_DATA } from '../config/constants.js';
import { journeyDuration, journeySuccess } from '../metrics/metrics.js';
 
// Importar directamente los archivos de pasos en lugar de las funciones
import * as adminLoginModule from '../steps/adminLogin.js';
import * as searchProductModule from '../steps/searchProduct.js';
import * as sortResultsModule from '../steps/sortResults.js';
import * as selectProductModule from '../steps/selectProductListing.js';
import * as continueAsGuestModule from '../steps/continueAsGuest.js';
import * as selectPickupModule from '../steps/selectPickup.js';
import * as goToPersonalInfoModule from '../steps/goToPersonalInfo.js';
import * as fillPersonalInfoModule from '../steps/fillPersonalInfo.js';
import * as selectPaymentMethodModule from '../steps/selectPaymentMethod.js';
import * as goToPaymentGatewayModule from '../steps/goToPaymentGateway.js';

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
     await adminLoginModule.adminLogin(page, data);
    await searchProductModule.searchProduct(page, data, SEARCH_TERM);
    await sortResultsModule.sortResults(page, data);
    await selectProductModule.selectProductListing(page, data);
    await continueAsGuestModule.continueAsGuest(page, data);
    await selectPickupModule.selectPickup(page, data);
    await goToPersonalInfoModule.goToPersonalInfo(page, data);
    await fillPersonalInfoModule.fillPersonalInfo(page, data, GUEST_DATA);
    await selectPaymentMethodModule.selectPaymentMethod(page, data, paymentMethodId, paymentMethodName);
    await goToPaymentGatewayModule.goToPaymentGateway(page, data, paymentGatewayUrl);


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