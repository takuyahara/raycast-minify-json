import { ActionPanel, Icon, Form, Action, Clipboard, showHUD, showToast, Toast } from "@raycast/api";
import { useState } from "react";

interface FormInput {
  input: string;
  result: string;
}

function minify(text: string): [string, unknown] {
  let minified = "";
  let error: unknown = undefined;
  try {
    minified = JSON.stringify(JSON.parse(text));
  } catch (e: unknown) {
    error = e;
  }
  return [minified, error];
}

export default function main() {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const onChange = function (newValue: string) {
    setInput(newValue);
    const [output, error] = minify(newValue);
    if (error !== undefined) {
      showToast({
        style: Toast.Style.Failure,
        title: "Invalid JSON string",
      });
      setResult("");
      return;
    }
    showToast({
      style: Toast.Style.Success,
      title: "Successfully minified",
    });
    setResult(output);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Copy to clipcoard"
            icon={Icon.Clipboard}
            onSubmit={async (values: FormInput) => {
              const [output, error] = minify(values.input);
              if (error !== undefined) {
                showToast({
                  style: Toast.Style.Failure,
                  title: "Invalid JSON string",
                });
                return;
              }
              await Clipboard.copy(output);
              await showHUD("✅ Copied succesfully!");
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea id="input" title="Input" placeholder="Paste JSON here…" value={input} onChange={onChange} />
      <Form.TextField id="result" title="Result" placeholder="Command + Enter to copy to clipboard…" value={result} />
    </Form>
  );
}
