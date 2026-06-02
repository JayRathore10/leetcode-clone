import { fireEvent, render, screen } from "@testing-library/react";
import LanguageSelect from "../components/LanguageSelect/LanguageSelect";

describe("LanguageSelect Component", () => {
  test("renders all language options", () => {
    render(
      <LanguageSelect
        language="cpp"
        setLanguage={jest.fn()}
      />
    );

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);

    expect(screen.getByText("CPP")).toBeInTheDocument();
    expect(screen.getByText("PYTHON")).toBeInTheDocument();
    expect(screen.getByText("JAVA")).toBeInTheDocument();
    expect(screen.getByText("JAVASCRIPT")).toBeInTheDocument();
  });

  test("has correct default select value" , ()=>{
    render(
      <LanguageSelect 
        language="python" 
        setLanguage={jest.fn()}
      />
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("python");
  });

  test("calls setLanguage when selection changes", ()=>{
    const mockSetLanguage = jest.fn();
    render(
      <LanguageSelect 
        language="cpp"
        setLanguage={mockSetLanguage}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select , {target : {value : "java"}});

    expect(mockSetLanguage).toHaveBeenCalledTimes(1);
    expect(mockSetLanguage).toHaveBeenCalledWith("java");

  })

});