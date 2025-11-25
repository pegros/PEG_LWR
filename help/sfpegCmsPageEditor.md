# ![Logo](/media/Logo.png) &nbsp; CMS Page Editor

## Introduction

This CMS Content Edition plugin component helps editing a custom `sfpegPage` CMS ContentType
especially its somewhat technical fields:
* icon name selection out of a static resource (instead of having to clone them as CMS images).
* selection and ordering of references to other `sfpegPage` CMS contents,
* definition and ordering of links to both internal and external targets (navigation to internal
links being executed in the current browser tab and all links having customisable titles).

![CMS Page Editor](/media/sfpegCmsPageEditor.png)

ℹ️ The component also automatically initiates the `Target` property of the `sfpegPage` CMS ContentType
with the [page reference](https://developer.salesforce.com/docs/platform/lwc/guide/reference-page-reference-type.html)
to the content record (to have it available for navigation
[LWR bindings](https://help.salesforce.com/s/articleView?id=experience.networks_data_binding.htm)).

⚠️ The component only works for `sfpegPage` CMS ContentType provided as part of the package.


## Component Display

### `sfpegPage` CMS ContentType Structure

The `sfpegPage` CMS custom ContentType enables to manage a hierarchy of _pages_ with 
structured summary and detail data.

It supports the following properties:
* standard `Title`, `API Name`and `Content Slug` fields mainly for CMS Edition purposes
* Summary information
    * a `Headline` to be used as title of the page on the site
    * an `Icon` (name) selected from a common static resource used on the site
    * a standard text `Summary` to be usually used in CMS content lists or in page header
    * a `Target` providing a standard site page reference to the current article
* Main editorial content
    * an `Image` (CMS Image) to be used as banner or background
    * a richtext `Description`
    * a `Related Pages` to define the `sfpegPage` records related to the current record
    (as a stringified list of ContentKeys)
    * a `Links` to define the internal or external links for the current record
    (as a stringified list of `{"label":"...","title":"...","url":"...","target":"..."}` JSON link objects)
    * a `Display Variant` to be able to implement different layouts of **sfpegPage** Contents via 
    conditionnal display (see dedicated **PEG_LWR** components)

ℹ️ The `Related Pages` property enables to manage a hierarchy of pages whereas the `Links` property enables to isolate a list of links (and manage them properly from an accessibility perspective, as
links with the `Description` description have no configurable `title` nor `target` properties).


### CMS Content Editor Display

The component appears only when editing a CMS Content in the **Extensions** menu.

![CMS Page Editor Access](/media/sfpegCmsPageEditorClosed.png)

When opening the component on a **sfpegPage** content, it appears in default _read_ mode.

![CMS Page Editor in Read mode](/media/sfpegCmsPageEditor.png)

When clicking on the `edit` button icon of each section (i.e. Icons, Related Pages or Links),
the component switches the corresponding section to _edit_ mode.

![CMS Page Editor in Edit mode](/media/sfpegCmsPageEditorEdit.png)

All modifications done in the component are pushed automatically to the Content being edited
in the standard edit window.

The user then needs to save and possibly publish the changes for them to be actually stored in
database and pushed to the LWR external site.

⚠️ When trying to open the component on a non **sfpegPage** content, an error message
is displayed.

![CMS Page Editor in Error mode](/media/sfpegCmsPageEditorError.png)


## Site Builder Configuration

The component relies on some server side elements for configuration :
* the **sfpegPageSettings** custom setting providing most of the configuration
* a static resource listing available icon names
* a static resource containing all available icon media files

The **sfpegPageSettings** custom setting enables to set most of the properties
used by the component.

![CMS Page Editor Configuration](/media/sfpegCmsPageEditorConfig.png)


### Icons Configuration

#### Icon Media Files

The first part of the Icon configuration consists in giving the component access
to the icon media files.

It assumes there is a static resource containing all available icon media files as
a single gzip archive and possibly reused on the External Site to display them.

The configuration relies on the following properties of the **sfpegPageSettings** custom setting.
* `Icon Files Resource` gives the name of the static resource containing the icon media files
* `Icon Relative Path` gives the relative path of the folder containing the
icon media files within the Icon Files static resource (e.g. `/icons/`)
* `Icon File Extension` gives the extension to apply to the icon name to
get the corresponding media file (e.g. `.svg`)

ℹ️ Icons are then displayed by concatenating the following information
* `Icon Files Resource` URL
* `Icon Relative Path` value
* selected icon name
* `Icon File Extension`


#### Icon Names

The second part of the Icon configuration consists in providing the component 
with the exact list of possible icon names to choose from.

As this list may be long, it has to be provided via a simple JSON static resource
listing all possible names in stringified array, e.g.
```
["Icon #1","Icon #2","Icon #3","Icon #4"]
```

The name of this static resource then needs to be registered in the 
`Icon Names Resource` property of the **sfpegPageSettings** custom setting.


### Display Modes Configuration

The configuration of the Display Modes available for selection in the component
relies on the `Display Variants` property of the **sfpegPageSettings** custom setting.

Its value should be a stringified JSON array of the possible values, e.g.
```
["Mode #1","Mode #2","Mode #3"]
```

This property is optional, no value being available for selection in the component
if not set.


### Custom Setting Configuration Example

With the 2 static resources provided by default for test class execution (i.e.
`sfpegPageEditorTestNames` and `sfpegPageEditorTestIcons`), the following
snapshot provides an example of the **sfpegPageSettings** custom setting configuration.

![Custom Setting Configuration Example](/media/sfpegCmsPageEditorSetupExample.png)


## Technical Details

It leverages all the standard  **[cmsEditorApi](https://developer.salesforce.com/docs/platform/lwc/guide/reference-experience-cms-editor-api.html)** wire services to fetch and update content
data in CMS edition mode.

This LWC component implements the **lightning__CmsEditorExtension** target and thus
does not support any configurable property in its meta file. This is the main reason
why a custom setting was used to configure the component.