import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { Header } from "../components/Header";

jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    header: ({ children }: any) => <header>{children}</header>,
  },
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom" , ()=>({
  ...jest.requireActual("react-router-dom") , 
  useNavigate : () => mockNavigate
}));

describe("Header" , ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });

  test("render nav links" , ()=>{
    render(
      <MemoryRouter>
        <Header 
          isloggedIn = {false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Problems")).toBeInTheDocument();
    expect(screen.getByText("Contests")).toBeInTheDocument();
    expect(screen.getByText("Discuss")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
  })

  test("show Login when not logged in" , ()=>{
    render (<MemoryRouter >
      <Header 
        isloggedIn = {false}
      />
    </MemoryRouter>
    );

    expect(screen.getByRole("button")).toHaveTextContent("Login");
  })

  test("shows profile on logged in and not on the profile page" , ()=>{
    render(
      <MemoryRouter >
        <Header 
          isloggedIn={true}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("button")).toHaveTextContent("Profile");
  });

  test("show logout on the profile page" , ()=>{
    render(
      <MemoryRouter 
        initialEntries={["/profile"]}
      >
        <Header 
          isloggedIn={true}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("button")).toHaveTextContent("Logout");
  })
 
  test("navigate to login when not logged in" , ()=>{
    render(
      <MemoryRouter>
        <Header
          isloggedIn={false}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
})