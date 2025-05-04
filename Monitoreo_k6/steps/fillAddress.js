import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function fillAddress(page, data, GUEST_DATA) {
  await measureStep(page, 'Rellenar dirección de despacho', async (p) => {
    // Seleccionar región (primera opción disponible)
    await p.locator(SELECTORS.addressRegionSelect).click();
    const regionOptions = await p.$$(`${SELECTORS.addressRegionSelect} option:not([value=""])`);
    if (regionOptions.length > 0) {
      // Seleccionar la región Metropolitana (RM) si está disponible
      let regionSelected = false;
      for (let i = 0; i < regionOptions.length; i++) {
        const optionText = await regionOptions[i].textContent();
        if (optionText.includes('Metropolitana')) {
          const optionValue = await regionOptions[i].getAttribute('value');
          await p.locator(SELECTORS.addressRegionSelect).selectOption(optionValue);
          regionSelected = true;
          console.log('Región Metropolitana seleccionada');
          break;
        }
      }
      
      // Si no encontramos RM, seleccionar la primera opción disponible
      if (!regionSelected) {
        const firstOptionValue = await regionOptions[0].getAttribute('value');
        await p.locator(SELECTORS.addressRegionSelect).selectOption(firstOptionValue);
        console.log('Primera región disponible seleccionada');
      }
    } else {
      throw new Error('No hay opciones de región disponibles');
    }
    
    // Esperar a que carguen las comunas
    await p.waitForTimeout(2000);
    
    // Seleccionar comuna (primera opción disponible)
    await p.locator(SELECTORS.addressCommuneSelect).click();
    const communeOptions = await p.$$(`${SELECTORS.addressCommuneSelect} option:not([value=""])`);
    if (communeOptions.length > 0) {
      const firstOptionValue = await communeOptions[0].getAttribute('value');
      await p.locator(SELECTORS.addressCommuneSelect).selectOption(firstOptionValue);
      console.log('Comuna seleccionada');
    } else {
      throw new Error('No hay opciones de comuna disponibles');
    }
    
    // Rellenar campos de dirección
    await p.locator(SELECTORS.addressStreetInput).fill('Av. Providencia');
    await p.locator(SELECTORS.addressNumberInput).fill('1234');
    await p.locator(SELECTORS.addressComplementInput).fill('Depto 101');
    
    // Guardar la dirección
    await p.locator(SELECTORS.addressSaveButton).click();
    
    // Esperar a que se procese el guardado de la dirección
    await p.waitForTimeout(2000);
    
    // Confirmar la dirección si es necesario
    const confirmButton = await p.$(SELECTORS.confirmAddressButton);
    if (confirmButton) {
      await confirmButton.click();
      await p.waitForTimeout(1000);
    }
    
    // Verificar que podemos continuar al siguiente paso
    await check(p, {
      'El botón de continuar debe estar disponible después de guardar la dirección': () => p.locator(SELECTORS.checkoutContinueBtn).isVisible(),
    });
  }, data);
}