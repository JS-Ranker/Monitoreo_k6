import { measureStep } from '../helpers/measureStep.js';
import { SELECTORS } from '../config/selectors.js';
import { TIMEOUTS } from '../config/timeouts.js';

export async function selectRandomCategory(page, data) {
  await measureStep(page, 'Seleccionar categoría aleatoria', async (p) => {
    // Haz clic en el botón de categorías 
    const categoriesButton = p.locator(SELECTORS.categoriesButton);
    await categoriesButton.click();

    // Espera que se muestre el menú (se asume que al menos category0 estará visible)
    await p.waitForSelector('#category0', { timeout: TIMEOUTS.categoryMenu });

    // Selecciona un número aleatorio entre 0 y 15
    const randomIndex = Math.floor(Math.random() * 16);
    const categoryXPath = SELECTORS.categoryItems[Math.floor(Math.random() * 16)];
    const categoryElement = p.locator(`xpath=${categoryXPath}`);

    // Obtener texto para registrar qué categoría se seleccionó
    const categoryText = await categoryElement.textContent();
    console.log(`Seleccionando categoría aleatoria: ${categoryText?.trim()}`);

    // Hacer clic en la categoría aleatoria
    await categoryElement.click();

    // Validar navegación: esperar a que cargue la sección de productos
    await p.waitForSelector('section[data-section-name="Lista productos"]', { timeout: TIMEOUTS.categoryLoad });
  }, data);
}
