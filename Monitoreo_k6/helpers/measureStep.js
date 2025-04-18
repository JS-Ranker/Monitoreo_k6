import { stepDuration, stepSuccess } from '../metrics/metrics.js';
import { captureErrorScreenshot } from './captureErrorScreenshot.js';

export async function measureStep(page, stepName, stepFn, data, extraTags = {}) {
  console.log(`Iniciando paso: ${stepName}`);
  const startTime = Date.now();

  try {
    await stepFn(page);
    const duration = (Date.now() - startTime) / 1000;
    stepDuration.add(duration, { step: stepName, ...extraTags });
    stepSuccess.add(1, { step: stepName, ...extraTags });
    console.log(`Paso completado: ${stepName} (${duration.toFixed(2)}s)`);
    return duration;
  } catch (error) {
    stepSuccess.add(0, { step: stepName, ...extraTags });
    await captureErrorScreenshot(page, stepName, data);
    console.error(`Error en el paso ${stepName}: ${error}`);
    throw error;
  }
}