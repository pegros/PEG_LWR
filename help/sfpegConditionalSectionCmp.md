# ![Logo](/media/Logo.png) &nbsp; SF PEG Conditional Container (Boolean SF PEG Merge)

## Introduction

The **sfpegConditionalSectionCmp** container component has a similar behaviour and purpose
as the **[Conditional Layout](/help/sfpegConditionalLayout.md)** component but leverages
the **[sfpegMergeUtl](https://github.com/pegros/PEG_LIST/blob/master/help/sfpegMergeUtl.md)**
utility of the **[PEG_LIST](https://github.com/pegros/PEG_LIST)** package to evaluate 
possibly complex display conditions for a section containing configurable components.


## Site Builder Configuration

All the configuration is achieved from Site Builder, the following properties 
being available:
* `Force Complete Display?` to force the display of all sections (for Site Builder
configuration to define/display the components for both true and false cases)
* `Condition` to provide the condition to evaluate leveraging the syntax of the  
**[sfpegMergeUtl](https://github.com/pegros/PEG_LIST/blob/master/help/sfpegMergeUtl.md)**
utility. When the formula evaluates to `true`, the main section is displayed. 
* `Show Default?` to activate default section when condition not met. When set to false,
the only section displayed is when the condition is met.
* `Wrapping CSS` to specify CSS classes on each section div (i.e. OK vs KO sections when applicable)
* `Show Debug?` to activate debug information
* `Object API Name` to provide the API Name of the Object used as current record
for the `{{{RCD.xxx}}}` or `{{{GEN.objectApiName}}}` tokens of the **[sfpegMergeUtl](https://github.com/pegros/PEG_LIST/blob/master/help/sfpegMergeUtl.md)** utility
* `Record ID` to provide the ID of the current record for the `{{{RCD.xxx}}}` or
`{{{GEN.recordId}}}` tokens of the **[sfpegMergeUtl](https://github.com/pegros/PEG_LIST/blob/master/help/sfpegMergeUtl.md)** utility


A simple use case is to display a section (or another) based on the assignment
of a custom permission to the current User. This may be achieved by simply 
using the following `Condition`: 
```
{{{PERM.CustomPermissionName}}}
```

More complex conditions may be defined by combining many conditions with
token merge values. The resulting text string should be compatible with a
standard `eval()` javascript statement.

When displayed in Site Builder (even in _preview_ mode),
* information boxes are systematically displayed in stripped shaded SLDS theme to tell the user
about the location of the **Conditional Container** component and its conditions.
* one or two drop sections are proposed to add and configure the components to display when the
condition is met (or when it is not).


## Technical Details

This component supports two layout slots as for **[LWR Layout Components](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/get_started_layout.htm)** to define and configure
the components respectively for the different criterias cases.
* The invalid case section is displayed if and only if the `Show Default?` property is set to `true`
(and if the condition is not met).
* By setting the `Force Complete Display?` property to `true`, it is possible to systematically
display all sections and the default section if `Show Default?` is true, which may be
helpful to get a holistic view of the components configured.

⚠️ Beware to uncheck the `Force Complete Display?` before publishing the site!

Please refer to **[sfpegMergeUtl](https://github.com/pegros/PEG_LIST/blob/master/help/sfpegMergeUtl.md)** utility for details about the available tokens for condition
contextualisation.