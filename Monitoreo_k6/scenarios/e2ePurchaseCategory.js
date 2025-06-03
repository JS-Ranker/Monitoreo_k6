import { browser } from 'k6/browser';
import { registerMetricTags } from '../helpers/registerMetricTags.js';
import { journeyDuration, journeySuccess } from '../metrics/metrics.js';
//import * as loadHomepageModule from '../steps/loadHomepage.js';

import * as adminLoginModule from '../steps/adminLogin.js';

import * as selectRandomCategoryModule from '../steps/selectRandomCategory.js';
import * as selectProductModule from '../steps/selectProductListing.js';
import * as continueAsGuestModule from '../steps/continueAsGuest.js';
import * as selectPickupModule from '../steps/selectPickup.js';
import * as goToPersonalInfoModule from '../steps/goToPersonalInfo.js';
import * as fillPersonalInfoModule from '../steps/fillPersonalInfo.js';
import * as selectPaymentMethodModule from '../steps/selectPaymentMethod.js';
import * as goToPaymentGatewayModule from '../steps/goToPaymentGateway.js';
import { TARGET_URL, GUEST_DATA } from '../config/constants.js';

export default async function (data) {
  const page = await browser.newPage();
  const paymentMethodId = data.paymentMethodId;
  const paymentMethodName = data.paymentMethodName;
  const paymentGatewayUrl = data.paymentGatewayUrl;

  registerMetricTags(page, paymentGatewayUrl, data.paymentGatewayGroup);

  const journeyStartTime = Date.now();
  let journeySuccessful = false;

  try {
    //await loadHomepageModule.loadHomepage(page, data, TARGET_URL);
    await adminLoginModule.adminLogin(page, data);
    await selectRandomCategoryModule.selectRandomCategory(page, data);
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
    await page.close();
  }
}