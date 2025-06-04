export const SELECTORS = {
  // Selectores existentes
  searchInput: '#search-input-desktop',
  searchButton: '#search-btn-desktop',
  productListSection: 'section[data-section-name="Lista productos"]',
  productLink: 'section[data-section-name="Lista productos"] div.col-6',
  sortDropdown: '#dropdown-order',
  sortPriceAsc: '//span[text()=" Precio menor a mayor "]',
  productAddToCartBtn: '.pcf-btn.pcf-btn--five.d-none.d-lg-block.mt-1.border.border-0',
  modalGoToCartBtn: '.pcf-btn.pcf-btn--five.border-0',
  cartContinueBtn: '.pcf-btn.pcf-btn--five.w-100.text-center.border-0',
  guestContinueBtn: '//*[@id="pcf-checkout-view"]/div[1]/div[1]/div[2]/div/div[2]/div/button',
  pickupRadio: '//*[@id="pcf-checkout-view"]/div[1]/div[1]/div[2]/section[1]/div',
  storeModal: '#select-store-modal',
  firstAvailableStoreRadio: 'input[type="radio"][name="store"]:not(.zone__store--disabled input)',
  selectStoreBtn: '//button[text()=" Seleccionar tienda "]',
  checkoutContinueBtn: '//*[@id="pcf-checkout-view"]/div[1]/div[2]/div/aside/div[3]/button',
  receiptNameInput: 'input[id="receipt-name"][type="text"]',
  receiptEmailInput: 'input[id="receipt-email"][type="text"]',
  receiptEmailConfirmInput: 'input[id="receipt-email-confirmation"][type="text"]',
  receiptPhoneInput: 'input[id="receipt-phone-number"][type="text"]',
  receiptRutInput: 'input[id="receipt-rut"][type="text"]',
  paymentMethodSection: 'ul.p-0.m-0',


  
  paymentMethodRadio: (methodId) => `input[type="radio"][name="payment"][id="${methodId}"]`,
  payButton: '//div[contains(@class, "divider-top")]//button[./span[normalize-space()="Pagar"]]',

  //  selectores para el flujo de login
  loginDropdown: '#login-dropdown',
  loginMenuLink: 'a.dropdown-item[href*="login"]',
  usernameInput: '#username',
  passwordInput: '#password',
  loginButton: '#kc-login',
  logoutLink: 'a.dropdown-item[href*="logout"]',

  // Selectores para despacho a domicilio
  deliveryRadio: '//*[@id="pcf-checkout-view"]/div[1]/div[1]/div[2]/section[2]/div',
  communeInput: '#commune-input',
  communeDropdownItem: '.dropdown-item',
  streetInput: '#street-input',
  numberInput: '#number-input',
  deptInput: '#apartment-input',
  continueAddressBtn: '//div[@id="delivery-button"]//button[contains(text(), "Continuar")]', 

  
  productImage: 'img[data-gtag-title*="Pendrive"]',
  agregarCarritoButton: '#agregar-carrito',

  // Selectores de Selección por Categoría
  categoriesButton: '//*[@id="categories-btn"]',
  categoryItems: Array.from({ length: 16 }, (_, i) => `//*[@id="category${i}"]`)
};
