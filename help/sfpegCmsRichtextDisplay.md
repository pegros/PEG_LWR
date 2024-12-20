# ![Logo](/media/Logo.png) &nbsp; CMS Richtext  Display

## Introduction

This display component provides the ability to rework any richtext field value 
of any CMS Content before rendering it in a LWR Site in order to better support
accessibility requirements.

![CMS Content Display](/media/sfpegCmsRichTextDisplay.png)


Multiple operations are executed on the richtext content:
* CMS URLs rework
* `<div>` convesion to `<p>` 
* special HTML tags management
* title addition on <a> links


## Content Rework Operations

The component basically displays a reworked version of the source content
edited within the CMS Editor. Multiple operations are executed priori to
actual display.


### CMS URLs Rework

Depending on the way its value has been fetched and provided to the component,
the URLs included in the richtext content (e.g. when including an image) may be:
* internal Lightning ones (e.g. when a parent LWC component uses a CMS wire service)
* proper external site ones (e.g. when leveraging LWR site data bindings such as
`{!Item.contentBody.xxx}`)

As the internal Lightning URLs do not work from external sites, they need to be
slightly reworked leveraging the standard `basePath` wired property. E.g.
```
<img alt="My image alt name" src="/cms/delivery/media/MCPW6MND6N5BH3RDERCQPUI62SPE?channelId=0apAW00000001wz">
```
becomes
```
<img alt="My image alt name" src="/MySiteLWR/sfsites/c/cms/delivery/media/MCPW6MND6N5BH3RDERCQPUI62SPE?channelId=0apAW00000001wz">
```

### Divs Replacement

When editing the content in the CMS Editor, many `div` elements are added
automatically around text sections with no ability to control margins.
Therefore people tend to add many `br` to introduce space between main
sections of their text.

Not only does it not correspond to the CSS styling defined in the experience
site for spacing between main text structuring elements (titles and paragraphs)
but it also does it not meet accessibility requirements.

Therefore all `div` elements are automatically replaced by `p` tags by the component.
E.g.
```
<h2>My content title</h2>
<div>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
</div>
<div>
My list title:
</div>
<ul>
 <li>Item #1</li>
 <li>Item #2</li>
 <li>Item #3</li>
</ul>
```
becomes
```
<h2>My content title</h2>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
</p>
<p>
My list title:
</p>
<ul>
 <li>Item #1</li>
 <li>Item #2</li>
 <li>Item #3</li>
</ul>
```

### Special HTML Tags

When editing the content in the CMS Editor, it is not possible to set various
tags or properties required to meet accessibility requirements:
* we cannot wrap abbreviations within `<abbr>...</abbr>` tags
* we cannot override the default site language for a word or sentence to indicate
the actual language use (via `lang="xxx"` properties)
This is especially important for HTML-to-voice players which otherwise render 
these elements inappropriately.

In order to work around the standard CMS constraints, 2 rework processes have been
implemented:
* replace `&lt;&lt;&lt;` (i.e. `<<<`) and `&gt;&gt;&gt;` (i.e. `>>>`) sequences
respectively by `<` and `>`
* replace `&#61;&#34;....&#34;` patterns by their unescaped value `="...."`

This enables a CMS Content editor to type in the following text
```
Le projet doit assurer le <<<abbr lang="en">>>ROI<<</abbr>>> suivant:
```
and get the proper HTML content on the site
```
Le projet doit assurer le <abbr lang="en">ROI</abbr> suivant:
```
displayed as
```
Le projet doit assurer le ROI suivant:
```


### Default Link Title Addition

When inserting a link in a CMS richtext field, it is only possible to 
define the label and the `href` property.

Some accessibility requirements however require to inform the user that
a new browser tab will be opened if they click on the link.

Therefore all `<a>` tags are reworked to include a default title value. E.g.
```
<a target="_blank" rel="noopener noreferrer noopener noreferrer" href="https://www.google.com">Google</a>
```
becomes
```
<a title="Opening link in a new tab" target="_blank" rel="noopener noreferrer noopener noreferrer" href="https://www.google.com">Google</a>
```
if the `Link Title` property as been set to `Opening link in a new tab` in the 
component configuration (see below).


## Site Builder Configuration

The component is entirely configured from Site Builder.

![CMS Content Display Configuration](/media/sfpegCmsRichTextDisplayConfig.png)


It offers the following configuration properties:
* `Richtext Data` to provide the original richtext content to display (usually
via a `{!Item.contentBody.xxx}` data binding expression such as `{!Item.contentBody.body}`
when displaying a standard **news** content)
* `Content CSS` to add a custom CSS styling class on the content and its wrapping section
* `Link Title` to specify a default title to add to all links included in the content
* `Show Debug?` to activate debug logs


## Technical Details

The output relies on the **[lightning-formatted-rich-text](https://developer.salesforce.com/docs/component-library/bundle/lightning-formatted-rich-text/documentation)** for display.

It supports a double rendering cycle as often the case with **[data binding expressions](https://developer.salesforce.com/docs/atlas.en-us.244.0.exp_cloud_lwr.meta/exp_cloud_lwr/advanced_expressions.htm?q=Data%20Binding)** such as `{!Item.contentBody.body}`.
If no data is provided at the first rendering, it will actually rework the richtext value
when an actual value is provided (i.e. when teh LWR site has fetched it from the server).
