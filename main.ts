import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import {
	Decoration,
	MatchDecorator,
	ViewPlugin,
	ViewUpdate,
} from "@codemirror/view";
import { RangeSet } from "@codemirror/state";

interface LinkifyRule {
	regexp: string;
	link: string;
	cssclass: string;
}

interface LinkifySettings {
	rules: LinkifyRule[];
}

type LinkifyViewPlugin = ViewPlugin<{
	decorations: RangeSet<Decoration>;
	update(u: ViewUpdate): void;
}>;

const DEFAULT_SETTINGS: LinkifySettings = {
	rules: [
		{
			regexp: "g:([a-zA-Z0-9.-]*)",
			link: "http://google.com/search?q=$1",
			cssclass: "",
		},
		{
			regexp: "gh:([a-zA-Z0-9./-]*)",
			link: "http://github.com/$1",
			cssclass: "",
		},
		{
			regexp: "@([a-zA-Z0-9]*)",
			link: "http://twitter.com/$1",
			cssclass: "",
		},
	],
};

const DEFAULT_NEW_RULE = {
	regexp: "g\\/([a-zA-Z.-]*)",
	link: "http://google.com/search?q=$1",
	cssclass: "",
};

// Creates a ViewPlugin from a LinkifyRule.
function createViewPlugin(rule: LinkifyRule): LinkifyViewPlugin {
	let decorator = new MatchDecorator({
		regexp: new RegExp(rule.regexp, "g"),
		decoration: Decoration.mark({
			class: `cm-link linkified ${rule.cssclass}`,
		}),
	});
	return ViewPlugin.define(
		(view) => ({
			decorations: decorator.createDeco(view),
			update(u) {
				this.decorations = decorator.updateDeco(u, this.decorations);
			},
		}),
		{
			decorations: (v) => v.decorations,
		},
	);
}

export default class Linkify extends Plugin {
	settings: LinkifySettings;
	viewPlugins: LinkifyViewPlugin[] = [];
	cmdClick: boolean;

	async onload() {
		// Load settings.
		await this.loadSettings();

		// Create settings tab.
		this.addSettingTab(new LinkifySettingTab(this.app, this));

		// Linkify Live Preview mode.
		this.registerEditorExtension(this.viewPlugins);
		this.refreshExtensions();

		// Linkify Reading mode.
		this.registerMarkdownPostProcessor(
			this.markdownPostProcessor.bind(this),
		);

		// Click to open the link.
		this.registerDomEvent(document, "click", (evt) => {
			this.openLink(evt);
		});
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Creates new LinkifyViewPlugins and registers them.
	refreshExtensions() {
		this.viewPlugins.splice(
			0,
			this.viewPlugins.length,
			...this.settings.rules.map(createViewPlugin),
		);
		this.app.workspace.updateOptions();
	}

	// Opens linkified text as a link.
	openLink(evt: MouseEvent) {
		if (
			evt.target instanceof HTMLSpanElement &&
			evt.target.className.includes("cm-link linkified")
		) {
			let m = this.matchRule(evt.target.innerText);
			if (m != null) {
				// try to match internal link
				const internalLinkMatch = m.link.match(
					/^\[\[([^|\]]*)(?:\|[^|\]]*)?\]\]$/,
				);
				if (internalLinkMatch != null) {
					this.app.workspace.openLinkText(
						internalLinkMatch.at(1),
						"",
					);
				} else {
					window.open(m.link);
				}
			}
		}
	}

	// Returns the RegExp match and link for the given text.
	matchRule(
		text: string,
	): { match: RegExpMatchArray; link: string; cssclass: string } | null {
		for (let rule of this.settings.rules) {
			let regexp = new RegExp(rule.regexp);
			let m = text.match(regexp);
			if (m != null) {
				return {
					match: m,
					link: m[0].replace(regexp, rule.link),
					cssclass: rule.cssclass,
				};
			}
		}

		return null;
	}

	// Replaces matching text with an anchor.
	linkifyHtml(text: string): (string | Node)[] {
		let m = this.matchRule(text);
		if (m == null) {
			return null;
		}

		let index = m.match.index;
		let matchedText = m.match[0];
		let before = text.substring(0, index);
		let after = text.substring(index + matchedText.length);
		let anchor = document.createElement("a");
		anchor.textContent = matchedText;
		anchor.href = m.link;
		anchor.className = `linkified ${m.cssclass}`;
		let nodes: (string | Node)[] = [];
		nodes.push(before);
		nodes.push(anchor);
		nodes.push(...(this.linkifyHtml(after) || [after]));
		return nodes;
	}

	// Converts matching text in the HTMLElement into links.
	markdownPostProcessor(el: HTMLElement) {
		if (el.firstChild instanceof Node) {
			let walker = document.createTreeWalker(
				el.firstChild,
				NodeFilter.SHOW_TEXT,
				null,
			);
			let nodes: Node[] = [];
			let node: Node;
			while ((node = walker.nextNode())) {
				nodes.push(node);
			}

			for (node of nodes) {
				let linkified = this.linkifyHtml(node.textContent);
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
		containerEl.createEl("p", {
			text: "Text matching the following regular expressions will be converted into links.",
		});

		for (let [index, rule] of this.plugin.settings.rules.entries()) {
			new Setting(containerEl)
				.setDesc("RegExp/Link")
				.addText((text) => {
					text.setValue(rule.regexp);
					text.inputEl.onblur = async () => {
						rule.regexp = text.getValue();
						await this.plugin.saveSettings();
					};
				})
				.addText((text) => {
					text.setValue(rule.link);
					text.inputEl.onblur = async () => {
						rule.link = text.getValue();
						await this.plugin.saveSettings();
					};
				})
				.addText((text) => {
					text.setValue(rule.cssclass);
					text.setPlaceholder("CSS Class");
					text.inputEl.onblur = async () => {
						rule.cssclass = text.getValue();
						await this.plugin.saveSettings();
					};
				})
				.addButton((button) => {
					return button.setIcon("trash").onClick(async () => {
						this.plugin.settings.rules.splice(index, 1);
						await this.plugin.saveSettings();
						this.display();
					});
				});
		}

		new Setting(containerEl).addButton((button) =>
			button.setButtonText("Add New Link").onClick(async () => {
				this.plugin.settings.rules.push({ ...DEFAULT_NEW_RULE });
				await this.plugin.saveSettings();
				this.display();
			}),
		);
	}

	hide() {
		this.plugin.refreshExtensions();
	}
}
