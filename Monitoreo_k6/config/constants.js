// Constantes globales para el monitoreo
export const TARGET_URL = __ENV.TARGET_URL || 'https://www.pcfactory.cl/';
export const SEARCH_TERM = __ENV.SEARCH_TERM || 'pendrive';

export const GUEST_DATA = {
  name: __ENV.GUEST_NAME || 'Monitor Test',
  email: __ENV.GUEST_EMAIL || 'test@test.cl',
  phone: __ENV.GUEST_PHONE || '98765432',
  rut: __ENV.GUEST_RUT || '11111111-1',

  // Dirección para el flujo de despacho a domicilio
  address: {
    street_Complete: __ENV.GUEST_ADDRESS || 'Manuel Montt 170',
    street: __ENV.GUEST_STREET || 'Manuel Montt',
    number: __ENV.GUEST_NUMBER || '170',
    city: __ENV.GUEST_CITY || 'SANTIAGO',
    commune: __ENV.GUEST_COMMUNE || 'PROVIDENCIA',
  },
};

// Credenciales de login 
export const LOGIN_CREDENTIALS = {
  rut: __ENV.LOGIN_RUT || '20.040.939-6',
  password: __ENV.LOGIN_PASS || 'Hect.0331',
};

// Configuración de AWS para screenshots
export const SCREENSHOT_BUCKET = __ENV.SCREENSHOT_BUCKET || 'pcf-s3-cross-monitoreo-images';
export const AWS_REGION = __ENV.AWS_REGION || 'us-east-1';
export const AWS_ACCESS_KEY_ID = __ENV.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = __ENV.AWS_SECRET_ACCESS_KEY || '';

// Métodos de pago disponibles
export const paymentMethods = [
  ['banco_estado', 'BCA', 'Banco Estado', 'pagos.compraqui.cl'],
  ['transbank_webpay', 'WP', 'Tarjeta de Credito', 'webpay3g.transbank.cl'],
  ['transbank_webpay', 'CS', 'Tarjeta de Debito', 'webpay3g.transbank.cl'],
  ['hites', 'HITES', 'Hites', 'hitespay.tarjetahites.com'],
  ['etpay', 'ETP', 'Transferencia ETPay', 'pmt-pcfactory.etpayment.com']
];
