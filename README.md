# pdf-snippet-copier
A small addon for Obsidian to quickly copy an embedding code block for PDF files to the clipboard (For Better-PDF).

The embedded code blocks work with [Better-PDF](https://github.com/MSzturc/obsidian-better-pdf-plugin "Better-PDF (Unmaintained)") (Unmaintained) and [Better-PDF-2](https://github.com/joleaf/obsidian-better-pdf-2-plugin "Better-PDF-2 ").

You can configure a hotkey (`PDF Snipped Copier: Copy PDF Snipped`) which, when pressed, displays a dialogue box where you can enter the page number(s) in the following format
- for a single page: a single number (e.g. `5`)
- for multiple pages: numbers separated by commas (e.g. `5, 7, 13`)
- for ranges: two numbers separated by a hyphen (e.g. `5-13`)

Confirming the window with the for button by pressing Enter will copy the code block to your clipboard (including the code block tags).

```pdf
{
    "url": "[[slides.pdf]]",
    "link": false,
    "page": [
        81
    ]
}
```

I may extend the dialogue box to quickly enter other tags like `scale` or a toggle button for `link`.

# Installation
- Clone / download the repository
- Copy the `pdf-snippet-copier` folder to `.obsidian\plugins\`
- Enable the plugin
- Configure the hotkey (`PDF Snipped Copier: Copy PDF Snipped`), default is `Ctrl+S`
