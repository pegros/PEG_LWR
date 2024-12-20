# ![Logo](/media/Logo.png) &nbsp; SF PEG Conditional Container (Multi-Value)

## Introduction

This  **sfpegConditionalContainerCmp** container component provides up to 1' conditionally
displayed sections (plus one optional default fallback one) in which other components
may be added, leveraging criteria on field values usually on the page record or current User.

![Conditional Container](/media/sfpegConditionalContainerCmp.png)

Multiple sections may be displayed if multiple criteria are met by the field value fetched.
Two criteria evaluation strategies are available:
* for a _multi-picklist_ field, each section should have an individual value criteria and
the section is then displayed if the multi-picklist field value contains this value.
* for a standard _picklist_ (or even text) field, each section should have a sequence
of possible values separated by spaces and the section is then displayed if the picklist
field value is one of them.

ℹ️ There is no constraint on the criteria values and a same value may appear multiple
times in the different criteria (for the standard _picklist_ evaluation strategy)


## Site Builder Configuration

All the configuration is achieved from Site Builder, the following properties 
being available:
* `Force Complete Display?` to force the display of all sections (for Site Builder
configuration to define/display the components for all cases)
* `Source Field` to define the API Name of the field used to evaluate display conditions
* `Multi-Value Source Field?` to indicate that the sourceField is a multi-value (i.e. not
a standard picklist field) and apply the corresponding criteria evaluation strategy (see above)
* `Condition #1` to `Condition #14` to define the reference value(s) for criteria evaluation
for the corresponding section. This may be a list of values separated by blanks in the standard _picklist_
evaluation strategy or a single value  in the _multi-picklist_ one
* `Handle Default?` to activate default section when no prior condition is met. When set to false,
no section is displayed if no criteria is met
* `Wrapping CSS` to specify CSS classes on each section div
* `Show Debug?` to activate debug information
* `Object API Name` to provide the API Name of the Object used to fetch the `Source Field` value
(usually current page object but may also be _User_)
* `Record ID` to provide the ID of the record used to fetch the `Source Field` value
(usually current page record ID but may also be current user ID)


When displayed in Site Builder (even in _preview_ mode),
* information boxes are systematically displayed in stripped shaded SLDS theme to tell the user
about the location of the **Conditional Container (Multi-Value)** component and its conditions.
* up to 15 drop sections are proposed to add and configure the components to display when
any of the 14 conditions or the default fallback one is met.

![Conditional Layout](/media/sfpegConditionalContainerConfig.png)

These elements do not appear in the published LWR external site.


## Technical Details

This component supports two layout slots as for **[LWR Layout Components](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/get_started_layout.htm)** to define and configure
the components respectively for the different criterias cases.
* The invalid case section is displayed if and only if the `Show Default?` property is set to `true`
(and if the condition is not met).
* By setting the `Force Complete Display?` property to `true`, it is possible to systematically
display all sections and the default section if `Show Default?` is true, which may be
helpful to get a holistic view of the components configured.

⚠️ Beware to uncheck the `Force Complete Display?` before publishing the site!

Please refer to **[data binding expressions](https://developer.salesforce.com/docs/atlas.en-us.244.0.exp_cloud_lwr.meta/exp_cloud_lwr/advanced_expressions.htm?q=Data%20Binding)** such as `{!Item.contentBody.body}` for details about how to configure the current value.