import { render, screen } from "@testing-library/react";
import LanguageSelect from "../components/LanguageSelect";

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
});