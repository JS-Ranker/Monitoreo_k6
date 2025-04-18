import { S3Client } from 'https://jslib.k6.io/aws/0.13.0/aws.js';

export async function captureErrorScreenshot(page, stepName, data) {
  try {
    if (!data.useS3 || !data.awsConfig) {
      console.log("Cliente AWS no disponible. No se guardará el screenshot.");
      return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${exec.scenario.name}/${timestamp}_${stepName}.png`;

    console.log(`Capturando screenshot de error en paso ${stepName}`);
    const screenshotBuffer = await page.screenshot({ fullPage: true });

    const s3Client = new S3Client(data.awsConfig);

    try {
      await s3Client.putObject(
        SCREENSHOT_BUCKET,
        filename,
        screenshotBuffer,
        { contentType: 'image/png' }
      );

      const viewUrl = `https://${SCREENSHOT_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${filename}`;
      console.log(`Screenshot subido para paso ${stepName}.`);
      return viewUrl;
    } catch (uploadError) {
      console.error(`Error en la carga a S3: ${uploadError}`);
      return null;
    }
  } catch (screenshotError) {
    console.error(`Error al capturar screenshot para paso ${stepName}: ${screenshotError}`);
    return null;
  }
}