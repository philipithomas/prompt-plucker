# Prompt Plucker

> ⚠️ **Warning**: This extension is in early development, and is not yet available in the Visual Studio Marketplace. So, it must be [installed manually](https://code.visualstudio.com/api/get-started/your-first-extension).

Have OpenAI chat calls in your code? Need to run the prompts and test them out? Enter Prompt Plucker!

**Prompt Plucker is "Copy as cURL" for your code's OpenAI calls.** It's extension for Visual Studio Code that **easily extracts OpenAI prompts from code files for debugging**.


![Demo of Prompt Plucker](images/demo.gif)

How it works:
1. Install [GitHub Copilot](https://github.com/features/copilot) and [Prompt Plucker](https://code.visualstudio.com/api/get-started/your-first-extension) in Visual Studio Code
2. Open a file with an OpenAI call in it
3. Open the [Command Palette](https://docs.github.com/en/codespaces/reference/using-the-vs-code-command-palette-in-codespaces) and select "Prompt Plucker"
4. Choose how you want to copy the prompt: as cURL or plaintext
5. The prompt is copied to your clipboard, ready for testing 🎉

## Features

1. **Copy as cURL**: Extracts the OpenAI call from your code and convert it into a cURL statement. The cURL statement will include placeholders for parameters, making it easy to test and debug your prompts. The OpenAI API key is referenced as the `OPENAI_API_KEY` environment variable, so you can set it in your environment or pass it as a parameter.

2. **Copy as Plaintext**: Extract the system, user, and bot messages from the OpenAI call as plaintext. This is useful for quickly reviewing and editing the prompts.

3. **Copy as Plaintext + Open Playground**: Copies the extracted plaintext messages to your clipboard, and then opens the OpenAI Playground in your default browser. This allows you to immediately test and refine your prompts in the Playground environment.

## Requirements

* [GitHub Copilot](https://github.com/features/copilot) extension must be installed

## Known Issues

* Only works with OpenAI Chat calls

## Release Notes

### 1.0.0

Initial release of Prompt Plucker.
