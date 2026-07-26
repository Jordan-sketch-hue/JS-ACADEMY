// WhatsApp helpers + floating action button
export const WA_NUMBER = '18764566976'; // (876) 456-6976 — international format, no plus/dashes

export function waLink(message = '') {
  const url = new URL(`https://wa.me/${WA_NUMBER}`);
  if (message) url.searchParams.set('text', message);
  return url.toString();
}

export function waLinkForCar(car) {
  const msg = `Hi Solace Auto Imports — I'm interested in the ${car.year} ${car.make} ${car.model} (ID: ${car.id}). Is it still available?`;
  return waLink(msg);
}

export function initWhatsAppFAB() {
  if (document.querySelector('#wa-fab')) return;
  const a = document.createElement('a');
  a.id = 'wa-fab';
  a.href = waLink("Hi Solace Auto Imports — I have a question about a vehicle.");
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat with us on WhatsApp');
  a.className = 'fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl grid place-items-center hover:scale-110 transition-transform';
  a.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.385.708 4.6 1.92 6.46L4 29l7.74-1.88A11.93 11.93 0 0016 27c6.627 0 12-5.373 12-12s-5.373-12-11.999-12zm0 21.6c-1.89 0-3.66-.55-5.144-1.49l-.37-.23-4.59 1.115 1.13-4.47-.24-.39A9.55 9.55 0 016.4 15c0-5.293 4.31-9.6 9.6-9.6 5.293 0 9.601 4.307 9.601 9.6.001 5.293-4.308 9.6-9.6 9.6zm5.27-7.18c-.288-.144-1.706-.842-1.97-.938-.265-.097-.457-.144-.65.144-.193.289-.745.937-.913 1.13-.169.193-.337.217-.625.072-.288-.144-1.218-.45-2.32-1.434-.857-.764-1.435-1.708-1.603-1.996-.169-.289-.018-.444.126-.587.128-.128.288-.337.433-.505.144-.169.193-.289.289-.482.097-.193.048-.361-.024-.505-.072-.144-.65-1.566-.891-2.146-.234-.563-.473-.486-.65-.495l-.554-.01a1.07 1.07 0 00-.777.361c-.265.289-1.01.987-1.01 2.408 0 1.422 1.035 2.795 1.18 2.988.144.193 2.038 3.114 4.94 4.366.691.299 1.231.477 1.652.61.694.221 1.326.19 1.826.115.557-.083 1.706-.697 1.948-1.371.241-.674.241-1.253.168-1.371-.072-.12-.265-.193-.553-.337z"/>
    </svg>
  `;
  document.body.appendChild(a);
}
