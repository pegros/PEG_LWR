# ![Logo](/media/Logo.png) &nbsp; SFPEG Content  Display

🚧 This page is still Work In Progress 🚧

## Introduction

This container component provides the ability to display actual richtext of any CMS Content in any page of a site.


## Site Builder Configuration

First select one CMS content from the selector and set the different properties:
* `Show Title?` to choose whether or not display the content title
* `Title Level` to choose the h element level to use for the title (h1, h2...)
* `Title CSS` to add a custom CSS styling class on the title
* `Excerpt Field` to choose a text field to display as content excerpt
* `Excerpt CSS` to add a custom CSS styling class on the excerpt
* `Content Field` to choose a richtext field to display as content body
* `Content CSS` to add a custom CSS styling class on the content body
* `Link Title` to add a default title to all links included in the content body
* `Show Debug?` to activate debug logs

The 3 elements (title, exceprt, body) are optional but displayed in this order.


## Technical Details

It leverages the standard CMS wire **[getContent](https://developer.salesforce.com/docs/platform/lwc/guide/reference-wire-adapters-delivery-get-content.html)** service to fetch content data.

⚠️ The value of the content field is slightly reworked before display:
* CMS media source URLs are reworked to include the site domain (while waiting for Salesforce 
fix for images directly included in the richtext field)
* _div_ HTML elements are replaced by _p_ ones for better structuring in the site
* `&gt;&gt;&gt;` and `&lt;&lt;&lt` seaquences are respectively replaced by `>` and `<`, e.g.to be able to include `<abbr>` or `<span>` elements in the content (for accessibility)
* `xxxx="yyy"` HTML escaped text is unescaped, e.g. to be able to set the language of 
a specific word such as `<span lang="en-GB">cookie</span>` (for accessibility)
