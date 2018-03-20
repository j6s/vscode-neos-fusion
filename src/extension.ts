'use strict';

import * as path from 'path';

import { workspace, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, RevealOutputChannelOn } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {
    // The server is implemented in node
	let serverModule = context.asAbsolutePath(path.join('out', 'server.js'));
	// The debug options for the server
	let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for Fusion documents
		documentSelector: [{scheme: 'file', language: 'fusion'}],
		synchronize: {
			// Synchronize the setting section 'neosFusion' to the server
			configurationSection: 'neosFusion',
			// Notify the server about file changes to '.clientrc files contain in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		},
		revealOutputChannelOn: RevealOutputChannelOn.Info
	};

	// Create the language client and start the client.
	let disposable = new LanguageClient('neosFusion', 'Fusion Language Server', serverOptions, clientOptions).start();

	// Push the disposable to the context's subscriptions so that the
	// client can be deactivated on extension deactivation
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}