import { render, screen, waitFor } from "@testing-library/react";
import NotificationList from "@/components/NotificationList";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Notification } from "@/types";

const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "First notification",
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: "2",
    message: "Second notification",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true,
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

describe("NotificationList", () => {
  it("renders notifications list", async () => {
    renderWithProvider(<NotificationList />, mockNotifications);
    await waitFor(() => {
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    });
  });

  it("displays 'No notifications yet' when list is empty", () => {
    renderWithProvider(<NotificationList />, []);
    expect(screen.getByText("No notifications yet")).toBeInTheDocument();
  });

  it("displays notifications when they exist", async () => {
    renderWithProvider(<NotificationList />, mockNotifications);
    await waitFor(() => {
      expect(screen.getByText("First notification")).toBeInTheDocument();
    });
  });
});
