'use strict';

import * as path from 'path';
import * as os from 'os';

import {Trace} from 'vscode-jsonrpc';
import { commands, window, workspace, ExtensionContext, Uri } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {
    // TODO specify the language server name here - language server Fat JAR has to be located in `languageserver` directory
    let languageServerName = "";

    let serverOptions: ServerOptions = {
        run : { command: "java", args: ["-jar", context.asAbsolutePath(path.join('languageserver', languageServerName))] },
        debug: { command: "java", args: ["-jar", context.asAbsolutePath(path.join('languageserver', languageServerName))], options: { env: createDebugEnv() } }
    };
    
    let clientOptions: LanguageClientOptions = {
        //TODO specify language server file extension name here
        documentSelector: ['mydsl'],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.*')
        }
    };
    
    // Create the language client and start the client.
    let lc = new LanguageClient('Xtext Server', serverOptions, clientOptions);
        
    // enable tracing (.Off, .Messages, Verbose)
    lc.trace = Trace.Verbose;
    let disposable = lc.start();
    
    // Push the disposable to the context's subscriptions so that the 
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}

function createDebugEnv() {
    return Object.assign({
        JAVA_OPTS:"-Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y"
    }, process.env)
}