/***
* @author P-E GROS
* @date   Dec 2024
* @description  LWC Component to display CMS richtext content with some rework for accessibility in LWR Experience Sites
* @see PEG_LWR package (https://github.com/pegros/PEG_LWR)
*
* Legal Notice
* 
* MIT License
* 
* Copyright (c) 2024 pegros
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
***/

import { LightningElement,api } from 'lwc';
import basePath from "@salesforce/community/basePath";

export default class SfpegCmsRichtextDisplay extends LightningElement {

    //----------------------------------------------------------------
    // Main configuration properties (for Site Builder)
    //----------------------------------------------------------------
    @api contentData;               // Original richtext content to display
    @api contentClass;              // CSS to apply to Content richtext Body

    @api linkTitle;                 // Link default title (e.g. to indicate that a new page is opened for accessibility)
    @api isDebug;                   // Debug activation flag

    //----------------------------------------------------------------
    // Technical properties
    //----------------------------------------------------------------
    content;                // Actual richtext content being displayed


    //----------------------------------------------------------------
    // Component Initialization
    //----------------------------------------------------------------
    connectedCallback() {
        if (this.isDebug) {
            console.log('connected: START Richtext Display with content ',this.contentData);
            console.log('connected: contentClass ', this.contentClass);
            console.log('connected: and linkTitle ', this.linkTitle);
            console.log('connected: END Richtext Display');
        }
    }
    renderedCallback() {
        if (this.isDebug) {
            console.log('rendered: START Richtext Display with content ',this.contentData);
            console.log('rendered: contentClass ', this.contentClass);
            console.log('rendered: and linkTitle ', this.linkTitle);
        }
        this.reworkContent();
        if (this.isDebug) console.log('rendered: END Richtext Display with content ',this.content);
    }

    //-----------------------------------------------------
    // Utilities
    //-----------------------------------------------------
    reworkContent = (srcContent) => {
        if (this.isDebug) console.log('reworkContent: START with ',this.contentData);

        if (!this.contentData || this.content) {
            if (this.isDebug) console.log('reworkContent: END / No rework to do');
            return;
        }

        let contentData = this.contentData;
        // Rework URLs if need be (i.e. when content does not come from bindings
        let prefix = `${basePath}/sfsites/c`;
        let regEx = new RegExp(`(?:${prefix})?(/cms/)`, "g");
        contentData = contentData.replace(regEx, prefix + "$1");
        if (this.isDebug) console.log('reworkContent: urls reworked ',contentData);
            
        // replace div by p
        let divRegEx = new RegExp(`<div([^>]*)>`, "g");
        contentData = contentData.replace(divRegEx, '<p' + "$1" + '>');
        if (this.isDebug) console.log('reworkContent: new div start replaced ',contentData);
        contentData = contentData.replaceAll('</div>','</p>');
        if (this.isDebug) console.log('reworkContent: div end replaced ',contentData);

        // replace <<< and >>> HTML escaped text by < and >
        contentData = contentData.replaceAll('&gt;&gt;&gt;','>');
        if (this.isDebug) console.log('reworkContent: < replaced ',contentData);
        contentData = contentData.replaceAll('&lt;&lt;&lt;','<');
        if (this.isDebug) console.log('reworkContent: > replaced ',contentData);

        // replace xxxx="yyy" HTML escaped text
        let propertyRegEx = new RegExp(`(\\S*)&#61;&#34;(\\S*)&#34;`,"g");
        contentData = contentData.replace(propertyRegEx, "$1" + '="' + "$2" + '"');
        if (this.isDebug) console.log('reworkContent: properties unescaped ',contentData);

        // add titles to all links
        if (this.linkTitle) {
            if (this.isDebug) console.log('reworkContent: setting link titles to ',this.linkTitle);
            let linkRegEx = new RegExp(`<a `,"g");
            contentData = contentData.replace(linkRegEx, '<a ' + ' title="' + this.linkTitle +'" ');
            if (this.isDebug) console.log('reworkContent: link titles added ',contentData);
        }
        this.content = contentData;
        if (this.isDebug) console.log('reworkContent: END with reworked content ',this.content);
    }
}