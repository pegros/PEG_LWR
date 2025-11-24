/***
* @author P-E GROS
* @date   Dec 2024
* @description  LWC Component to display a list of CMS content from a contentKey list via any LWC component.
*               in LWR Experience Sites
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

import { LightningElement, api, wire } from 'lwc';
import siteId from "@salesforce/site/Id";
import { getContents } from "experience/cmsDeliveryApi";

export default class SfpegCmsListDisplay extends LightningElement {

    //---------------------------------------------------
    // Configuration Properties
    //---------------------------------------------------
    // IDs of the contents to display as a stringified JSON list of ContentKeys
    @api
    get contentKeys() {
        return JSON.stringify(this.contentKeyList);
    }
    set contentKeys(value) {
        if (this.isDebug) console.log('set contentKeys on sfpegCmsListDisplay: START with value ',value);
        if (value) {
            try {
                this.contentKeyList = JSON.parse(value);
                if (this.isDebug) console.log('set contentKeys on sfpegCmsListDisplay: END with contentKeyList ',JSON.stringify(this.contentKeyList));
            }
            catch(error) {
                console.error('set contentKeys on sfpegCmsListDisplay: END KO with error ',JSON.stringify(error));
                console.error('set contentKeys on sfpegCmsListDisplay: with provided value ',value);
            }
        }
        else {
            if (this.isDebug) console.log('set contentKeys on sfpegCmsListDisplay: END / no value provided');
        }
    }

    @api displayCmp;    // Name of the LWC used to display the content (as c/lwcName)
    @api displayConfig; // Configuration of the properties to provide to the display component for each content

    @api wrappingCss = 'slds-box slds-theme_shade';
    @api contentCss = 'slds-m-around_small slds-theme_default';

    @api isDebug;       // Debug mode activation

    //---------------------------------------------------
    // Technical Properties
    //---------------------------------------------------
    contentKeyList = []; // JSON parsed contentKeys 
    displayConfigMap;   // JSON parsed displayConfig
    displayConstructor; // constructor for the displayCmp

    contentList;    // Contents raw data fetched
    displayedList;  // Component properties for each content

    //---------------------------------------------------
    // Data Fetch
    //---------------------------------------------------

    @wire(getContents, { channelOrSiteId: siteId, contentKeys: "$contentKeyList", includeContentBody: true })
    wiredContents(result) {
        if (this.isDebug) console.log("wiredContents: START for CMS ListDisplay with #contentKeys ",this.contentKeyList?.length);

        if ((result?.data?.contents) && (this.contentKeyList?.length > 0)) {
            console.log("wiredContents: analysing #contents ",result.data.contents.length);
            this.contentList = result.data.contents;
            console.log("wiredContents: displayConfigMap used ",JSON.stringify(this.displayConfigMap));

            this.displayedList = [];
            this.contentList.forEach(iterContent => {
                console.log("wiredContents: processing content ",JSON.stringify(iterContent));
                let iterDisplay = (this.displayConfigMap?.base ? {... this.displayConfigMap.base} : {});
                console.log("wiredContents: iterDisplay init ",JSON.stringify(iterDisplay));

                for (let iterField in this.displayConfigMap.row) {
                    console.log("wiredContents: processing field ",iterField);
                    iterDisplay[iterField] = this.getFieldValue(this.displayConfigMap.row[iterField],iterContent);
                };
                console.log("wiredContents: iterDisplay finalized ",JSON.stringify(iterDisplay));
                this.displayedList.push({contentKey: iterContent.contentKey,properties: iterDisplay});
            });
            console.log("wiredContents: END with displayedList ",JSON.stringify(this.displayedList));

            /*{
                contentKey : iter.contentKey,
                properties: {
                    cardTitle: iter.title,
                    cardDescription: iter.contentBody?.excerpt,
                    cardStartDetails: iter.contentKey,
                    cardEndDetails: iter.urlName,
                    cardTarget: '{"type": "standard__managedContentPage","attributes" :{"contentTypeName": "news", "contentKey": "' + iter.contentKey + '"}}',
                    isDebug: this.isDebug
            }*/        
        }
        else {
            this.displayedList = null;
            if (this.isDebug) console.log("wiredContents: END with no data ");
        } 
    }

    //---------------------------------------------------
    // Component Initialisation
    //---------------------------------------------------
    connectedCallback() {
        if (this.isDebug) {
            console.log("connected: START for CMS ListDisplay",this.contentKeys);
            console.log("connected: displayCmp ",this.displayCmp);
            console.log("connected: displayConfig ",this.displayConfig);
        }

        try {
            this.displayConfigMap = JSON.parse(this.displayConfig);
            if (this.isDebug) console.log("connected: displayConfig parsed",JSON.stringify(this.displayConfigMap));
        }
        catch(error) {
            console.error("connected: displayConfig parsing failed ",JSON.stringify(error));
            console.error("connected: with input ",this.displayConfig);
        }

        if (this.displayCmp) {
            if (this.isDebug) console.log("connected: importing displayCmp");

            import(this.displayCmp)
            .then(({ default: cmpConstructor }) => {
                if (this.isDebug) console.log("connected: END / component loading OK ",cmpConstructor);
                this.displayConstructor = cmpConstructor;
            })
            .catch((error) => {
                console.error("connected: END KO / component loading failed with error ",JSON.stringify(error));
            });
            if (this.isDebug) console.log("connected: loading component");
        }
        else {
            console.warn("connected: END / no display component specified ");
        }
    }

    //---------------------------------------------------
    // Component Utilities
    //---------------------------------------------------
    getFieldValue = (field,content) => {
        if (content.hasOwnProperty(field)) {
            return content[field];
        }
        else if (content.contentBody?.hasOwnProperty(field)) {
            return content.contentBody[field];
        }
        else {
            return null;
        }
    }
}
