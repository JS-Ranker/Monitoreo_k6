// Constantes globales para el monitoreo
export const TARGET_URL = __ENV.TARGET_URL || 'https://www.pcfactory.cl/';
export const SEARCH_TERM = __ENV.SEARCH_TERM || 'bolsa';
export const GUEST_DATA = {
  name: __ENV.GUEST_NAME || 'Monitor Test',
  email: __ENV.GUEST_EMAIL || `test@test.cl`,
  phone: __ENV.GUEST_PHONE || '98765432',
  rut: __ENV.GUEST_RUT || '11111111-1',
};



// Configuración de AWS para screenshots
export const SCREENSHOT_BUCKET = __ENV.SCREENSHOT_BUCKET || 'pcf-s3-cross-monitoreo-images';
export const AWS_REGION = __ENV.AWS_REGION || 'us-east-1';
export const AWS_ACCESS_KEY_ID = __ENV.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = __ENV.AWS_SECRET_ACCESS_KEY || '';

export const paymentMethods = [
  ['banco_estado', 'BCA', 'Banco Estado', 'pagos.compraqui.cl'],
  ['transbank_webpay', 'WP', 'Tarjeta de Credito', 'webpay3g.transbank.cl'],
  ['transbank_webpay', 'CS', 'Tarjeta de Debito', 'webpay3g.transbank.cl'],
  ['hites', 'HITES', 'Hites', 'hitespay.tarjetahites.com'],
  ['etpay', 'ETP', 'Transferencia ETPay', 'pmt-pcfactory.etpayment.com']
];