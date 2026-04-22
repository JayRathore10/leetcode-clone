import { fireEvent, screen, render } from "@testing-library/react";
import { MaintenanceAlert } from "../components/MaintenanceAlert";
import { MemoryRouter } from "react-router-dom";

describe("Maintenance Alert Component", () => {

  const mockOnClose = jest.fn();

  const setup = () => {
    render(
      <MemoryRouter>
        <MaintenanceAlert 
          message="Site is under maintenance" 
          onClose={mockOnClose} 
        />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setup();
  });

  test("renders heading correctly", () => {
    expect(screen.getByText("Under Maintenance")).toBeInTheDocument();
  });

  test("renders message correctly", () => {
    expect(
      screen.getByText("Site is under maintenance")
    ).toBeInTheDocument();
  });

  test("calls onClose when button is clicked", () => {
    const button = screen.getByRole("button", { name: /ok/i });
    
    fireEvent.click(button);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

});