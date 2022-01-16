import { App, ButtonComponent, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Decoration, MatchDecorator, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { RangeSet } from "@codemirror/rangeset";

interface LinkifySettings {
	rules: {
		regexp: string,
		link: string,
	}[];
}

const DEFAULT_SETTINGS: LinkifySettings = {
	rules: [
		{
			regexp: "g\\/([a-zA-Z.-]*)",
			link: "http://google.com/search?q=$1"
		},
		{
			regexp: "@([a-zA-Z]*)",
			link: "http://twitter.com/$1"
		},
	]
}

// Creates a ViewPlugin from a rule. 
function createViewPlugin(rule: { regexp: string, link: string }): ViewPlugin<{
	decorations: RangeSet<Decoration>;
	update(u: ViewUpdate): void;
}> {
	let decorator = new MatchDecorator({
		regexp: new RegExp(rule.regexp, "g"),
		decoration: Decoration.mark({ class: "cm-link linkified" }),
	});
	return ViewPlugin.define(view => ({
		decorations: decorator.createDeco(view),
		update(u) { this.decorations = decorator.updateDeco(u, this.decorations) }
	}), {
		decorations: v => v.decorations
	});
}

export default class Linkify extends Plugin {
	settings: LinkifySettings;

	async onload() {
		// Settings
		await this.loadSettings();
		this.addSettingTab(new LinkifySettingTab(this.app, this));

		// Linkify Live Preview mode.
		this.settings.rules.map(createViewPlugin).forEach((plugin) => { this.registerEditorExtension(plugin); });

		// Linkify Reading mode.
		this.registerMarkdownPostProcessor(this.markdownProcessor.bind(this));

		// Cmd or middle click on linkified text to open the link.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			if ((evt.metaKey || evt.button == 1) &&
				evt.target instanceof HTMLSpanElement &&
				evt.target.className == "cm-link linkified") {
				let m = this.matchRule(evt.target.innerText);
				if (m != null) {
					window.open(m.link);
				}
			}
		});

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Returns the RegExp match and link for the given text.
	matchRule(text: string): { match: RegExpMatchArray, link: string } | null {
		for (let rule of this.settings.rules) {
			let regexp = new RegExp(rule.regexp);
			let m = text.match(regexp);
			if (m != null) {
				return {
					match: m,
					link: text.replace(regexp, rule.link),
				}
			}
		}

		return null;
	}

	// Replaces matching text with a link.
	linkify(text: string): (string | Node)[] {
		let m = this.matchRule(text);
		if (m == null) {
			return null;
		}

		let index = m.match.index;
		let matched_text = m.match[0];
		let before = text.substring(0, index);
		let after = text.substring(index + text.length);
		let anchor = document.createElement("a");
		anchor.textContent = matched_text;
		anchor.href = m.link;
		let nodes: (string | Node)[] = [];
		nodes.push(before);
		nodes.push(anchor);
		nodes.push(...(this.linkify(after) || [after]));
		return nodes;
	}

	markdownProcessor(el: HTMLElement) {
		if (el.firstChild instanceof Node) {
			let walker = document.createTreeWalker(
				el.firstChild, NodeFilter.SHOW_TEXT, null);
			let nodes: Node[] = [];
			let node: Node;
			while (node = walker.nextNode()) {
				nodes.push(node);
			}

			for (node of nodes) {
				let linkified = this.linkify(node.textContent);
				if (linkified) {
					(<Element>node).replaceWith(...linkified);
				}
			}
		}
	}

}

class LinkifySettingTab extends PluginSettingTab {
	plugin: Linkify;

	constructor(app: App, plugin: Linkify) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('p', { text: 'Strings matching the following regular expressions will be turned into links.' });

		for (let [index, rule] of this.plugin.settings.rules.entries()) {
			new Setting(containerEl)
				.setDesc("RegExp/Link")
				.addText(text => text
					.setValue(rule.regexp)
					.onChange(async (value) => {
						rule.regexp = value;
						await this.plugin.saveSettings();
					}))
				.addText(text => text
					.setValue(rule.link)
					.onChange(async (value) => {
						rule.link = value;
						await this.plugin.saveSettings();
					}))
				.addButton((button: ButtonComponent) => {
					return button
						.setButtonText("-")
						.onClick(async () => {
							this.plugin.settings.rules.splice(index, 1);
							await this.plugin.saveSettings();
							this.display();
						});
				});
		}

		containerEl.createEl('div', {
			cls: 'setting-item',
		});
		containerEl.createEl('button', {
			text: "+",
		}).onclick = async () => {
			this.plugin.settings.rules.push({
				regexp: "link:([a-zA-Z.-]+)",
				link: "http://$1",
			})
			await this.plugin.saveSettings();
			this.display();
		}
		containerEl.createDiv({
			text: "Changes require a restart to take effect in Live Preview.",
			cls: 'setting-item-description',
			attr: {
				style: 'margin-top: 26px',
			}
		});
	}
}
