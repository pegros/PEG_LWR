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
import { NavigationMixin } from 'lightning/navigation';

export default class SfpegSkipLinksDsp extends NavigationMixin(LightningElement) {

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
    isSiteBuilder;
    skipLinks = [];     // List of skipLinks to display
    isNotFirst = false; // Track first skiplink usage in current page

    pageRef;
    @wire(CurrentPageReference)
    wiredPage(data){
        if (this.isDebug) console.log('wiredPage: START skipLinks with ',JSON.stringify(data));
        /*if (this.isDebug) console.log('wiredPage: old page ',JSON.stringify(this.pageRef));
        if (this.isDebug) console.log('wiredPage: same page? ',this.pageRef == data);*/
        this.pageRef = data;

        let app = data && data.state && data.state.app;
        if (this.isDebug) console.log('wiredPage: app extracted ',app);
        this.isSiteBuilder = (app === 'commeditor');

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
        
        this.isNotFirst = false;
        if (this.isDebug) console.log('rendered: isNotFirst init ',this.isNotFirst);

        document.body.setAttribute('tabindex','-1');
        document.body.focus();
        document.body.removeAttribute('tabindex');
        if (this.isDebug) console.log('rendered: focus reinitialized ');

        if (this.isDebug) console.log('rendered: END skipLinks');
    }

    disconnectedCallback() {
        if (this.isDebug) console.log('disconnected: START skipLinks');
        //if (this.isDebug) console.log('disconnected: page ref ',JSON.stringify(this.pageRef));
        document.removeEventListener("sfpegAnchorChanges", this.initLinks);
        if (this.isDebug) console.log('disconnected: END skipLinks');
    }

    //----------------------------------------------------------------
    // Event Handlers
    //----------------------------------------------------------------
    
    // workaround implemented as 1st navigation via href does not always work.
    handleClick(event) {
        if (this.isDebug) console.log('handleClick: START skipLinks',event);

        if (this.isNotFirst) {
            if (this.isDebug) console.log('handleClick: END skipLinks / not first skiplinks usage');
            return;
        }
       
        let href = event.srcElement?.href;
        if (this.isDebug) console.log('handleClick: src href',href);

        if (href) {
            if (this.isDebug) console.log('handleClick: scheduling href reopening');
            this.isNotFirst = true;

            setTimeout(() => {
                window.open(href,"_self");
                if (this.isDebug) console.log('handleClick: END skipLinks / 2nd reopen done');
            }, 1000);
            if (this.isDebug) console.log('handleClick: reopening scheduled');
        }
        else {
            console.warn('handleClick: END skiplink / no reopen scheduled');
        }
    }


    //----------------------------------------------------------------
    // Utilities
    //----------------------------------------------------------------

    initLinks = () => { 
        if (this.isDebug) console.log('initLinks: START');
        if (this.isDebug) console.log('initLinks: current skipLinks ',JSON.stringify(this.skipLinks));

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