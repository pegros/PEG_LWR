# ![Logo](/media/Logo.png) &nbsp; CMS Content  Display

## Introduction

This container component provides the ability to display actual richtext of any CMS Content
in any page of a site (i.e. not only in the record pages corresponding to their CMS type).

As an example, it enables to include CMS managed content as header of an object list page
or display 2 or let a few sections of a standard page be managed via CMS.

![CMS Content Display](/media/sfpegCmsContentDisplayCmp.png)


## Component Display

The component basically displays a `title`, a standard text `excerpt` and a richtext `body`
of any CMS Content record selected. The 3 values are optional but displayed in this order
with the ability to:
* define the actual _h_ level of the `title`
* choose CSS classes for the `title`, `excerpt` and `body`

Concerning the richtext `body` property, its richtext value is slightly reworked before display mainly for accessibility purposes. This is achieved via the
**[sfpegCmsRichtextDisplay](/help/sfpegCmsRichtextDisplay.png)** component.


## Site Builder Configuration

The component is entirely configured from Site Builder.

![CMS Content Display Configuration](/media/sfpegCmsContentDisplayConfig.png)

The first operation is to select a CMS content record via the `Add Content` button
in the component configuration popup (this button becoming `Change Content` afterwards).

Then all other properties may be set:
* `Show Title?` to choose whether or not display the default content title
* `Title Field` to choose a text field to display as content title (if `Show Title?` is not checked)
* `Title Level` to choose the h element level to use for the title (h1, h2...)
* `Title CSS` to add a custom CSS styling class on the title
* `Excerpt Field` to choose a text field to display as content excerpt
* `Excerpt CSS` to add a custom CSS styling class on the excerpt
* `Content Field` to choose a richtext field to display as content body
* `Content CSS` to add a custom CSS styling class on the content body
* `Link Title` to add a default title to all links included in the content body
* `Show Debug?` to activate debug logs

The 3 elements (`title`, `excerpt`, `body`) are optional but displayed in this order.


## Technical Details

It leverages the standard CMS wire **[getContent](https://developer.salesforce.com/docs/platform/lwc/guide/reference-wire-adapters-delivery-get-content.html)** service to fetch content data.

It leverages the **[sfpegCmsRichtextDisplay](/help/sfpegCmsRichtextDisplay.png)**
component to rework and display the `Content` value.