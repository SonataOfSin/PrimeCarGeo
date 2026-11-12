import maybach from "@/assets/fleet-maybach.jpg";
import sclass from "@/assets/fleet-sclass.jpg";
import vclass from "@/assets/fleet-vclass.jpg";
import type { Vehicle } from "@/services/bookings";

/**
 * MOCK FLEET DATA — placeholder until a real fleet source (CMS / backend) exists.
 *
 * Vehicle identities (name, year, category, capacity, imagery) mirror the copy
 * already published in the Fleet section. Starting prices and per-vehicle
 * feature highlights are FICTIONAL PLACEHOLDERS for layout purposes — they are
 * NOT company quotes or verified specifications. Replace this module with real
 * fleet data when it becomes available.
 *
 * Prices are in GEL (₾), consistent with the Pricing section, and are labelled
 * "indicative" in the UI.
 */
export interface FleetVehicle {
  id: string;
  name: string;
  year: string;
  /** i18n key — category badge shown over the photo */
  categoryKey: string;
  /** i18n key — short description */
  blurbKey: string;
  /** i18n keys — per-vehicle feature highlights (derived from existing copy) */
  featureKeys: string[];
  image: string;
  imageWidth: number;
  imageHeight: number;
  passengers: number;
  luggage: number;
  /** MOCK starting price, in GEL — not a company quote */
  priceFrom: number;
  /** Currency symbol shown next to the price */
  currency: string;
  /** Prefills the booking widget; matches the VEHICLES enum in services/bookings */
  bookingRef: Vehicle;
}

export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: "maybach",
    name: "Mercedes-Maybach W223",
    year: "2025",
    categoryKey: "fleet.tag.maybach",
    blurbKey: "fleet.maybach.blurb",
    featureKeys: ["fleet.maybach.f1", "fleet.maybach.f2", "fleet.maybach.f3"],
    image: maybach,
    imageWidth: 2341,
    imageHeight: 1756,
    passengers: 3,
    luggage: 3,
    priceFrom: 450,
    currency: "₾",
    bookingRef: "Maybach",
  },
  {
    id: "sclass",
    name: "Mercedes-Benz S-Class W223",
    year: "2024",
    categoryKey: "fleet.tag.executive",
    blurbKey: "fleet.sclass.blurb",
    featureKeys: ["fleet.sclass.f1", "fleet.sclass.f2", "fleet.sclass.f3"],
    image: sclass,
    imageWidth: 1280,
    imageHeight: 960,
    passengers: 3,
    luggage: 3,
    priceFrom: 320,
    currency: "₾",
    bookingRef: "S-Class",
  },
  {
    id: "vclass",
    name: "Mercedes-Benz V-Class W447",
    year: "2026",
    categoryKey: "fleet.tag.signature",
    blurbKey: "fleet.vclass.blurb",
    featureKeys: ["fleet.vclass.f1", "fleet.vclass.f2", "fleet.vclass.f3"],
    image: vclass,
    imageWidth: 1280,
    imageHeight: 654,
    passengers: 6,
    luggage: 6,
    priceFrom: 250,
    currency: "₾",
    bookingRef: "V-Class",
  },
];
