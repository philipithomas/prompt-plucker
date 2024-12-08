import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const plucker = vscode.commands.registerCommand(
    "prompt-plucker.pluckPrompt",
    async () => {
      const options = [
        "Copy as cURL",
        "Copy as plaintext",
        "Copy as plaintext + open Playground",
      ];
      const selection = await vscode.window.showQuickPick(options, {
        placeHolder: "Select an option",
      });

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

      if (selection === "Copy as cURL") {
        messages = [
          vscode.LanguageModelChatMessage.User(
            `Extract the OpenAI call from the following code as a cURL statement with placeholders for parameters.
The user's OpenAI API key is available in the environment variable OPENAI_API_KEY.
Format the cURL statement in a readable format, with newlines and indentation.
Only return the cURL statement, no other text. Do not wrap the text in quotes, backticks, or any other formatting.`,
          ),
          vscode.LanguageModelChatMessage.User(text),
        ];
      } else if (
        selection === "Copy as plaintext" ||
        selection === "Copy as plaintext + open Playground"
      ) {
        messages = [
          vscode.LanguageModelChatMessage.User(
            `Extract the system, user, and bot messages from the OpenAI call in the following code as plaintext.
If there are parameters, include them in the plaintext with placeholders.
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
        vscode.window.showInformationMessage(
          `${selection.toLowerCase()} copied to clipboard.`,
        );

        if (selection === "Copy as plaintext + open Playground") {
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
