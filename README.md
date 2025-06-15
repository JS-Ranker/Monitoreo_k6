# Monitoreo_k6

Automatización de pruebas end-to-end (E2E) para flujos de compra y login en [PCFactory.cl](https://www.pcfactory.cl/) usando [k6 Browser](https://k6.io/docs/browser/).

## Tabla de Contenidos

- [Monitoreo\_k6](#monitoreo_k6)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Descripción](#descripción)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Requisitos](#requisitos)
  - [Configuración](#configuración)
  - [Ejecución de Pruebas](#ejecución-de-pruebas)
  - [Ejemplo de Ejecución de Scripts en Windows](#ejemplo-de-ejecución-de-scripts-en-windows)
  - [Escenarios Disponibles](#escenarios-disponibles)
  - [Variables de Entorno](#variables-de-entorno)
  - [Métricas](#métricas)
  - [Personalización](#personalización)
  - [Contacto](#contacto)

---

## Descripción

Este proyecto permite monitorear y validar automáticamente los principales flujos de compra y login en PCFactory, tanto para usuarios invitados como registrados, utilizando scripts de automatización con k6 y su módulo browser.

## Estructura del Proyecto

```
Monitoreo_k6/
  README.md
  Monitoreo_k6/
    config/
      constants.js        # Constantes globales y datos de prueba
      selectors.js        # Selectores de elementos de la UI
      timeouts.js         # Configuración de timeouts
    helpers/
      captureErrorScreenshot.js # Captura de pantallas de error (opcional S3)
      measureStep.js            # Medición y logging de pasos
      registerMetricTags.js     # Etiquetado de métricas
      setupPayment.js           # Selección dinámica de métodos de pago
    metrics/
      metrics.js         # Definición de métricas personalizadas
    scenarios/
      e2eLogin.js                # Flujo de login/logout
      e2ePurchaseCategory.js     # Compra desde categoría
      e2ePurchaseDelivery.js     # Compra con despacho a domicilio
      e2ePurchaseGuest.js        # Compra como invitado (retiro en tienda)
      e2ePurchaseListingPage.js  # Compra desde listado de productos
      e2ePurchaseRR.js           # Compra desde RR (Home)
    Scripts/
      scriptLogin.js
      scriptPurchaseCategory.js
      scriptPurchaseDelivery.js
      scriptPurchaseGest.js
      scriptPurchaseListingPage.js
      ...
    steps/
      ... (pasos reutilizables de cada flujo)
```

## Requisitos

- [Node.js](https://nodejs.org/) (para instalar k6 si usas npm)
- [k6](https://k6.io/) >= 0.44.0 con soporte para browser (experimental)
- Acceso a internet y permisos para acceder a los sitios de PCFactory

## Configuración

1. **Clona el repositorio**  
   ```sh
   git clone <https://github.com/JS-Ranker/Monitoreo_k6.git>
   cd Monitoreo_k6
   ```

2. **Instala k6**  
   Descarga desde [k6.io](https://k6.io/docs/getting-started/installation/) o usa Homebrew/choco.

3. **Configura variables de entorno**  
   Puedes definir variables en tu entorno o en un archivo `.env` para personalizar usuarios, credenciales, AWS, etc.  
   Ejemplo:
   ```
   export TARGET_URL="https://www.pcfactory.cl/"
   export SEARCH_TERM="pendrive"
   export LOGIN_RUT="20.040.939-6"
   export LOGIN_PASS="Hect.0331"
   export SCREENSHOT_BUCKET="pcf-s3-cross-monitoreo-images"
   export AWS_REGION="us-east-1"
   export AWS_ACCESS_KEY_ID="..."
   export AWS_SECRET_ACCESS_KEY="..."
   ```

## Ejecución de Pruebas

Cada script en la carpeta `Scripts/` ejecuta un escenario E2E diferente. Ejemplo para compra como invitado:

```sh
k6 run --compatibility-mode=base --out json=output.json Monitoreo_k6/Scripts/scriptPurchaseGest.js
```

Puedes cambiar el script según el flujo que quieras probar:

- `scriptLogin.js` — Login/logout
- `scriptPurchaseGest.js` — Compra como invitado (retiro en tienda)
- `scriptPurchaseDelivery.js` — Compra con despacho a domicilio
- `scriptPurchaseCategory.js` — Compra desde categoría
- `scriptPurchaseListingPage.js` — Compra desde listado de productos
- `scriptPurchaseRR.js` — Compra desde RR (Home)

## Ejemplo de Ejecución de Scripts en Windows

Para ejecutar los scripts de k6 en modo no headless (con navegador visible) en Windows PowerShell, usa el siguiente comando:

```powershell
$env:K6_BROWSER_HEADLESS = "false"; k6 run scriptPurchaseCategory.js
```

Puedes reemplazar `scriptPurchaseCategory.js` por el nombre del script que desees ejecutar.

> **Nota:** Si usas CMD, la sintaxis para definir variables de entorno es diferente:
> ```
> set K6_BROWSER_HEADLESS=false
> k6 run scriptPurchaseCategory.js
> ```

## Escenarios Disponibles

- **Login/logout:** Valida inicio y cierre de sesión.
- **Compra como invitado:** Agrega productos y realiza compra como invitado.
- **Compra con despacho:** Flujo completo con despacho a domicilio.
- **Compra desde categoría/listado/RR:** Variantes del flujo según el origen del producto.

Cada escenario está implementado en la carpeta [`scenarios/`](Monitoreo_k6/scenarios/).

## Variables de Entorno

Las principales variables configurables están en [`config/constants.js`](Monitoreo_k6/config/constants.js):

- `TARGET_URL`: URL base de la tienda
- `SEARCH_TERM`: Término de búsqueda de productos
- `GUEST_DATA`: Datos del usuario invitado
- `LOGIN_CREDENTIALS`: Credenciales de usuario registrado
- `SCREENSHOT_BUCKET`, `AWS_REGION`, etc.: Configuración para screenshots en AWS S3
- `paymentMethods`: Métodos de pago disponibles

## Métricas

Las métricas personalizadas se definen en [`metrics/metrics.js`](Monitoreo_k6/metrics/metrics.js):

- `pcfactory_step_duration_seconds`
- `pcfactory_journey_duration_seconds`
- `pcfactory_step_success`
- `pcfactory_journey_success`
- `pcfactory_search_results`

Además, se etiquetan recursos y endpoints relevantes para análisis detallado (ver [`helpers/registerMetricTags.js`](Monitoreo_k6/helpers/registerMetricTags.js)).

## Personalización

- **Agregar nuevos pasos:** Crea un archivo en [`steps/`](Monitoreo_k6/steps/) y agrégalo al escenario correspondiente.
- **Modificar selectores:** Edita [`config/selectors.js`](Monitoreo_k6/config/selectors.js).
- **Cambiar timeouts:** Edita [`config/timeouts.js`](Monitoreo_k6/config/timeouts.js).
- **Agregar métodos de pago:** Modifica el array `paymentMethods` en [`config/constants.js`](Monitoreo_k6/config/constants.js).

## Contacto

Para dudas o mejoras, contacta a:  
**Héctor Sanhueza**  
Correo: hsanhueza.dev@gmail.com

---

> Proyecto para monitoreo y QA automatizado de PCFactory.cl usando k6 + browser.
