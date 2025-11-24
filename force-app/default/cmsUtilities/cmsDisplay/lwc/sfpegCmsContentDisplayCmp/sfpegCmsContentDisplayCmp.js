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
    @api contentKey;                // ID Key of the CMS content (from selection)
    //@api contentKeyStr;             // ID Key of the CMS content (from text config)

    @api showTitle;                 // Flag to display Content Title
    @api titleField;                // Content Title Field if showTitle is not checked (i.e. standard Title field is used)
    @api titleLevel = 'h2';         // Content Title Level (h1, h2...)
    @api titleClass;                // CSS to apply to Content Title

    @api excerptField = 'excerpt';  // Content Field containing textual Excerpt / Summary
    @api excerptClass;              // CSS to apply to Content Excerpt / Summary

    @api contentField = 'body';     // Content Field containing richtext Body
    @api contentClass;              // CSS to apply to Content richtext Body

    @api linkTitle;                 // Link default title (e.g. to indicate that a new page is opened for accessibility)
    @api isDebug;                   // Debug activation flag

    //----------------------------------------------------------------
    // Internal technical properties (for Site Builder)
    //----------------------------------------------------------------
    //finalContentKey;    // Actual Content Key used (i.e. contentKey or contentKeyStr)
    contentTitle;       // Actual content title fetched from server
    contentExcerpt;     // Actual content excerpt fetched from server
    contentData;        // Actual content body fetched from server

    //----------------------------------------------------------------
    // Custom Getters
    //----------------------------------------------------------------
    get isH1() {
        //if (this.isDebug) console.log('isH1: ',this.titleLevel === 'h1');
        return this.titleLevel === 'h1';
    }
    get isH2() {
        //if (this.isDebug) console.log('isH2: ',this.titleLevel === 'h2');
        return this.titleLevel === 'h2';
    }
    get isH3() {
        //if (this.isDebug) console.log('isH3: ',this.titleLevel === 'h3');
        return this.titleLevel === 'h3';
    }

    //----------------------------------------------------------------
    // Internal technical properties (for Site Builder)
    //----------------------------------------------------------------
    @wire(getContent, { channelOrSiteId: siteId, contentKeyOrId: "$contentKey" })
    wiredContent(result) {
        if (this.isDebug) console.log('wiredContent: START with final key ',this.contentKey);
        if (this.isDebug) console.log('wiredContent: and title? ',this.showTitle);
        if (this.isDebug) console.log('wiredContent: and title field ',this.titleField);
        if (this.isDebug) console.log('wiredContent: and title level ',this.titleLevel);
        if (this.isDebug) console.log('wiredContent: and excerpt field ',this.excerptField);
        if (this.isDebug) console.log('wiredContent: and content field ',this.contentField);

        if (this.isDebug) console.log('wiredContent: data received ',JSON.stringify(result));
        if (result?.data) {
            if (this.isDebug) console.log('wiredContent: analysing content data');
            this.contentTitle = (this.showTitle ? result.data.title : 
                this.titleField ? (result.data.contentBody)[this.titleField] : null);
            if (this.isDebug) console.log('wiredContent: title set to ',this.contentTitle);

            let excerptData = (result.data.contentBody)[this.excerptField];
            if (this.isDebug) console.log('wiredContent: excerpt init ',excerptData);
            // @TODO : START Remove after Summer24 fix
            if (excerptData) {
                let prefix = `${basePath}/sfsites/c`;
                let regEx = new RegExp(`(?:${prefix})?(/cms/)`, "g");
                excerptData = excerptData.replace(regEx, prefix + "$1");
            }
            // @TODO : END Remove after Summer24 fix
            this.contentExcerpt = excerptData;
            if (this.isDebug) console.log('wiredContent: excerpt set to ',this.contentExcerpt);

            this.contentData = (result.data.contentBody)[this.contentField];
            if (this.isDebug) console.log('wiredContent: content set to ',this.contentData);
            if (this.isDebug) console.log('wiredContent: END OK');
        }
        else if (result?.loading) {
            if (this.isDebug) console.log('wiredContent: END / still loading');
        }
        else {
            console.warn('wiredContent: END KO',JSON.stringify(result));
        }
    }

    //----------------------------------------------------------------
    // Component Initialization
    //----------------------------------------------------------------
    connectedCallback() {
        if (this.isDebug) console.log('connected: START with key ',this.contentKey);
        if (this.isDebug) console.log('connected: on site ', siteId);
        if (this.isDebug) console.log('connected: on basePath ', basePath);
        if (this.isDebug) console.log('connected: END');
    }
}