import { render, screen } from "@testing-library/react";
import Card from "@/components/Card";

describe("Card", () => {
  it("renders children correctly", () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies default className", () => {
    const { container } = render(
      <Card>
        <div>Content</div>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-white", "rounded-lg", "shadow-sm", "border", "p-6");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("custom-class");
  });

  it("renders multiple children", () => {
    render(
      <Card>
        <div>First</div>
        <div>Second</div>
      </Card>
    );
    
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});

