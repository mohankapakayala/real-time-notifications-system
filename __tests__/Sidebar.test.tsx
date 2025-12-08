import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "@/components/Sidebar";

describe("Sidebar responsive behavior", () => {
  const renderSidebar = () =>
    render(<Sidebar activePage="notifications" onPageChange={() => {}} />);

  it("starts closed on mobile and opens when toggle is clicked", async () => {
    const user = userEvent.setup();
    renderSidebar();

    const panel = screen.getByTestId("sidebar-panel");
    expect(panel.className).toContain("-translate-x-full");

    await user.click(screen.getByTestId("sidebar-toggle"));
    expect(panel.className).toContain("translate-x-0");
    expect(screen.getByTestId("sidebar-overlay")).toBeInTheDocument();
  });

  it("closes when the overlay is clicked", async () => {
    const user = userEvent.setup();
    renderSidebar();

    await user.click(screen.getByTestId("sidebar-toggle"));
    await user.click(screen.getByTestId("sidebar-overlay"));

    const panel = screen.getByTestId("sidebar-panel");
    expect(panel.className).toContain("-translate-x-full");
  });
});

