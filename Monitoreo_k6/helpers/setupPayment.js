import { paymentMethods } from '../config/constants.js';

/**
 * Selecciona un método de pago basado en el minuto actual.
 * @returns {Object} Un objeto con los datos del método de pago seleccionado.
 */
export function selectPaymentMethod() {
  // Obtener el minuto actual para seleccionar un método de pago dinámicamente
  const minute = new Date().getMinutes();
  const paymentMethodIndex = minute % paymentMethods.length;

  // Extraer los datos del método de pago seleccionado
  const [paymentGatewayGroup, paymentMethodId, paymentMethodName, paymentGatewayUrl] = paymentMethods[paymentMethodIndex];

  console.log(`Método de pago seleccionado: ${paymentMethodName}`);
  
  // Retornar los datos del método de pago
  return {
    paymentMethodId,
    paymentMethodName,
    paymentGatewayUrl,
    paymentGatewayGroup,
  };
}