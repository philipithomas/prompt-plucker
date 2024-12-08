import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const options = {
    COPY_AS_CURL: "Copy as cURL",
    COPY_AS_PLAINTEXT: "Copy as plaintext",
    COPY_AS_PLAINTEXT_OPEN_PLAYGROUND: "Copy as plaintext + open Playground",
  };

  const plucker = vscode.commands.registerCommand(
    "prompt-plucker.pluckPrompt",
    async () => {
      const selection = await vscode.window.showQuickPick(
        Object.values(options),
        {
          placeHolder: "Select an option",
        },
      );

      if (!selection) {
        return;
      }

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const text = editor.document.getText();
      let messages;
      let model;

      try {
        [model] = await vscode.lm.selectChatModels({
          vendor: "copilot",
          family: "gpt-4o",
        });
      } catch (err) {
        vscode.window.showErrorMessage("Failed to select language model.");
        return;
      }

      if (!model) {
        vscode.window.showErrorMessage("No language model available.");
        return;
      }

      if (selection === options.COPY_AS_CURL) {
        messages = [
          vscode.LanguageModelChatMessage.User(
            `Extract the OpenAI call from the following code as a cURL statement with placeholders for parameters.
Review the code, and do your best to extract all parameters.
If the system prompt and user messages are referenced through variables or functions, attempt to extract them and include the extracted values in the cURL statement.
The user's OpenAI API key is available in the environment variable OPENAI_API_KEY.
Format the cURL statement in a readable format, with newlines and indentation.
Only return the cURL statement, no other text. Do not wrap the text in quotes, backticks, or any other formatting.`,
          ),
          vscode.LanguageModelChatMessage.User(text),
        ];
      } else if (
        selection === options.COPY_AS_PLAINTEXT ||
        selection === options.COPY_AS_PLAINTEXT_OPEN_PLAYGROUND
      ) {
        messages = [
          vscode.LanguageModelChatMessage.User(
            `Extract the system, user, and bot messages from the OpenAI call in the following code as plaintext.
If there are parameters, include them in the plaintext with placeholders.
If the file only has one message parameter, then do not prefix it with "User: " or "System: ".
If the file has a system prompt followed by a user message that's passed in as an unmodified string parameter, then only return the system prompt and do not prefix it with "System: ".
Only return the plaintext, no other text. Do not wrap the text in quotes, backticks, or any other formatting.`,
          ),
          vscode.LanguageModelChatMessage.User(text),
        ];
      }

      try {
        const response = await model.sendRequest(
          messages!,
          {},
          new vscode.CancellationTokenSource().token,
        );

        let result = "";
        for await (const chunk of response.text) {
          result += chunk;
        }

        await vscode.env.clipboard.writeText(result);

        const message = selection === options.COPY_AS_CURL
          ? "cURL copied to clipboard."
          : "Prompt copied to clipboard.";

        vscode.window.showInformationMessage(message);

        if (selection === options.COPY_AS_PLAINTEXT_OPEN_PLAYGROUND) {
          vscode.env.openExternal(
            vscode.Uri.parse("https://platform.openai.com/playground"),
          );
        }
      } catch (err) {
        vscode.window.showErrorMessage("Failed to process the request.");
        console.error(err);
      }
    },
  );

  context.subscriptions.push(plucker);
}

export function deactivate() {}
