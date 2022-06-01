# Linkify
This plugin converts text into links based on regular expressions. It will highlight matching text the same way links are and when you click on them, it will open a browser and take you to the URL.

For example, you could make all text that follows the format of a Twitter handle, e.g. `@obsdmd`, link to the corresponding Twitter profile.

<img width="720" alt="image" src="https://user-images.githubusercontent.com/37097379/171517773-eec42523-5fa7-43c9-aa3d-d5bc4623c36d.png">

In the example in the screenshot, clicking on `@obsdmd` will open a browser to http://www.twitter.com/obsdmd.

Or maybe you want to make a shortcut for GitHub repos, so that `gh:user/repo` will link to the GitHub repo for `user/repo`.

<img width="719" alt="image" src="https://user-images.githubusercontent.com/37097379/171517539-52a918f4-ea89-4112-bd1c-d3aa32e6665a.png">

In the example in the screenshot, clicking on `gh:obsidianmd/obsidian-releases` will open a browser to http://www.github.com/obsidianmd/obsidian-releases.

The text you want to match and the URL you want it to link to are configured on the *Options* page for the plugin.

Note: The underlying text is not modified. This plugin makes no changes to your `.md` files.

## How to Use
### Add a Link Pattern
To add a link pattern:
- Go to the *Options* page for Linkify.
- Click on the "Add New Link" button.
- In the first text box, enter a regular expression.
- In the second text box, write the URL you want the text to link to.[^1]
- Close the *Options* page.

[^1]: The URL is allowed to include replacement patterns as described in [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter).

<img width="996" alt="image" src="https://user-images.githubusercontent.com/37097379/171518552-73ca93d9-2125-4c5e-bf70-ce4f9c0e95ee.png">

Now, any text that matches the regular expression will be highlighted as though they were links in *Live Preview* mode, and clicking on the text will open the link in a browser.

For example, if the regular expression is `@(\w+)` and the link is `http://twitter.com/$1`, then any occurrence of `@obsdmd` in your notes will link to `http://twitter.com/obsdmd`, and the same is true for any other Twitter handle preceded by a `@`.

You can have multiple regex-link entries. Each one is applied independently.

### Default Link Patterns
By default, the plugin starts with two entries as examples:

1. `g/<text>` will link to `http://google.com/search?q=<text>`
2. `@<name>` will link to `http://twitter.com/<name>`

### Delete a Link Pattern
You can delete an entry by clicking on the trash can icon to the right of the entry.
