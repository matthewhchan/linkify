# Linkify
This plugin converts text into links based on regular expressions. It will highlight matching text the same way links are and when you click on them, it will open a browser and take you to the URL.

For example, you could make all text that is formatted like a Twitter handle become a link to the corresponding Twitter profile.

<img width="718" alt="image" src="https://user-images.githubusercontent.com/37097379/171535251-9c33087f-8f25-4a4e-8907-b819b61b6262.png">

In the example, clicking on "@obsdmd" would open a browser to http://twitter.com/obsdmd.

Or perhaps you want to make a shortcut for GitHub repos, so that clicking on "gh:user/repo" will link to the GitHub repo for `user/repo`.

<img width="715" alt="image" src="https://user-images.githubusercontent.com/37097379/171542746-de76396e-c31f-41f4-a155-7510688379b5.png">

In this example, clicking on "gh:obsidianmd/obsidian-releases" would open a browser to http://github.com/obsidianmd/obsidian-releases.

The text you want to match and the URL you want it to link to are configured on the *Options* page for the plugin.

_Note: The underlying text is not modified. This plugin makes no changes to your `.md` files._

## Usage
### Add a Link Pattern
To add a link pattern:
- Go to the *Options* page for Linkify.
- Click on the "Add New Link" button.
- In the first text box, enter a regular expression.
- In the second text box, write the URL you want the text to link to.[^1]
- Close the *Options* page.

[^1]: The URL is allowed to include replacement patterns as described in [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter).

Here's what the Linkify *Options* page looks like:

<img width="757" alt="image" src="https://user-images.githubusercontent.com/37097379/171923315-dfad2313-1aa9-49c3-8662-2529ee90bc40.png">

Now, any text that matches the regular expressions will be highlighted as though they were links in *Live Preview* mode, and clicking on the text will open the link in a browser.

For example, if the regular expression is `@(\w+)` and the link is `http://twitter.com/$1`, then any occurrence of `@obsdmd` in your notes will link to http://twitter.com/obsdmd, and the same is true for any other Twitter handle preceded by a `@`.

You can have multiple regex-link entries. Each one is applied independently.

### Delete a Link Pattern
You can delete an entry by clicking on the trash can icon to the right of the entry.

### Default Link Patterns
By default, the plugin starts with two example entries:

1. Text matching `g\/([a-zA-Z.-]*)` will link to `http://google.com/search?q=$1`, e.g. "g/obsidian" will search for "obsidian" on Google.
2. Text matching `@([a-zA-Z]*)` will link to `http://twitter.com/$1`, e.g. "@obsdmd" will open the Obsidian Twitter page.
