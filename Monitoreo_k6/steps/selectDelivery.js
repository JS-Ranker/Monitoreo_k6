import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';

export async function selectDelivery(page, data) {
  await measureStep(page, 'Seleccionar despacho a domicilio', async (p) => {
    // Esperar a que la página se cargue completamente
    await p.waitForLoadState('networkidle', { timeout: TIMEOUTS.networkIdle });
    
    // Estrategia 1: Intentar con el selector original
    console.log('Intentando seleccionar despacho con selector principal #dispatch');
    let radioFound = false;
    
    try {
      const radioButton = p.locator(SELECTORS.deliveryRadio);
      await radioButton.waitFor({ state: 'visible', timeout: 5000 });
      await radioButton.click();
      radioFound = true;
      console.log('Radio button encontrado y clickeado con selector #dispatch');
    } catch (error) {
      console.log(`No se pudo seleccionar con el selector original: ${error.message}`);
    }
    
    // Estrategia 2: Intentar con XPath más específico si el primer intento falló
    if (!radioFound) {
      console.log('Intentando con XPath alternativo');
      try {
        // XPath que busca cualquier input de tipo radio con valor o texto que contenga "despacho" o "domicilio"
        const xpathSelector = '//input[@type="radio"][contains(@value, "Despacho") or contains(@value, "domicilio")] | //label[contains(text(), "Despacho") or contains(text(), "domicilio")]/input[@type="radio"]';
        await p.waitForSelector(xpathSelector, { timeout: 5000 });
        await p.locator(xpathSelector).click();
        radioFound = true;
        console.log('Radio button encontrado y clickeado con XPath alternativo');
      } catch (error) {
        console.log(`No se pudo seleccionar con XPath alternativo: ${error.message}`);
      }
    }
    
    // Estrategia 3: Intentar con CSS selector más general
    if (!radioFound) {
      console.log('Intentando con CSS selector general');
      try {
        // CSS selector general para inputs de radio
        const cssSelector = 'input[type="radio"][name="method"]';
        await p.waitForSelector(cssSelector, { timeout: 5000 });
        
        // Obtener todos los radio buttons y ver cuál corresponde a despacho
        const radioButtons = await p.$$(cssSelector);
        console.log(`Encontrados ${radioButtons.length} botones de radio`);
        
        for (let i = 0; i < radioButtons.length; i++) {
          const value = await radioButtons[i].getAttribute('value');
          console.log(`Radio button ${i}: valor = "${value}"`);
          
          if (value && (value.includes('Despacho') || value.includes('domicilio') || value.includes('Delivery'))) {
            await radioButtons[i].click();
            radioFound = true;
            console.log(`Seleccionado radio button ${i} con valor "${value}"`);
            break;
          }
        }
      } catch (error) {
        console.log(`No se pudo seleccionar con CSS selector general: ${error.message}`);
      }
    }
    
    // Estrategia 4: Buscar cualquier elemento clickeable relacionado con despacho
    if (!radioFound) {
      console.log('Intentando con elementos clickeables que contengan texto de despacho');
      try {
        const deliveryTextSelector = '//*[contains(text(), "Despacho") or contains(text(), "despacho") or contains(text(), "Domicilio") or contains(text(), "domicilio")]';
        const elements = await p.$$(deliveryTextSelector);
        
        if (elements.length > 0) {
          console.log(`Encontrados ${elements.length} elementos con texto de despacho`);
          await elements[0].click();
          radioFound = true;
          console.log('Clickeado en elemento con texto de despacho');
        }
      } catch (error) {
        console.log(`No se pudo encontrar elementos con texto de despacho: ${error.message}`);
      }
    }
    
    // Verificar si se pudo seleccionar el radio button
    if (!radioFound) {
      // Tomar un screenshot para diagnóstico
      console.log('No se pudo encontrar el radio button de despacho por ningún método');
      console.log('Contenido HTML del área de selección de método de entrega:');
      const html = await p.$eval('body', el => el.innerHTML);
      console.log(html.substring(0, 500) + '...');
      throw new Error('No se pudo seleccionar el radio button de despacho a domicilio');
    }
    
    // Esperar a que la interfaz se actualice para mostrar el formulario de dirección
    console.log('Esperando a que aparezca el formulario de dirección');
    await p.waitForTimeout(2000); // Espera para asegurar que el DOM se actualice
    
    let formVisible = false;
    
    try {
      await p.locator(SELECTORS.addressRegionSelect).waitFor({ state: 'visible', timeout: 5000 });
      formVisible = true;
    } catch (error) {
      console.log(`No se pudo encontrar el selector de región: ${error.message}`);
    }
    
    // Si no se encuentra el selector de región, buscar cualquier elemento del formulario
    if (!formVisible) {
      const addressFormSelectors = [
        'select[id*="region"]', 
        'select[name*="region"]',
        'input[id*="calle"]', 
        'input[name*="calle"]',
        'input[id*="street"]', 
        'input[name*="street"]'
      ];
      
      for (const selector of addressFormSelectors) {
        try {
          await p.waitForSelector(selector, { timeout: 2000 });
          formVisible = true;
          console.log(`Encontrado elemento del formulario con selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`No se encontró elemento con selector: ${selector}`);
        }
      }
    }
    
    // Verificar si el formulario está visible
    check(p, {
      'Se ha seleccionado correctamente la opción de despacho': () => radioFound,
      'El formulario de dirección está visible': () => formVisible
    });
    
    if (!formVisible) {
      throw new Error('No se pudo encontrar el formulario de dirección después de seleccionar despacho a domicilio');
    }
  }, data);
}