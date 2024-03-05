/***
* @author P-E GROS
* @date   Oct 2023
* @description  LWC Component to display CMS content as HTML in any page in LWR Experience Sites
* @see PEG_LWR package (https://github.com/pegros/PEG_LWR)
*
* Legal Notice
* 
* MIT License
* 
* Copyright (c) 2023 pegros
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

import { LightningElement,api,wire } from 'lwc';
import { getContent } from "experience/cmsDeliveryApi";
import siteId from "@salesforce/site/Id";
import basePath from "@salesforce/community/basePath";

export default class SfpegCmsContentDisplayCmp extends LightningElement {

    //----------------------------------------------------------------
    // Main configuration properties (for Site Builder)
    //----------------------------------------------------------------
    @api contentKey;                // ID Key of the CMS content

    @api showTitle;                 // Flag to display Content Title
    @api titleClass;                // CSS to apply to Content Title

    @api excerptField = 'excerpt';  // Content Field containing textual Excerpt / Summary
    @api excerptClass;              // CSS to apply to Content Excerpt / Summary

    @api contentField = 'body';     // Content Field containing richtext Body
    @api contentClass;              // CSS to apply to Content richtext Body

    @api isDebug;                   // Debug activation flag

    //----------------------------------------------------------------
    // Internal technical properties (for Site Builder)
    //----------------------------------------------------------------
    contentTitle;       // Actual content title fetched from server
    contentExcerpt;     // Actual content excerpt fetched from server
    contentData;        // Actual content body fetched from server

    //----------------------------------------------------------------
    // Internal technical properties (for Site Builder)
    //----------------------------------------------------------------
    @wire(getContent, { channelOrSiteId: siteId, contentKeyOrId: "$contentKey" })
    wiredContent(result) {
        if (this.isDebug) console.log('wiredContent: START with key ',this.contentKey);
        if (this.isDebug) console.log('wiredContent: and field ',this.showTitle);
        if (this.isDebug) console.log('wiredContent: and field ',this.excerptField);
        if (this.isDebug) console.log('wiredContent: and field ',this.contentField);
        if (this.isDebug) console.log('wiredContent: data received ',JSON.stringify(result));
        if (result?.data) {
            if (this.isDebug) console.log('wiredContent: analysing content data');
            this.contentTitle = (this.showTitle ? result.data.title : null);
            if (this.isDebug) console.log('wiredContent: title set to ',this.contentTitle);
            this.contentExcerpt = (result.data.contentBody)[this.excerptField];
            if (this.isDebug) console.log('wiredContent: excerpt set to ',this.contentExcerpt);

            let contentData = (result.data.contentBody)[this.contentField];
            // @TODO : START Remove after Summer24 fix
            if (contentData) {
                let prefix = `${basePath}/sfsites/c`;
                let regEx = new RegExp(`(?:${prefix})?(/cms/)`, "g");
                contentData = contentData.replace(regEx, prefix + "$1");
            }
            // @TODO : END Remove after Summer24 fix
            this.contentData = contentData;
            if (this.isDebug) console.log('wiredContent: content set to ',this.contentData);
            if (this.isDebug) console.log('wiredContent: END OK');
        }
        else {
            console.warn('wiredContent: END KO');
        }
    }

    //----------------------------------------------------------------
    // Internal technical properties (for Site Builder)
    //----------------------------------------------------------------
    connnectedCallback() {
        if (this.isDebug) console.log('connected: START with key ',this.contentKey);
        if (this.isDebug) console.log('connected: on site ', siteId);
        if (this.isDebug) console.log('connected: END');
    }
}