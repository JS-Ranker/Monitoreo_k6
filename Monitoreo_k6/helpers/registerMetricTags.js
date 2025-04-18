// helpers/registerMetricTags.js

export function registerMetricTags(page, paymentGatewayUrl, paymentGatewayGroup) {
    page.on('metric', (metric) => {
      metric.tag({
        name: 'external:resources',
        matches: [{ url: /^(?!https:\/\/([a-zA-Z0-9-]+\.)*pcfactory\.cl(\/|$)).*$/ }]
      });
      metric.tag({ name: 'page:homepage', matches: [{ url: /^https:\/\/www\.pcfactory\.cl\/(index\.html)?(\?.*)?$/ }] });
      metric.tag({ name: 'page:product-detail', matches: [{ url: /^https:\/\/www\.pcfactory\.cl\/producto\/[0-9]+-.*(\?.*)?$/ }] });
      metric.tag({ name: 'page:search-results', matches: [{ url: /^https:\/\/www\.pcfactory\.cl\/(busqueda|busqueda-avanzada).*(\?.*)?$/ }] });
      metric.tag({ name: 'page:cart', matches: [{ url: /^https:\/\/www\.pcfactory\.cl\/carro(\?.*)?$/ }] });
      metric.tag({ name: 'page:checkout', matches: [{ url: /^https:\/\/www\.pcfactory\.cl\/checkout.*(\?.*)?$/ }] });
      metric.tag({ name: 'api:other', matches: [
        { url: /^https:\/\/api\.pcfactory\.cl\/.*\/v1\/.*(\?.*)?$/ },
        { url: /^https:\/\/ww3\.pcfactory\.cl\/api\/content\/.*(\?.*)?$/ }
      ] });
      metric.tag({ name: 'api:catalog', matches: [
        { url: /^https:\/\/api\.pcfactory\.cl\/.*catalogo.*\/v1\/.*(\?.*)?$/ },
        { url: /^https:\/\/api\.pcfactory\.cl\/.*catalog.*\/v1\/.*(\?.*)?$/ }
      ] });
      metric.tag({ name: 'api:cart', matches: [
        { url: /^https:\/\/api\.pcfactory\.cl\/.*carro-compra.*\/v1\/.*(\?.*)?$/ },
        { url: /^https:\/\/api\.pcfactory\.cl\/.*shopping-cart.*\/v1\/.*(\?.*)?$/ }
      ] });
      metric.tag({ name: 'api:user-profile', matches: [
        { url: /^https:\/\/api\.pcfactory\.cl\/.*perfil.*\/v1\/.*(\?.*)?$/ },
        { url: /^https:\/\/.*pcfactory\.cl\/api\/customers.*(\?.*)?$/ }
      ] });
      metric.tag({ name: 'api:integration', matches: [{ url: /^https:\/\/integracion\.pcfactory\.cl\/.*(\?.*)?$/ }] });
      metric.tag({ name: 'payment:internal_redirect', matches: [{ url: /^https:\/\/pagar\.pcfactory\.cl\/.*(\?.*)?$/ }] });
      metric.tag({
        name: `payment:gateway:${paymentGatewayGroup}`,
        matches: [
          { url: new RegExp(`^https:\\/\\/.*${paymentGatewayUrl.replace('.', '\\.')}\\/.*(?:\\?.*)?$`) }
        ]
      });
      metric.tag({ name: 'asset:product-images', matches: [{ url: /^https:\/\/assets\.pcfactory\.cl\/public\/foto\/[0-9]+\/.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i }] });
      metric.tag({ name: 'asset:category-icons', matches: [{ url: /^https:\/\/assets\.pcfactory\.cl\/public\/foto\/(familia|categoria)\/.*\.(svg|png)(\?.*)?$/i }] });
      metric.tag({ name: 'asset:payment-icons', matches: [{ url: /^https:\/\/assets\.pcfactory\.cl\/public\/foto\/medio_pago\/.*\.(svg|png)(\?.*)?$/i }] });
      metric.tag({ name: 'asset:scripts', matches: [{ url: /^https:\/\/.*pcfactory\.cl\/.*\.(js)(\?.*)?$/i }] });
      metric.tag({ name: 'asset:styles', matches: [{ url: /^https:\/\/.*pcfactory\.cl\/.*\.(css)(\?.*)?$/i }] });
      metric.tag({ name: 'widget:manager', matches: [{ url: /^https:\/\/.*pcfactory\.cl\/widget_manager\/.*(\?.*)?$/ }] });
      metric.tag({ name: 'telemetry:analytics', matches: [{ url: /^https:\/\/.*pcfactory\.cl\/cdn-cgi\/.*(\?.*)?$/ }] });
    });
  }
  