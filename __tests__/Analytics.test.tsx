import { render, screen } from "@testing-library/react";
import Analytics from "@/components/Analytics";
import { NotificationProvider } from "@/contexts/NotificationContext";

const renderWithProvider = (component: React.ReactElement) => {
  const localStorageMock = {
    getItem: vi.fn(() => JSON.stringify([])),
    setItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  return render(<NotificationProvider>{component}</NotificationProvider>);
};

describe("Analytics", () => {
  it("renders analytics title", () => {
    renderWithProvider(<Analytics />);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("renders chart titles", () => {
    renderWithProvider(<Analytics />);
    expect(screen.getByText("Notifications per Day")).toBeInTheDocument();
    expect(screen.getByText("Read vs Unread")).toBeInTheDocument();
  });
});
