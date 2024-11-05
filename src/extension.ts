import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/*
 * TODO
 * 1. 열려있는 탭 중 수정된 파일이 있을 때만 revert
 * 2. 파일 revert시 포인터 원래 위치로 옮기기
 * 3. 동기화할 파일 경로를 어떻게 관리 & 설정할 것인가?
*/

function filechange() {
    const activeEditor = vscode.window.activeTextEditor;

}


async function revertActiveDocument() {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const document = activeEditor.document;

        if (document.isDirty) {
            await vscode.commands.executeCommand('workbench.action.files.revert');
            console.log("변경사항 날림");
        } else {
            console.log("문서가 저장됨");
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("작업 공간 없음");
        return;
    }
    
    const filePath = path.join(workspaceFolder.uri.fsPath, 'abc/open.txt');
    let lastModifiedTime: number | null = null;

    const interval = setInterval(() => {
        fs.stat(filePath, async (err, stats) => {

            if (err) {
                return;
            }

            const modifiedTime = stats.mtime.getTime();
            if (lastModifiedTime && lastModifiedTime !== modifiedTime) {
                vscode.window.showInformationMessage(`${filePath} 파일 수정됨`);
                revertActiveDocument();


                /*
                await vscode.window.showTextDocument(document, {
                    viewColumn: vscode.window.activeTextEditor?.viewColumn,
                    preserveFocus: true,
                    preview: false
                });
                */
            }
            lastModifiedTime = modifiedTime;
        });
    }, 10);

    context.subscriptions.push({
        dispose() {
            clearInterval(interval);
        }
    });
}

export function deactivate() {
    
}
