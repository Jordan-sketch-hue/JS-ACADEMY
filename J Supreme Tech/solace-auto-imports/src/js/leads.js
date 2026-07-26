export function initLeadForms() {
  initContactForm();
}

function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const payload = {
      name: data.get('name'),
      phone: data.get('phone') || 'Not provided',
      email: data.get('email'),
      interest: data.get('interest'),
      message: data.get('message'),
      source: 'contact_form',
      payload: Object.fromEntries(data.entries()),
    };

    status.textContent = 'Sending...';
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Message could not be sent.');
      form.reset();
      status.textContent = 'Message received. We will follow up shortly.';
    } catch (error) {
      status.textContent = `${error.message} You can still call or WhatsApp us directly.`;
    }
  });
}
