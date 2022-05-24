# Linkify
This plugin converts text into links based on regular expressions.

## How to Use
- Go to the *Options* page for Linkify.
- Click on the "Add New Link" button.
- In the first text box, enter a regular expression.
	- The regular expression may include capturing parentheses.
- In the second text box, write the URL you want the text to link to.
	- The URL may include regular expression replacement patterns (e.g. `$1`).[^1]
- Close the *Options* page.

[^1]: The syntax for the replacment patterns follows [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter).

Now, all text that matches the regular expression will be highlighted as though they were links in *Live Preview* mode, and clicking on the text will open the link in a browser.

*The underlying text is not modified. This plugin makes no changes to your `.md` files.*

For example, if the regular expression is `@(\w+)` and the link is `http://twitter.com/$1`, then any occurrence of `@obsdmd` in your notes will link to `http://twitter.com/obsdmd`, and the same is true for any other Twitter handle preceded by a `@`.

You can have multiple regex-link entries. Each one is applied independently.

By default, the plugin starts with two entries as examples:

1. `g/<text>` will link to `http://google.com/search?q=<text>`
2. `@<name>` will link to `http://twitter.com/<name>`

You can delete an entry by clicking on the trash can icon to the right of the entry.
