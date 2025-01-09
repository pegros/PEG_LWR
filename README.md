# ![Logo](/media/Logo.png) &nbsp; SFPEG LWR Components

⚠️ This repository is still Work In Progress 🚧

## Introduction

This package contains a set of standalone LWC components adressing very specific and simple use cases
for the new LWR templates of Experience Sites.

Their configuration is very simple and is done directly from Site Builder (or CMS Content edition page
for enhanced workspaces).

These components were built as contributions/examples for former & ongoing Advisory assignments by 
[Pierre-Emmanuel Gros](https://github.com/pegros). 

They heavily rely on standard Lightning framework features such as the Lightning Data Service (LDS) 
and try to apply as much as possible the LWR specific design tokens or even standard Salesforce
Design System (SLDS) when compatible. 

As much attention as possible has been paid to internationalisation requirements (at least languages),
leveraging standard mechanisms to translate labels, field names, picklist values...


## Package Content

This package provides a set of Site Builder components listed hereafter.
Detailed information about these components (behaviour, configuration guidelines,
technical implementation principles) is available in their dedicated pages.

They are grouped by use case in the repository.


### CMS Content Utilities

This section groups a set of components addressing Salesforce CMS use cases in LWR Sites.

#### [sfpegCmsContentDisplayCmp](/help/sfpegCmsContentDisplayCmp.md)
This container component provides the ability to display actual richtext of any CMS Content
in any page of a site. This enables e.g. to include editorial content within any custom
page while the rest of the page contains predefined data (e.g. filtered list of records).

![CMS Content Display](/media/sfpegCmsContentDisplayCmp.png)

#### [sfpegCmsRichtextDisplay](/help/sfpegCmsRichtextDisplay.md)
This display component provides the ability to rework CMS richtext content 
before actual display to bypass some URL and accessibility issues.

![CMS Richtext Display](/media/sfpegCmsRichTextDisplay.png)

#### [sfpegCmsListDisplay](/help/sfpegCmsListDisplay.md)
This container component provides the ability to display CMS content via any LWC component
for a list of CMS Content identified as a stringified JSON array of ContentKeys.
This is especially useful to display CMS content related to the current CMS content
being displayed (see details of `sfpegPage` custom CMS content below)

![CMS Content List Display](/media/sfpegCmsListDisplay.png)

#### [sfpegCmsPageEditor](/help/sfpegCmsPageEditor.md)
This CMS Content Edition plugin component helps editing a custom `sfpegPage` CMS ContentType
especially its somewhat technical fields (such as page references, internal/external links
and icon names).

![CMS Page Editor](/media/sfpegCmsPageEditor.png)


### Conditional Display Utilities

This section groups a set of components addressing conditional display in LWR Sites.
Standard out of the box conditions indeed leverage only User related conditions
but, most of the times, display conditions include record properties.

All of them provide slots to drop other LWC components depending on the evaluated 
conditions.

#### [sfpegConditionalLayout](/help/sfpegConditionalLayout.md)
This container component the ability to display a section based on a single condition
evaluated from page context using a variety of comparison operators.

![Conditional Layout](/media/sfpegConditionalLayout.png)

#### [sfpegConditionalContainerCmp](/help/sfpegConditionalContainerCmp.md)
This  **sfpegConditionalContainerCmp** container component provides up to 15 conditionaly
displayed zones in which other components may be added, leveraging criteria on field values
of the current record or User provided by standard LWR Data Bindings.

![Conditional Container](/media/sfpegConditionalContainerCmp.png)

#### [sfpegConditionalSectionCmp](/help/sfpegConditionalSectionCmp.md)
This container component the ability to display a section based on a complex conditions
evaluated by leveraging the **[sfpegMergeUtl](https://github.com/pegros/PEG_LIST/blob/master/help/sfpegMergeUtl.md)**
of the **[PEG_LIST](https://github.com/pegros/PEG_LIST)** package.

#### [sfpegRecordDataUtl](/help/sfpegRecordDataUtl.md)
This technical component enables to optimise page rendering performances when
using conditional display. It has no UI output but enables to force the loading
of record data right from the initial rendering of a LWR Site record page (before
the conditions are evaluated and the proper components instantiated)


### Navigation Utilities

This section groups a set of components enabling to leverage Navigation Menus defined
in Experience Site Builder to manage list of links ina LWR Site. 

#### [sfpegNavigationMenuCmp](/help/sfpegNavigationMenuCmp.md)
This component enables to display a navigation menu configured in a LWR Experience Site
as a list of tabs or links.

![Navigation Menu](/media/sfpegNavigationMenuLinks.png)


### Accessibility Management

This section groups a set of components addressing accessibility requirements for 
LWR Experience sites (see [WAI](https://www.w3.org/WAI/standards-guidelines/) or
[WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/)). 

When using Salesforce Lightning base components, many accessibility requirements
are already met (see [SLDS Accessibility](https://www.lightningdesignsystem.com/accessibility/overview/))
but some are more related to page structure and frequire add-ons.


#### [sfpegSkipLinksDsp](/help/sfpegSkipLinksDsp.md)
This component enables to display a skip link section at the top of a LWR Experience Site page
(typically the first component of the page header). It is usually hidden unless it gets focus
via tab navigation. It relies on the **sfpegAnchorDsp** component to get the links to display.

![Skip Links](/media/sfpegSkipLinksDsp.png)

#### [sfpegAnchorDsp](/help/sfpegSkipLinksDsp.md)
This component has no UI output but enables to define a link (label + tag name) within any
page of a LWR Experience Site and notify the **sfpegSkipLinksDsp** component.
This approach is required when working with LWC components in a shadow DOM approach,
as their content is not known to other components.
It also enables to precisely the exact items to include in the skip links component.

![Link Anchors](/media/sfpegAnchorDsp.png)


## Technical Details

### Quick Full Deployment

For a quick and easy deployment, you may use the following deploy button
leveraging the **[GitHub Salesforce Deploy Tool](https://github.com/afawcett/githubsfdeploy)**
implemented by [Andrew Fawcett](https://andyinthecloud.com/2013/09/24/deploy-direct-from-github-to-salesforce/).

To deploy only the whole package to your Org, you may use the following button.

<a href="https://githubsfdeploy.herokuapp.com?ref=master">
  <img alt="Deploy Package to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>


### Unitary Deployment

Components have been grouped by use case and, leveraging the **Salesforce CLI**, it is 
quite easy to deploy the components you actually need via targeted deploy commands
on the proper source sub-folders.

Please refer to the following documentation for help.
* [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
* [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
* [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
* [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
