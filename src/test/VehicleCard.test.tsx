import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { VehicleCard, type VehicleDisplayData } from "@/components/primevibe/VehicleCard";

const VEHICLE: VehicleDisplayData = {
  id: "maybach",
  name: "Mercedes-Maybach W223",
  year: "2025",
  category: "Maybach",
  description: "The pinnacle of Mercedes luxury.",
  features: ["First-class rear suite", "Executive footrests", "Whisper-quiet composure"],
  image: "fleet-maybach.jpg",
  imageAlt: "Mercedes-Maybach W223",
  passengers: 3,
  luggage: 3,
  price: { amount: 450, currency: "₾" },
};

const renderCard = (props: Partial<Parameters<typeof VehicleCard>[0]> = {}) =>
  render(<VehicleCard data={VEHICLE} {...props} />);

describe("VehicleCard", () => {
  it("renders vehicle identity, capacities, features and price", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: /Mercedes-Maybach W223/ })).toBeInTheDocument();
    expect(screen.getByText("(2025)")).toBeInTheDocument();
    expect(screen.getByText("Maybach")).toBeInTheDocument();
    expect(screen.getByAltText("Mercedes-Maybach W223")).toBeInTheDocument();
    expect(screen.getByText("3 Passengers")).toBeInTheDocument();
    expect(screen.getByText("3 Luggage")).toBeInTheDocument();
    expect(screen.getByText("First-class rear suite")).toBeInTheDocument();
    expect(screen.getByText("Executive footrests")).toBeInTheDocument();
    expect(screen.getByText("Whisper-quiet composure")).toBeInTheDocument();
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === "450₾"),
    ).toBeInTheDocument();
    expect(screen.getByText("per transfer")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View Vehicle" })).toBeInTheDocument();
  });

  it("opens the details dialog from the View Vehicle action", async () => {
    renderCard();

    const viewButton = screen.getByRole("button", { name: "View Vehicle" });

    fireEvent.click(viewButton);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: /Mercedes-Maybach W223/ })).toBeInTheDocument();
    expect(within(dialog).getByText("The pinnacle of Mercedes luxury.")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: /Book this vehicle/i })).toBeInTheDocument();
  });

  it("fires onBook from the dialog booking action and closes", async () => {
    const onBook = vi.fn();
    renderCard({ onBook });

    fireEvent.click(screen.getByRole("button", { name: "View Vehicle" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /Book this vehicle/i }));

    expect(onBook).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("fires onBook from the card-level secondary action without opening the dialog", () => {
    const onBook = vi.fn();
    renderCard({ onBook });

    fireEvent.click(screen.getByRole("button", { name: /Book this vehicle/i }));
    expect(onBook).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
