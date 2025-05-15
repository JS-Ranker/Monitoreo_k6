import { check } from 'k6';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';
import { measureStep } from '../helpers/measureStep.js';
import { sleep } from 'k6';

export async function selectRR(page, data) {
  console.log('Buscando el primer botón de "Agregar al carrito"...');

  // Esperar a que los botones de "Agregar al carrito" estén disponibles
  await page.waitForSelector('.rr-item__action'); // Selector basado en la clase del botón

  // Obtener todos los botones que coincidan con el selector
  const buttons = await page.$$('.rr-item__action'); // Selecciona todos los botones con la clase "rr-item__action"

  if (buttons.length === 0) {
    throw new Error('No se encontraron botones de "Agregar al carrito".');
  }

  // Hacer clic en el primer botón disponible
  await buttons[0].click();
  console.log('Se hizo clic en el primer botón de "Agregar al carrito".');

  // Esperar un poco para simular el comportamiento del usuario
  sleep(1);

  // Esperar a que el modal aparezca
  console.log('Esperando a que aparezca el modal...');
  await page.waitForSelector(SELECTORS.modalGoToCartBtn);

  // Hacer clic en el botón "Ir al carro" dentro del modal
  console.log('Haciendo clic en el botón "Ir al carro"...');
  await page.click(SELECTORS.modalGoToCartBtn);

  // Esperar un poco para simular el comportamiento del usuario
  sleep(1);

  // Esperar a que el botón "Continuar" en el carrito esté disponible
  console.log('Esperando a que el botón "Continuar" en el carrito esté disponible...');
  await page.waitForSelector(SELECTORS.cartContinueBtn);

  // Hacer clic en el botón "Continuar" en el carrito
  console.log('Haciendo clic en el botón "Continuar" en el carrito...');
  await page.click(SELECTORS.cartContinueBtn);

}