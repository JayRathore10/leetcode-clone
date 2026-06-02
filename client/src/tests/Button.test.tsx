import {render, screen , fireEvent} from "@testing-library/react";
import Button from "../components/Button/Button";

test("render button with text" , ()=>{
  render(<Button label="Click Me" onClick={() => {}} />);
  expect(screen.getByText("Click Me")).toBeInTheDocument();
});

test("Calls function on click" , ()=>{
  const handleClick = jest.fn();
  render(<Button label="Click Me" onClick={handleClick} />);
  fireEvent.click(screen.getByText("Click Me"));

  expect(handleClick).toHaveBeenCalledTimes(1);
})