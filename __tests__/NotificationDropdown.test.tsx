import { render, screen, waitFor } from "@testing-library/react";
import NotificationDropdown from "@/components/NotificationDropdown";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Notification } from "@/types";

const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "Test notification",
    timestamp: new Date().toISOString(),
    read: false,
  },
];

const renderWithProvider = (
  component: React.ReactElement,
  initialNotifications: Notification[] = []
) => {
  const localStorageMock = {
    getItem: vi.fn(() => JSON.stringify(initialNotifications)),
    setItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  return render(<NotificationProvider>{component}</NotificationProvider>);
};

describe("NotificationDropdown", () => {
  const mockOnClose = vi.fn();
  const mockOnViewAll = vi.fn();
  const mockBellIconRef = { current: null };

  it("does not render when isOpen is false", () => {
    renderWithProvider(
      <NotificationDropdown
        isOpen={false}
        onClose={mockOnClose}
        onViewAll={mockOnViewAll}
        bellIconRef={mockBellIconRef}
      />
    );
    expect(screen.queryByText("No unread notifications")).not.toBeInTheDocument();
  });

  it("renders 'No unread notifications' when there are no unread notifications", () => {
    renderWithProvider(
      <NotificationDropdown
        isOpen={true}
        onClose={mockOnClose}
        onViewAll={mockOnViewAll}
        bellIconRef={mockBellIconRef}
      />
    );
    expect(screen.getByText("No unread notifications")).toBeInTheDocument();
  });

  it("renders unread notifications when available", async () => {
    renderWithProvider(
      <NotificationDropdown
        isOpen={true}
        onClose={mockOnClose}
        onViewAll={mockOnViewAll}
        bellIconRef={mockBellIconRef}
      />,
      mockNotifications
    );
    await waitFor(() => {
      expect(screen.getByText("Test notification")).toBeInTheDocument();
    });
  });
});
