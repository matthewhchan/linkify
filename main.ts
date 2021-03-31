import {
  MarkdownPostProcessorContext,
  MarkdownView,
  Plugin,
} from 'obsidian';

const linkRegex = /\w+\/[\w\d-#]+/;

function linkify(text: string): (string|Node)[] {
  let match = text.match(linkRegex);
  if (match) {
    let before = text.substr(0, match.index);
    let link = document.createElement("a");
    link.href = 'http://' + match[0];
    link.textContent = match[0];
    let after = text.substr(match.index + match[0].length);

    let nodes: (string|Node)[] = [];
    nodes.push(before);
    nodes.push(link);
    nodes.push(...(linkify(after) || [ after ]));
    return nodes;
  }

  return null;
}

export default class Linkify extends Plugin {
  async onload() {
    // Render matching strings as links in preview.
    this.registerMarkdownPostProcessor((el: HTMLElement,
                                        ctx: MarkdownPostProcessorContext) => {
      let walker = document.createTreeWalker(el.firstChild,
                                             NodeFilter.SHOW_TEXT, null, false);
      let nodes: ChildNode[] = [];
      let node;
      while (node = walker.nextNode()) {
        nodes.push(node);
      }

      for (node of nodes) {
        let linkified = linkify(node.textContent);
        if (linkified) {
          node.replaceWith(...linkified);
        }
      }
    });

    // Style matching strings in source as links.
    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      cm.addOverlay({
        token : (stream) => {
          if (stream.match(linkRegex)) {
            return "url";
          }
          stream.next();
        }
      });
    });

    // Cmd-Click on matching strings in source to open link.
    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      if (evt.metaKey) {
        let view = this ?.app ?.workspace ?.activeLeaf ?.view;
        if (view instanceof MarkdownView) {
          let editor = view.sourceMode.cmEditor;
          let cursor = editor.getCursor();
          let token = editor.getTokenAt(cursor);
          let match = token.string.match(linkRegex);
          if (match) {
            window.open('http://' + match[0]);
          }
        }
      }
    });
  }

  // TODO: Unregister callbacks.
}
