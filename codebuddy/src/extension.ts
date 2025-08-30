// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "codebuddy" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('codebuddy.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from codebuddy!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}


import * as vscode from 'vscode'
import { getAIPoweredBotResponse } from './aiIntegration'


async function typeTextInEditor(editor:vscode.TextEditor,text:string){
	for(let i=0;i<text.length;i++){
		//adjust the delay of text
		await new Promise(resolve=>setTimeout(resolve,50))
		editor.edit(editBuilder=>{
			editBuilder.insert(editor.selection.active,text[i]);
		});
	}
}

async function handleUserInput(){
	const prompt=await vscode.window.showInputBox({
		prompt:"please Enter in Your prompt"
	})
	//if user cancel the input
	if(prompt===undefined){
		return;
	}
	//get the active text editor
	const editor=vscode.window.activeTextEditor;
	if(!editor){
		vscode.window.showErrorMessage("No active text editor found");
		return;
	}
	//display a loading message
	editor.edit(editBuilder=>{
		editBuilder.insert(editor.selection.active,"Generating response...");
	})
	//fetching bot response
	const botResponse=await getAIPoweredBotResponse(prompt);
	//remove the loading message
	const loadingMessageLength = 'Fetching Response ...'.length

	editor.edit(editBuilder=>{
		editBuilder.delete(
			new vscode.Range(
				editor.selection.active.translate(0, -loadingMessageLength),
				editor.selection.active
			)
		)
	})
	
	//simulate typing effect for the bot Response
	await typeTextInEditor(editor, botResponse)

	//display completion
	vscode.window.showInformationMessage('Response Recieved and Typed')

}

export function activate(context: vscode.ExtensionContext){

	let disposable = vscode.commands.registerCommand('extension.getAIPoweredBotResponse', async ()=>{
		await handleUserInput()
	})
	context.subscriptions.push(disposable)
}