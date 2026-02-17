# Linkify

This plugin converts text into links based on regular expressions. The regular expressions and link destinations are configurable on the _Options_ page for the plugin.

For example, you could make social media handles link to the profile page so that `@obsdmd` becomes a link to http://twitter.com/obsdmd:

<img width="701" alt="Screenshot 2023-09-29 at 2 59 08 PM" src="https://github.com/matthewhchan/linkify/assets/37097379/d8c29ade-44cc-4f67-9be3-bbecf971ed5e">

Or you could make a shortcut for GitHub repos so that `gh:obsidianmd/obsidian-releases` becomes a link to http://github.com/obsidianmd/obsidian-releases:

<img width="696" alt="Screenshot 2023-09-29 at 3 02 23 PM" src="https://github.com/matthewhchan/linkify/assets/37097379/23b10873-0034-42c6-b9e6-e242d3df8b27">

The text you want to match and the URL you want it to link to are configured on the _Options_ page for the plugin.

_Note: The underlying text is not modified. This plugin only changes the appearance and functionality of your notes. It makes no changes to your `.md` files._

## Usage

### Add a Link Pattern

To add a link pattern:

-   Go to the _Options_ page for Linkify.
-   Click on the _Add New Link_ button.
-   In the first text box, enter a regular expression.
-   In the second text box, write the URL you want the text to link to.[^1]
-   _(Optional)_ Enter a CSS class in the third text box that will also be applied to any matching text.
-   Close the _Options_ page.

[^1]: The URL is allowed to include replacement patterns as described in [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter).

Here's what the Linkify _Options_ page looks like:

<img width="790" alt="Linkify Options" src="https://github.com/matthewhchan/linkify/assets/37097379/486d4e9b-3e09-45be-bbe5-0903b5a74e84">

Now, any text that matches a regular expression will be highlighted as though it were a link in _Live Preview_ mode, and clicking on the text will open the link in a browser.

For example, if the regular expression is `@(\w+)` and the link pattern is `http://twitter.com/$1`, then any occurrence of `@obsdmd` in your notes will link to http://twitter.com/obsdmd, `@github` will link to http://twitter.com/github, etc.

Links to Obsidian notes, e.g. `[[Journal/$1]]`, are also supported.

You can have multiple regex-link entries. Each one is applied independently.

### Custom Styling For a Link Pattern

By default, links will have the `linkified` CSS class applied to them. You can add additional classes based on the pattern by adding them to the "CSS Class" field.

### Delete a Link Pattern

You can delete an entry by clicking on the trash can icon to the right of the entry.

### Default Link Patterns

By default, the plugin starts with three example entries:

1. Text matching `g:([a-zA-Z0-9.-]*)` will link to `http://google.com/search?q=$1`.
2. Text matching `gh:([a-zA-Z0-9.-/]*)`will link to `http://github.com/$1`.
3. Text matching `@([a-zA-Z0-9]*)` will link to `http://twitter.com/$1`.

### Export Rules

To export your rules as a JSON file, click the _Export Rules_ button at the bottom of the Linkify _Options_ page.

### Import Rules

To import rules from a JSON file, click the _Import Rules_ button at the bottom of the _Options_ page and select a `.json` file. Imported rules are added to your existing rules.
