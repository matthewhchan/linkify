import {
  MarkdownPostProcessorContext,
  MarkdownView,
  Plugin,
} from 'obsidian';

const linkRules = [
  {
    regex : /(?<!\S)\w\w?\/[\w\d-#\/.]*[\w\d-#\/]+(?!\S)/,
    href : (match) => { return 'http://' + match[0]; },
  },
  {
    regex : /(?<!\S)([a-z]+)@(?!\S)/,
    href : (match) => { return 'mailto:' + match[1]; },
  }
];

function matchLinkRules(text: string):
    {text: string, href: string, index: number}|null {
  for (var rule of linkRules) {
    let match = text.match(rule.regex);
    if (match) {
      return {
        text : match[0],
        href : rule.href(match),
        index : match.index,
      };
    }
  }

  return null;
}

function linkify(text: string): (string|Node)[] {
  let link = matchLinkRules(text);
  if (link == null) {
    return null;
  }

  let before = text.substr(0, link.index);
  let after = text.substr(link.index + link.text.length);
  let anchor = document.createElement("a");
  anchor.textContent = link.text;
  anchor.href = link.href;
  let nodes: (string|Node)[] = [];
  nodes.push(before);
  nodes.push(anchor);
  nodes.push(...(linkify(after) || [ after ]));
  return nodes;
}

export default class Linkify extends Plugin {
  async onload() {
    // Render matching strings as links in PREVIEW.
    this.registerMarkdownPostProcessor(
        (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
          if (el.firstChild instanceof Node) {
            let walker = document.createTreeWalker(
                el.firstChild, NodeFilter.SHOW_TEXT, null, false);
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
          }
        });

    // Style matching strings in SOURCE as links.
    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      cm.addOverlay({
        token : (stream) => {
          for (var rule of linkRules) {
            if (stream.match(rule.regex)) {
              let baseToken = stream.baseToken();
              if (baseToken == null || baseToken.type == null ||
                  !baseToken.type.includes('url')) {
                return "hmd-internal-link";
              }
            };
          }

          if (!stream.match(/\S+?\b/)) {
            stream.next();
          }
        }
      });
    });

    // Cmd-Click or Middle Click on matching strings in SOURCE to open link.
    this.registerCodeMirror((cm: CodeMirror.Editor) => {
      cm.on("mousedown", (instance, evt) => {
        if ((evt.metaKey || evt.button == 1) && evt.target instanceof
                                                    HTMLElement) {
          let link = matchLinkRules(evt.target.innerText);
          if (link != null && link.index == 0) {
            window.open(link.href);
          }
        }
      });
    });
  }
}
