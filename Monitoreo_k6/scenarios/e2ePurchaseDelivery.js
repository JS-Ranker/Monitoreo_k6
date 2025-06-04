import { browser } from 'k6/browser';
import { registerMetricTags } from '../helpers/registerMetricTags.js';
import { TARGET_URL, SEARCH_TERM, GUEST_DATA } from '../config/constants.js';
import { journeyDuration, journeySuccess } from '../metrics/metrics.js';

// Importar los pasos del flujo
import * as adminLoginModule from '../steps/adminLogin.js';
import * as searchProductModule from '../steps/searchProduct.js';
import * as sortResultsModule from '../steps/sortResults.js';
import * as selectProductModule from '../steps/selectProduct.js';
import * as addToCartModule from '../steps/addToCart.js';
import * as goToCheckoutModule from '../steps/goToCheckout.js';
import * as continueAsGuestModule from '../steps/continueAsGuest.js';
// Importamos nuestro nuevo paso para seleccionar despacho a domicilio
import * as selectDeliveryModule from '../steps/selectDelivery.js';
import * as fillAddressModule from '../steps/fillAddress.js';
import * as goToPersonalInfoModule from '../steps/goToPersonalInfo.js';
import * as fillPersonalInfoModule from '../steps/fillPersonalInfo.js';
import * as selectPaymentMethodModule from '../steps/selectPaymentMethod.js';
import * as goToPaymentGatewayModule from '../steps/goToPaymentGateway.js';

// Función principal que ejecuta el flujo de compra end-to-end con despacho a domicilio
export default async function (data) {
  const page = await browser.newPage();
  const paymentMethodId = data.paymentMethodId;
  const paymentMethodName = data.paymentMethodName;
  const paymentGatewayUrl = data.paymentGatewayUrl;

  // Registra etiquetas de métricas para el monitoreo
  registerMetricTags(page, paymentGatewayUrl, data.paymentGatewayGroup);

  console.log(`Método de pago: ${paymentMethodName}`);

  const executionId = `e2e-delivery-${Date.now()}`;
  console.log(`Iniciando ejecución de monitoreo con despacho ${executionId}. URL: ${TARGET_URL}, Término búsqueda: ${SEARCH_TERM}`);

  const journeyStartTime = Date.now();
  let journeySuccessful = false;

  try {
    // Ejecutar paso a paso el flujo de compra con despacho
    await adminLoginModule.adminLogin(page, data);
    await searchProductModule.searchProduct(page, data, SEARCH_TERM);
    await sortResultsModule.sortResults(page, data);
    await selectProductModule.selectProduct(page, data);
    await addToCartModule.addToCart(page, data);
    await goToCheckoutModule.goToCheckout(page, data);
    await continueAsGuestModule.continueAsGuest(page, data);
    // Aquí cambiamos al flujo de despacho a domicilio
    await selectDeliveryModule.selectDelivery(page, data);
    await fillAddressModule.fillAddress(page, data, GUEST_DATA);
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