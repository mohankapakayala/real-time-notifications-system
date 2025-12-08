import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "@/components/Sidebar";

describe("Sidebar", () => {
  const mockOnPageChange = vi.fn();
  const mockSetIsMobileOpen = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
    mockSetIsMobileOpen.mockClear();
  });

  const renderSidebar = (
    activePage = "notifications",
    isMobileOpen = false,
    setIsMobileOpen?: (open: boolean) => void
  ) =>
    render(
      <Sidebar
        activePage={activePage}
        onPageChange={mockOnPageChange}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen || mockSetIsMobileOpen}
      />
    );

  it("renders all menu items", () => {
    renderSidebar();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("highlights active page", () => {
    renderSidebar("dashboard");

    const dashboardButton = screen.getByText("Dashboard").closest("button");
    expect(dashboardButton).toHaveClass("sidebar-menu-active");
  });

  it("calls onPageChange when menu item is clicked", async () => {
    const user = userEvent.setup();
    renderSidebar();

    const dashboardButton = screen.getByText("Dashboard");
    await user.click(dashboardButton);

    expect(mockOnPageChange).toHaveBeenCalledWith("dashboard");
  });

  it("closes mobile menu when item is clicked", async () => {
    const user = userEvent.setup();
    renderSidebar("notifications", true, mockSetIsMobileOpen);

    const dashboardButton = screen.getByText("Dashboard");
    await user.click(dashboardButton);

    expect(mockSetIsMobileOpen).toHaveBeenCalledWith(false);
  });

  it("filters menu items based on search query", async () => {
    const user = userEvent.setup();
    renderSidebar();

    const searchInput = screen.getByPlaceholderText("Search");
    await user.type(searchInput, "Dash");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Notifications")).not.toBeInTheDocument();
  });

  it("shows 'No results found' when search has no matches", async () => {
    const user = userEvent.setup();
    renderSidebar();

    const searchInput = screen.getByPlaceholderText("Search");
    await user.type(searchInput, "xyz123");

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("shows all items when search is cleared", async () => {
    const user = userEvent.setup();
    renderSidebar();

    const searchInput = screen.getByPlaceholderText("Search");
    await user.type(searchInput, "Dash");
    await user.clear(searchInput);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders search input", () => {
    renderSidebar();

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("displays mobile close button when mobile menu is open", () => {
    renderSidebar("notifications", true, mockSetIsMobileOpen);

    const closeButton = screen.getByLabelText("Close menu");
    expect(closeButton).toBeInTheDocument();
  });

  it("closes mobile menu when close button is clicked", async () => {
    const user = userEvent.setup();
    renderSidebar("notifications", true, mockSetIsMobileOpen);

    const closeButton = screen.getByLabelText("Close menu");
    await user.click(closeButton);

    expect(mockSetIsMobileOpen).toHaveBeenCalledWith(false);
  });

  it("closes mobile menu when overlay is clicked", async () => {
    const user = userEvent.setup();
    renderSidebar("notifications", true, mockSetIsMobileOpen);

    const overlay = screen.getByTestId("sidebar-overlay");
    await user.click(overlay);

    expect(mockSetIsMobileOpen).toHaveBeenCalledWith(false);
  });
});
