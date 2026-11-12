export const WHATSAPP_NUMBER = "995595140106";

export type BookingDetails = {
  vehicle?: string;
  from?: string;
  to?: string;
  date?: string;
  passengers?: string;
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const buildBookingMessage = (b: BookingDetails = {}) => {
  const lines = [
    "Hello Drivero, I'd like to book a chauffeur:",
    "",
    b.vehicle ? `• Vehicle: ${b.vehicle}` : null,
    b.from ? `• Pickup: ${b.from}` : null,
    b.to ? `• Drop-off: ${b.to}` : null,
    b.date ? `• When: ${formatDate(b.date)}` : null,
    b.passengers ? `• Passengers: ${b.passengers}` : null,
    "",
    "Please confirm availability and price. Thank you.",
  ].filter(Boolean);
  return lines.join("\n");
};

export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const bookingWhatsappUrl = (b: BookingDetails = {}) =>
  whatsappUrl(buildBookingMessage(b));