// The business's contact details, in one place. Change them here and every
// page that shows them (contact tiles, footer) updates.
export const EMAIL = 'contact@daysback.si';

// WhatsApp: placeholder until the real number is in. Put it in international
// format with no spaces or "+" in `wa` (e.g. '447700900123') and the link
// will open a chat straight to you.
export const WHATSAPP = {
  display: '+44 0000 000000',
  wa: '',
};
export const whatsappLink = () =>
  WHATSAPP.wa ? `https://wa.me/${WHATSAPP.wa}?text=${encodeURIComponent("Hi DaysBack, I'd like to find out how you could help my business.")}` : null;
