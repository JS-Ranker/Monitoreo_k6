import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function fillPersonalInfo(page, data, GUEST_DATA) {
  await measureStep(page, 'Rellenar Información Personal', async (p) => {
    await p.fill(SELECTORS.receiptNameInput, GUEST_DATA.name);
    await p.fill(SELECTORS.receiptEmailInput, GUEST_DATA.email);
    await p.fill(SELECTORS.receiptEmailConfirmInput, GUEST_DATA.email);
    await p.fill(SELECTORS.receiptPhoneInput, GUEST_DATA.phone);
    await p.fill(SELECTORS.receiptRutInput, GUEST_DATA.rut);
    await p.locator(SELECTORS.paymentMethodSection).waitFor({ timeout: TIMEOUTS.element });
  }, data);
}