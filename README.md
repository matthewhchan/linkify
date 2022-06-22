# Linkify
This plugin converts text into links based on regular expressions. The regular expressions and link destinations are configurable on the Options page for the plugin.

For example, you could make Twitter handles link to the corresponding Twitter profile.

<img width="715" alt="image" src="https://user-images.githubusercontent.com/37097379/171934159-a8b2b751-1b6b-4b2d-944b-939f3e56d41b.png">

In the example above, clicking on "@obsdmd" would open a browser to http://twitter.com/obsdmd.

Or perhaps you want to make a shortcut for GitHub repos, so that clicking on "gh:user/repo" will link to the GitHub repo for `user/repo`.

<img width="715" alt="image" src="https://user-images.githubusercontent.com/37097379/171542746-de76396e-c31f-41f4-a155-7510688379b5.png">

In this example, clicking on "gh:obsidianmd/obsidian-releases" would open a browser to http://github.com/obsidianmd/obsidian-releases.

The text you want to match and the URL you want it to link to are configured on the Options page for the plugin.

_Note: The underlying text is not modified. This plugin only changes the appearance and functionality of your notes. It makes no changes to your `.md` files._

## Usage
### Add a Link Pattern
To add a link pattern:
- Go to the Options page for Linkify.
- Click on the "Add New Link" button.
- In the first text box, enter a regular expression.
- In the second text box, write the URL you want the text to link to.[^1]
- Close the Options page.

[^1]: The URL is allowed to include replacement patterns as described in [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter).

Here's what the Linkify *Options* page looks like:

<img width="947" alt="image" src="https://user-images.githubusercontent.com/37097379/174934488-bc067504-4844-4697-9099-08c6f61378c5.png">

Now, any text that matches a regular expression will be highlighted as though it were a link in *Live Preview* mode, and clicking on the text will open the link in a browser.

For example, if the regular expression is `@(\w+)` and the link pattern is `http://twitter.com/$1`, then any occurrence of `@obsdmd` in your notes will link to http://twitter.com/obsdmd. The same is true for any other Twitter handle preceded by a `@`.

You can have multiple regex-link entries. Each one is applied independently.

### Delete a Link Pattern
You can delete an entry by clicking on the trash can icon to the right of the entry.

### Default Link Patterns
By default, the plugin starts with three example entries:

1. Text matching `g:([a-zA-Z.-]*)` will link to `http://google.com/search?q=$1`, e.g. clicking on "g:obsidian" will search for "obsidian" on Google.
2. Text matching `gh:([a-zA-Z.-/]*)`will link to `http://github.com/$1`, e.g. clicking on "gh:obsidianmd/obsidian-releases" will open the `obsidianmd/obsidian-releases` Github page.
3. Text matching `@([a-zA-Z]*)` will link to `http://twitter.com/$1`, e.g. clicking on "@obsdmd" will open the Obsidian Twitter page.
