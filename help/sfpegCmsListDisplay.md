# ![Logo](/media/Logo.png) &nbsp; CMS Content List Display

## Introduction

This container component provides the ability to display a list of CMS Content records
based on a list of ContentKeys provided as a text field.

![CMS Content List Display](/media/sfpegCmsListDisplay.png)

This enables e.g. to display the list of related pages of a `sfpegPage` CMS Content
record as managed through the [sfpegCmsPageEditor](/help/sfpegCmsPageEditor.md) component. 


## Component Display

The component leverages [dynamic LWC component instantiation](https://developer.salesforce.com/docs/platform/lwc/guide/js-dynamic-components.html) to display each CMS Content record.

The name of the LWC display component as well as the way how its is configured
(leveraging individual CMS Content data) may be configured to fully customize the
actual output of the component.

Only content for valid ContentKeys is displayed in the output (wrong / missing input values
being filtered out).


## Site Builder Configuration

The component is entirely configured from Site Builder.

![CMS Content List Display Configuration](/media/sfpegCmsListDisplayConfig.png)

First select one CMS content from the selector and set the different properties:
* `Content Keys` to provide a list of Content Keys as a stringified JSON array of strings
(e.g. explicitly as `["MCENCLJ5JHPJGUZHVX3YGQRRUJNM","MCI6VHSNL2IJGMPAOX7T4O4PK7UE"]` or via a binding such as `{!Item.contentBody.RelatedPages}`)
* `Display Component` to define the LWC component to use (as `c/myCustomLwcDisplayCmp`)
* `Display Configuration` to provide the configuration applied on the display component
(see below for details)
* `Wrapping Classes` to provide the CSS classes for the main wrapping div
* `Content Classes` to provide the CSS classes for div wrapping each individual record
* `Debug?` to activate debug logs


`Display Configuration` should be provided as a stringified JSON object containinng two main
properties:
* `base` for properties of the display component applied as-is on all CMS Content records
* `row` for properties of the display component set from CMS Content record field values
(the value of each property corresponding to a standard / custom CMS Content field name)

Hereafter is provided an example leveraging the **dsfrCardCmp** component of the **DSFR_LWR**
repository.
```
{
    "base": {
        "isVertical": true,
        "cardCss": "slds-m-around_small slds-theme_default",
        "isDebug": true,
        "areCardLinks": true
    },
    "row": {
        "cardTitle": "Headline",
        "cardDescription": "Summary",
        "cardImage": "Icon",
        "cardButtons": "Links"
    }
}
```


## Technical Details

It leverages the standard CMS wire **[getContents](https://developer.salesforce.com/docs/platform/lwc/guide/reference-wire-adapters-delivery-get-contents.html)** service to fetch content data.
