# ![Logo](/media/Logo.png) &nbsp; SF PEG Conditional Layout 

## Introduction

This **sfpegConditionalLayout** container component the ability to display
a section (or possibly an alternate one) based on a single condition evaluated 
from page context using a variety of comparison operators. 

![Conditional Layout](/media/sfpegConditionalLayout.png)


## Site Builder Configuration

All the configuration is achieved from Site Builder, the following properties 
being available:
* `Force Complete Display?` to force the display of all sections (for Site Builder
configuration to define/display the components for both true and false cases)
* `Current Value` to provide the current to evaluate the confdition on. It is usually
provided via LWR data bindings (see below).
* `Operator` to define the condition ti apply on the current value, which should be
one of the follwing: _IS TRUE_, _IS FALSE_, _IS BLANK_, _IS NOT BLANK_, _EQUALS_,
_NOT EQUALS_, _IN_, _NOT IN_, _CONTAINS_, _CONTAINS NOT_, _MATCHES_, _MATCHES NOT_
* `Target Value` to define the target value with which the current value should be
compared (if applicable)
* `Show Default?` to activate default section when condition not met. When set to false,
the only section displayed is when the condition is met.
* `Wrapping CSS` to specify CSS classes on each section div (i.e. OK vs KO sections when applicable)
* `Show Debug?` to activate debug information

When displayed in Site Builder (even in _preview_ mode),
* information boxes are systematically displayed in stripped shaded SLDS theme to tell the user
about the location of the **Conditional Layout** component and its conditions.
* one or two drop sections are proposed to add and configure the components to display when the
condition is met (or when it is not).

![Conditional Layout](/media/sfpegConditionalLayoutConfig.png)

These elements do not appear in the published LWR external site.


## Technical Details

This component supports two layout slots as for **LWR Layout Components**(https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/get_started_layout.htm) to define and configure
the components respectively for the valid and invalid condition cases.
* The invalid case section is displayed if and only if the `Show Default?` property is set to `true`
(and if the condition is not met).
* By setting the `Force Complete Display?` property to `true`, it is possible to systematically
display the valid section and the invalid section if `Show Default?` is true, which may be
helpful to get a holistic view of the components configured.

⚠️ Beware to uncheck the `Force Complete Display?` before publishing the site!

Please refer **[data binding expressions](https://developer.salesforce.com/docs/atlas.en-us.244.0.exp_cloud_lwr.meta/exp_cloud_lwr/advanced_expressions.htm?q=Data%20Binding)** such as `{!Item.contentBody.body}` for details about how to configure the current value.