# ![Logo](/media/Logo.png) &nbsp; SFPEG LWR Components

## Introduction

This package contains a set of standalone LWC components adressing very specific and simple use cases
for the new LWR templates of Experience Sites.

Their configuration is very simple and is done directly from the Site Builder.

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

### [sfpegConditionalDisplayCmp](/help/sfpegConditionalDisplayCmp.md)
This container component provides up to 6 conditionaly displayed zones in which other components
may be added, leveraging criteria on field values of the current record or User.

![Conditional Display](/media/sfpegConditionalDisplayCmp.png)



## Technical Details

The following links may be used to deploy the components more easily.
* [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
* [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
* [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
* [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
