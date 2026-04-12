import { render, screen} from "@testing-library/react";
import { CodeEditor } from "../components/CodeEditor";

jest.mock("@monaco-editor/react", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Editor: ({ value, onChange }: any) => (
    <textarea
      data-testid="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe("CodeEditor" , ()=>{
  let code = "";
  const setCode = jest.fn((val) => {
    code = val;
  });

  beforeEach(()=>{
    jest.clearAllMocks();
  })

  test("renders editor" ,()=>{
    render(
      <CodeEditor code = {code} setCode={setCode} language="cpp" />
    );
    expect(screen.getByTestId("editor")).toBeInTheDocument();
  });

  test("sets boilerplate when language changes", ()=>{
    render(
      <CodeEditor 
        code={code} 
        setCode={setCode} 
        language="python"
      />
    );
    expect(setCode).toHaveBeenCalled();
    const calledWith = setCode.mock.calls[0][0] ;
    expect(calledWith).toContain("def solve()");
  });

})