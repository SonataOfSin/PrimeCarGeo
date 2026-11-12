export type BookingPrefill = {
  vehicle?: string;
  pickup?: string;
  dropoff?: string;
  service_type?: string;
};

const EVENT = "drivero:prefill-booking";

export const requestBooking = (prefill: BookingPrefill = {}) => {
  window.dispatchEvent(new CustomEvent<BookingPrefill>(EVENT, { detail: prefill }));
  document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const onBookingPrefill = (cb: (p: BookingPrefill) => void) => {
  const handler = (e: Event) => cb((e as CustomEvent<BookingPrefill>).detail || {});
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
};
