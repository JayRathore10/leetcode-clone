import { screen , render } from "@testing-library/react";
import { Leaderboard } from "../components/Leaderboard";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));


describe("Leaderboard Component" , ()=>{
  test(" " , ()=>{
    render(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>
    );

    expect(screen.getByText("Coming Soon")).toBeInTheDocument();

  })
})