const marked = require('marked');
const { remote, ipcRenderer } = require('electron');
const { dialog } = remote;
const fs = require('fs');

let currentFile = null;
let textArea = document.getElementById('editor');
let previewArea = document.getElementById('preview');

textArea.addEventListener('input', (event) => {
    let content = event.target.value;
    preview(content);
});

function preview(content) {
    let htmlContent = marked(content);
    previewArea.innerHTML = htmlContent;
}

function openFile() {
    dialog.showOpenDialog({
        filters: [
            { name: 'Markdown', extensions: ['md'] }
        ],
        properties: ['openFile']
    }).then((result) => {
        if (!result.canceled) {
            currentFile = result.filePaths[0];
            let content = fs.readFileSync(currentFile).toString();
            textArea.value = content;
            preview(content);
        }
    });
}

function saveFile() {
    let content = textArea.value;

    if (currentFile === null) {
        dialog.showSaveDialog({
            filters: [
                { name: 'Markdown', extensions: ['md'] }
            ]
        }).then((result) => {
            if (!result.canceled) {
                currentFile = result.filePath;
                fs.writeFileSync(currentFile, content);
            }
        });
    } else {
        fs.writeFileSync(currentFile, content);
    }
}
