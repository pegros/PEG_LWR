# ![Logo](/media/Logo.png) &nbsp; SFPEG SkipLinks Display

## Introduction

For accessibility reasons, skip links need to be systematically included at the beginning
of each Site page in order to provide direct easy access to the main sections of the page.
The list of links is usually hidden unless its links get focus through tab navigation.
![Skip Links Display](/media/sfpegSkipLinksDsp.png)

Two distinct component are included to support this feature:
* the **sfpegSkipLinksDsp** component to be included as first component of the page header
* the **sfpegAnchorDsp** components to explicitly set anchors in the content of the pages
(or in the header and footer) to be used for in page navigation.

**sfpegAnchorDsp** components never show on the actual page, unless when in **Site Builder** 
application (both in edit / preview modes) in which case they appear systematically as follows. 
![Anchor Display](/media/sfpegAnchorDsp.png)


## Site Builder Configuration

### **sfpegSkipLinksDsp** Configuration

The **sfpegSkipLinksDsp** should be positionned as the first component of the page header.

It has no property to control its behaviour but only provides the styling all its HTML child
elements via CSS classes in the following properties:
* `div CSS` for the wrapping _div_
* `nav CSS` for the main _nav_
* `ul CSS` for the link _ul_ list
* `li CSS` for the individual link _li_ items
* `a CSS` for the actual _a_ links

A few other properties enable to further tune the component:
* `nav Label` to set the _aria-label_ of the _nav_ element.
* `Show Debug?` to activate debug mode on the component.


Default values are provided leveraging the **[SLDS](https://www.lightningdesignsystem.com/)**
design system.

#### **DSFR** Styling

For **[DSFR](https://www.systeme-de-design.gouv.fr/)** design system compliance,
the following values should be used instead:
* `div CSS` : `fr-skiplinks`
* `nav CSS` : `fr-container`
* `nav Label` : `Accès rapide`
* `ul CSS` : `fr-skiplinks__list`
* `li CSS` : empty
* `a CSS` : `fr-link`


### **sfpegAnchorDsp** Configuration

Multiple **sfpegAnchorDsp** components should be positionned in the page above the main 
structuring elements to enable to easily reach the section from the top **sfpegSkipLinksDsp**
link list.

Usually the page _header_ and _footer_ are marked this way, as well as at least one actual
page body component.

For each **sfpegAnchorDsp** instance, the following properties are available:
* `Name`: unique name of the anchor 
* `Label`: label to be used for the corresponding link in the **sfpegSkipLinksDsp** component
* `Send Event?`: notification of component deletion (to enforce **sfpegSkipLinksDsp** link list
reevaluation when navigating to another page; there should be one per page)
* `Show Debug?`: debug mode activation

![Anchor Configuration](/media/sfpegAnchorConfig.png)



## Technical Details

The **sfpegSkipLinksDsp** looks for all **sfpegAnchorDsp** components available in the 
page after rendering to initialize the list of skip links displayed.

**sfpegAnchorDsp** notify **sfpegSkipLinksDsp** via `sfpegAnchorChanges` custom events on the
document when rendered and possibly upon disconnection if the 'Send Event?' flag has been set.

Actual display of the **sfpegSkipLinksDsp** component is managed via simple CSS position change
when focus is within it (via `:focus-within` pseudo class). The list of links is then always
reachable via `tab` navigation. This behaviour is implemented via the `sfpegSkipLinks` CSS
class made available by default for the `divClass` property.
