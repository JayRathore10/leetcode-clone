import { fireEvent, render, screen } from "@testing-library/react";
import { CodeEditor } from "../components/CodeEditor/CodeEditor";

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

describe("CodeEditor", () => {
  let code = "";
  const setCode = jest.fn((val) => {
    code = val;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  })

  test("renders editor", () => {
    render(
      <CodeEditor code={code} setCode={setCode} language="cpp" />
    );
    expect(screen.getByTestId("editor")).toBeInTheDocument();
  });

  test("sets boilerplate when language changes", () => {
    render(
      <CodeEditor
        code={code}
        setCode={setCode}
        language="python"
      />
    );
    expect(setCode).toHaveBeenCalled();
    const calledWith = setCode.mock.calls[0][0];
    expect(calledWith).toContain("def solve()");
  });

  test("updates code on change", () => {
    render(
      <CodeEditor
        code={code}
        setCode={setCode}
        language="javascript"
      />
    );

    const editor = screen.getByTestId("editor");

    fireEvent.change(editor, {
      target: { value: "console.log('hello)" }
    });

    expect(setCode).toHaveBeenCalledWith("console.log('hello)");

  });

  test("fallback to cpp when no language", () => {
    render(
      <CodeEditor
        code={code}
        setCode={setCode}
        language=""
      />
    )

    const calledWith = setCode.mock.calls[0][0];

    const normalize = (str: string) =>
      str.replace(/\s+/g, " ").trim();

    expect(normalize(calledWith)).toContain(
      normalize(`#include <bits/stdc++.h>
        using namespace std;
        /*
         Write your solution here
         IMPORTANT:
         - Do NOT return the answer
         - PRINT the answer using cout
        */
        void solve() {
            // Example:
            // cout << answer << endl;
        }
        int main() {
            solve();
            return 0;
        }`)
      );
  })

})