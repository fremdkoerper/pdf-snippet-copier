const { Plugin, Modal, Notice } = require('obsidian');

class PromptModal extends Modal {
    constructor(app, title, onSubmit) {
        super(app);
        this.title = title;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: this.title });

        const inputEl = contentEl.createEl("input", { type: "text", placeholder: "Page Number(s)" });
        inputEl.focus();

        inputEl.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const pageInput = inputEl.value;
                this.close();
                this.onSubmit(pageInput);
            }
        });

        contentEl.createEl("button", { text: "Submit" }).addEventListener("click", () => {
            const pageInput = inputEl.value;
            this.close();
            this.onSubmit(pageInput);
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

module.exports = class PdfSnippetCopierPlugin extends Plugin {
    async onload() {
        console.log("Loading PDF Snippet Copier Plugin");

        // Register the command with a hotkey
        this.addCommand({
            id: 'copy-pdf-snippet',
            name: 'Copy PDF Snippet',
            callback: async () => {
                const activeFile = this.app.workspace.getActiveFile();
                if (activeFile && activeFile.extension === "pdf") {
                    const pageInput = await this.promptPageNumber();
                    const snippet = this.generateSnippet(activeFile.path, pageInput);
                    if (snippet) {
                        await this.copyToClipboard(snippet);
                        new Notice("PDF Snippet copied to clipboard!");
                    } else {
                        new Notice("Invalid page input.");
                    }
                } else {
                    new Notice("No active PDF file");
                }
            },
            hotkeys: [
                {
                    modifiers: ["Mod"], // "Mod" stands for "Command" on Mac and "Ctrl" on Windows
                    key: "s"
                }
            ]
        });
    }

    onunload() {
        console.log("Unloading PDF Snippet Copier Plugin");
    }

    async promptPageNumber() {
        return new Promise((resolve) => {
            const prompt = new PromptModal(this.app, "Enter Page Number(s)", resolve);
            prompt.open();
        });
    }

    generateSnippet(filePath, pageInput) {
        const pages = this.parsePageInput(pageInput);
        if (!pages) {
            return null;
        }

        let snippetObject = {
            url: `[[${filePath}]]`,
            link: false
        };

        if (Array.isArray(pages)) {
            snippetObject.page = pages;
        } else if (pages.range) {
            snippetObject.range = pages.range;
        }

        return "```pdf\n" + JSON.stringify(snippetObject, null, 4) + "\n```";
    }

    parsePageInput(input) {
        if (/^\d+$/.test(input)) {
            // Single number
            return [parseInt(input)];
        } else if (/^\d+(,\s*\d+)+$/.test(input)) {
            // Multiple numbers separated by commas
            return input.split(',').map(num => parseInt(num.trim()));
        } else if (/^\d+-\d+$/.test(input)) {
            // Range of numbers
            const [start, end] = input.split('-').map(num => parseInt(num.trim()));
            return { range: [start, end] };
        } else {
            return null;
        }
    }

    async copyToClipboard(snippet) {
        // Fallback for older browsers
        if (!navigator.clipboard) {
            const textArea = document.createElement("textarea");
            textArea.value = snippet;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
            } catch (err) {
                console.error("Fallback: Oops, unable to copy", err);
            }
            document.body.removeChild(textArea);
            return;
        }
        // Modern browser
        await navigator.clipboard.writeText(snippet);
    }
};
