/***
* @author P-E GROS
* @date   June 2024
* @description  LWC Component to display a skip links section at the top of LWR Experience Site pages
*               for accessibility compliance, leveraging navigation anchors set by sfpegAnchorDsp components.
* @see sfpegAnchorDsp component
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
import { CurrentPageReference } from 'lightning/navigation';

export default class SfpegSkipLinksDsp extends LightningElement {

    //----------------------------------------------------------------
    // Main configuration properties (for Site Builder)
    //----------------------------------------------------------------
    @api divClass;
    @api navClass;
    @api navLabel;
    @api ulClass;
    @api liClass;
    @api aClass;

    @api isDebug;       // Debug activation flag

    //----------------------------------------------------------------
    // Internal technical properties (for Site Builder)
    //----------------------------------------------------------------
    skipLinks = [];     // List of skipLinks to display

    pageRef;
    @wire(CurrentPageReference)
    wiredPage(data){
        if (this.isDebug) console.log('wiredPage: START skipLinks with ',JSON.stringify(data));
        /*if (this.isDebug) console.log('wiredPage: old page ',JSON.stringify(this.pageRef));
        if (this.isDebug) console.log('wiredPage: same page? ',this.pageRef == data);*/
        this.pageRef = data;

        if (this.isDebug) console.log('wiredPage: END skipLinks');
    };

    //----------------------------------------------------------------
    // Component Initialization
    //----------------------------------------------------------------

    connectedCallback() {
        if (this.isDebug) console.log('connected: START skipLinks');
        //if (this.isDebug) console.log('connected: page ref ',JSON.stringify(this.pageRef));
        document.addEventListener("sfpegAnchorChanges", this.initLinks);
        if (this.isDebug) console.log('connected: END skipLinks');
    }

    renderedCallback() {
        if (this.isDebug) console.log('rendered: START skipLinks');
        //if (this.isDebug) console.log('rendered: page ref ',JSON.stringify(this.pageRef));
        if (this.isDebug) console.log('rendered: skipLinks ',JSON.stringify(this.skipLinks));
        if (this.isDebug) console.log('rendered: END skipLinks');
    }

    disconnectedCallback() {
        if (this.isDebug) console.log('disconnected: START skipLinks');
        //if (this.isDebug) console.log('disconnected: page ref ',JSON.stringify(this.pageRef));
        document.removeEventListener("sfpegAnchorChanges", this.initLinks);
        if (this.isDebug) console.log('disconnected: END skipLinks');
    }

    initLinks = () => { 
        if (this.isDebug) console.log('initLinks: START');
        if (this.isDebug) console.log('initLinks: current skipLinks ',JSON.stringify(this.skipLinks));

        /*let titles = document.querySelectorAll('h1');
        if (this.isDebug) console.log('initLinks: titles fetched ',titles);
        if (this.isDebug) console.log('initLinks: #h1 titles fetched ',titles?.length);
        if (titles) {
            titles.forEach(item => {
                if (this.isDebug) console.log('initLinks: h1 title extracted ',item.outerText);
            });
        }
        let titles2 = document.querySelectorAll('h2');
        if (this.isDebug) console.log('initLinks: h2 titles fetched ',titles2);
        if (this.isDebug) console.log('initLinks: #h2 titles fetched ',titles?.length);
        if (titles2) {
            titles2.forEach(item => {
                if (this.isDebug) console.log('initLinks: h2 title extracted ',item.outerText);
            });
        }*/

        let anchors = document.querySelectorAll('c-sfpeg-anchor-dsp');
        if (this.isDebug) console.log('initLinks: anchors fetched ',anchors);
        if (this.isDebug) console.log('initLinks: #anchors fetched ',anchors?.length);

        if (anchors) {
            if (this.isDebug) console.log('initLinks: registering new skiplinks ',JSON.stringify(anchors));
            let newSkipLinks = [];
            anchors.forEach(item => {
                newSkipLinks.push({label:item.linkLabel, name: item.linkName, link:'#' + item.linkId});
            });
            this.skipLinks = newSkipLinks;
            if (this.isDebug) console.log('initLinks: END / skipLinks initialized ',JSON.stringify(this.skipLinks));
        }
        else {
            this.skipLinks = [];
            if (this.isDebug) console.log('initLinks: END / skipLinks reset to empty');
        }
    }
}