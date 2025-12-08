import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BellIcon from "@/components/BellIcon";

describe("BellIcon", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("renders bell icon without badge when unreadCount is 0", () => {
    const { container } = render(<BellIcon unreadCount={0} onClick={mockOnClick} />);
    
    const bellIcon = container.querySelector("svg");
    expect(bellIcon).toBeInTheDocument();
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("renders badge with correct count when unreadCount is greater than 0", () => {
    render(<BellIcon unreadCount={5} onClick={mockOnClick} />);
    
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("displays max badge count when unreadCount exceeds max", () => {
    render(<BellIcon unreadCount={15} onClick={mockOnClick} />);
    
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<BellIcon unreadCount={3} onClick={mockOnClick} />);
    
    const bellContainer = container.firstChild as HTMLElement;
    await user.click(bellContainer);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(<BellIcon unreadCount={0} onClick={mockOnClick} className="custom-class" />);
    
    const bellIcon = container.querySelector("svg");
    expect(bellIcon).toHaveClass("custom-class");
  });

  it("applies custom badgeClassName", () => {
    render(<BellIcon unreadCount={2} onClick={mockOnClick} badgeClassName="custom-badge" />);
    
    const badge = screen.getByText("2");
    expect(badge).toHaveClass("custom-badge");
  });
});

