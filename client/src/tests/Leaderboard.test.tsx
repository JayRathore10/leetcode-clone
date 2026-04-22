import { fireEvent ,  screen , render } from "@testing-library/react";
import { Leaderboard } from "../components/Leaderboard";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));


describe("Leaderboard Component" , ()=>{
  test("Render LeaderBoard component" , ()=>{
    render(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>
    );

    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Global rankings, ratings, and competitive statistics/i
      )
    ).toBeInTheDocument();
  })

  test("button is rendered", () => {
    render(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: /back to home/i })
    ).toBeInTheDocument();
  });

   test("navigates to home on button click", () => {
    render(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /back to home/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});