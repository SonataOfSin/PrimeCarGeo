import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import {
  VehicleCard,
  type VehicleCardLabels,
  type VehicleDisplayData,
} from "@/components/primevibe/VehicleCard";

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

const KA_LABELS: VehicleCardLabels = {
  from: "დან",
  view: "ვრცლად",
  book: "დაჯავშნა",
  passengers: "მგზავრი",
  luggage: "ბარგი",
  features: "მახასიათებლები",
  indicative: "სავარაუდო ფასი — საბოლოო ციტატა დასტურდება ჯავშნისას",
  unit: "ტრანსფერზე",
  close: "დახურვა",
};

const renderCard = (props: Partial<Parameters<typeof VehicleCard>[0]> = {}) =>
  render(<VehicleCard vehicle={VEHICLE} {...props} />);

const openDialog = async () => {
  fireEvent.click(screen.getByRole("button", { name: "View Vehicle" }));
  return screen.findByRole("dialog");
};

const priceNode = (label: string) =>
  screen.getByText((_, element) => element?.textContent === label);

describe("VehicleCard", () => {
  it("renders a semantically labelled card with specs, features and indicative price", () => {
    renderCard();

    const article = screen.getByRole("article", { name: /Mercedes-Maybach W223/ });
    expect(article).toBeInTheDocument();

    expect(
      within(article).getByRole("heading", { level: 3, name: /Mercedes-Maybach W223/ }),
    ).toBeInTheDocument();
    expect(within(article).getByText("(2025)")).toBeInTheDocument();
    expect(within(article).getByText("Maybach")).toBeInTheDocument();
    expect(within(article).getByRole("img", { name: "Mercedes-Maybach W223" })).toBeInTheDocument();

    // Capacity is exposed as a description list (term roles have no accessible
    // name, so assert on their text content).
    expect(within(article).getAllByRole("term").map((node) => node.textContent)).toEqual([
      "Passengers",
      "Luggage",
    ]);
    expect(within(article).getAllByRole("definition").map((node) => node.textContent)).toEqual([
      "3",
      "3",
    ]);

    expect(
      within(article).getByRole("heading", { level: 4, name: "Highlights" }),
    ).toBeInTheDocument();
    for (const feature of VEHICLE.features) {
      expect(within(article).getByText(feature)).toBeInTheDocument();
    }

    expect(within(article).getByText("From")).toBeInTheDocument();
    expect(priceNode("450₾")).toBeInTheDocument();
    expect(within(article).getByText("per transfer")).toBeInTheDocument();
    expect(
      within(article).getByText("Indicative price — final quote on booking"),
    ).toBeInTheDocument();

    expect(within(article).getByRole("button", { name: "View Vehicle" })).toBeInTheDocument();
  });

  it("formats larger starting prices with a thousands separator", () => {
    render(<VehicleCard vehicle={{ ...VEHICLE, price: { amount: 1250, currency: "₾" } }} />);
    expect(priceNode("1,250₾")).toBeInTheDocument();
  });

  it("opens the details dialog from the View Vehicle action", async () => {
    renderCard();

    const dialog = await openDialog();

    expect(
      within(dialog).getByRole("heading", { level: 2, name: /Mercedes-Maybach W223/ }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("The pinnacle of Mercedes luxury.")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { level: 3, name: "Highlights" }),
    ).toBeInTheDocument();
    expect(within(dialog).getByRole("img", { name: "Mercedes-Maybach W223" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Book this vehicle" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("opens the details dialog from the photograph", async () => {
    renderCard();

    fireEvent.click(
      screen.getByRole("button", { name: "View Vehicle: Mercedes-Maybach W223" }),
    );

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("closes the dialog with the Escape key", async () => {
    renderCard();
    await openDialog();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("books from the details dialog and closes it", async () => {
    const onBook = vi.fn();
    renderCard({ onBook });

    const dialog = await openDialog();
    fireEvent.click(within(dialog).getByRole("button", { name: "Book this vehicle" }));

    expect(onBook).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("books directly from the card without opening the dialog", () => {
    const onBook = vi.fn();
    renderCard({ onBook });

    fireEvent.click(screen.getByRole("button", { name: "Book this vehicle" }));

    expect(onBook).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hides the booking action when no handler is provided", () => {
    renderCard();

    expect(
      screen.queryByRole("button", { name: "Book this vehicle" }),
    ).not.toBeInTheDocument();
  });

  it("applies localized labels, including the dialog close control", async () => {
    renderCard({ labels: KA_LABELS });

    expect(screen.getByText("დან")).toBeInTheDocument();
    expect(screen.getAllByRole("term").map((node) => node.textContent)).toEqual([
      "მგზავრი",
      "ბარგი",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "ვრცლად" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "დახურვა" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "დაჯავშნა" })).toBeInTheDocument();
  });
});
