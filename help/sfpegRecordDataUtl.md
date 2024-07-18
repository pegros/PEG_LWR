# ![Logo](/media/Logo.png) &nbsp; SFPEG Record Data Utility

## Introduction

For performance reasons, especially when using conditional display, it may be 
better to load record data right from the initial rendering of a site record page.

By default, when using a condition on a field to display a component using other
fields, only the field used in the condition is indeed loaded upon initial rendering 
of the page and a second record data fetch may be required to load additional
data for display/interaction on the final component.

It has no actual display on the site pages.


## Site Builder Configuration

The **sfpegRecordDataUtl** may be set anywhere  on the page out of
any conditional display section.

All its configuration is done in Site Builder through the following 
properties:
* `Object API Name` for the API Name of Object for data load (usually current page object, but may be User).
* `Record ID` for the ID of Record for data load (usually current record but may be current User). urrent User ID is used if no data is provided.
* `Field List` with a JSON list of field API Names to be loaded, e.g. `["InformationsComplementaires__c","Management__c"]`
* `Show Debug?` to activate debug mode on the component.


## Technical Details

It relies on the standard **[getRecord](https://developer.salesforce.com/docs/platform/lwc/guide/reference-wire-adapters-record.html)** wire service to fetch the 
configured data.