# ![Logo](/media/Logo.png) &nbsp; SFPEG Navigation Menu

## Introduction

The **sfpegNavigationMenuCmp** component enables to display a navigation menu
configured in a LWR Experience Site as a list of tabs or links.

![Navigation Menu](/media/sfpegNavigationMenuLinks.png)
_Navigation Menu as Links_

When clicking on the tab or link, the user is redirected to the target configured 
on the item of the target menu. Internal links redirect the user to the target
page in the same browser tab whereas external links open a new broser tab.

Multiple display options are available to adapt to various use cases
![Navigation Menu](/media/sfpegNavigationMenuTabs.png)
_Navigation Menu as Tabs_

![Navigation Menu](/media/sfpegNavigationMenuOL.png)
_Navigation Menu as Ordered List_




## Site Builder Configuration

Configuration is completely done in Site Builder but requires 2 successivle steps:
* configuration of the navigation menu
* addition and configuration of the component in the Site page(s)

### Navigation Menu Configuration

All Navigation items types compatible with LWR Sites may be used to define the content
of the navigation menu in Site Builder.

![Navigation Menu](/media/sfpegNavigationMenuConfigMenu.png)
_Standard Navigation Menu Configuration_

⚠️ The site needs to be published once after having configured / modified the Menu
for it to be actually used by the 


### Component Configuration

The following properties are available to configure the component:
* `Navigation Label` to define the label of the Navigation Menu to be used 
* `Display Mode` to choose one of the available Display modes (i.e. _tabs_, _links_, _Vlist_, _Olist_)
* `Current Tab label` to provide the label of the currently selected menu item, when in _tabs_
display mode
* `Link Title Prefix` to define a prefix to the item label to be used as link title, when in
_links_ display mode.
* `Show Home Item?` to display the first _Home_ link of the Navigation Menu
* `Wrapping Class` to specific CSS classes to apply on the wrapping div component
(e.g. for padding around links)
* `List Class` to specific CSS classes to apply on the `ul` or `ol` container
when list mode is used (_VList_ or _OList_)
* `Show Debug?` to activate debug information

The following snapshot provides an example of a **site map** page providing
internal links to the main pages of a LWR External Site.

![Navigation Menu](/media/sfpegNavigationMenuConfig.png)
_Site Map via Navigation Menu as Vertical List_


## Technical Details

⚠️ All navigation menu item types may not be used in LWR External Sites, but the main
site pages and external URLs are available.
