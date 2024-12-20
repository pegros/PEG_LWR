# ![Logo](/media/Logo.png) &nbsp; SFPEG Record Data Utility

## Introduction

For performance reasons, especially when using conditional display, it may be 
better to load record data right from the initial rendering of a site record page.

By default, when using a condition on a field to display a component using other
fields, only the field used in the condition is loaded upon initial rendering 
of the page and a second record data fetch may then be required to load additional
data for display/interaction on the actual component.

The purpose of the **sfpegRecordDataUtl** is to force the loading of field values
in the Lightning Data Service right from the initial rendering of the page (it should
therefore not be put in a conditional display component). It has no actual display
on the site pages, unless in Site Builder (see configuration section).


## Site Builder Configuration

The **sfpegRecordDataUtl** may be set anywhere  on the page out of
any conditional display section.

All its configuration is done in Site Builder through the following 
properties:
* `Object API Name` for the API Name of Object for data load (usually current page
object via `{!Route.objectApiName}` binding, but may be User).
* `Record ID` for the ID of Record for data load (usually current record via
`{!Route.recordId}` binding but may be current User), current User ID being used
if no data is provided.
* `Field List` with a JSON list of field API Names to be loaded, e.g. `["InformationsComplementaires__c","Management__c"]`
* `Show Debug?` to activate debug mode on the component.

When displayed in Site Builder (even in _preview_ mode), an information box is
systematically displayed in stripped shaded SLDS theme to tell the user
about the location of the **Record Data Utility** component and ease access to
its configuration.

![Record Data Utility in Site Builder](/media/sfpegRecordDataUtl.png)


## Technical Details

It relies on the standard **[getRecord](https://developer.salesforce.com/docs/platform/lwc/guide/reference-wire-adapters-record.html)** wire service to fetch the 
configured data.

Please refer **[data binding expressions](https://developer.salesforce.com/docs/atlas.en-us.244.0.exp_cloud_lwr.meta/exp_cloud_lwr/advanced_expressions.htm?q=Data%20Binding)** such as `{!Item.contentBody.body}` for details about how to configure the current object name or record Id.