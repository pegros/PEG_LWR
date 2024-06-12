/***
* @author P-E GROS
* @date   June 2024
* @description  LWC Component to set navigation anchors within a LWR Experience Site page to be used
*               by the sfpegSkipLinksDsp component.
* @see sfpegSkipLinksDsp component
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

import { LightningElement,api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class SfpegAnchorDsp extends LightningElement {

    //----------------------------------------------------------------
    // Main configuration properties (for Site Builder)
    //----------------------------------------------------------------
    @api linkName;      // Name of the anchor
    @api linkLabel;     // Label of the Anchor
    @api sendEvent;     // Notification trigger flag upon disconnect
    @api isDebug;       // Debug activation flag

    //----------------------------------------------------------------
    // Technical properties
    //----------------------------------------------------------------
    isSiteBuilder = false;
    @api linkId;

    //----------------------------------------------------------------
    // Custom Getters
    //----------------------------------------------------------------
    get showAnchor() {
        return this.isDebug || this.isSiteBuilder;
    }

    get anchorClass() {
        return (this.showAnchor ? 'slds-box slds-box_x-small slds-m-around_xx-small slds-theme_shade slds-theme_alert-texture' : 'slds-hide');
    }

    //----------------------------------------------------------------
    // Context Initialization
    //----------------------------------------------------------------

    @wire(CurrentPageReference)
    wiredPage(data){
        if (this.isDebug) console.log('wiredPage: START anchor for ',this.linkName);
        if (this.isDebug) console.log('wiredPage: with page ',JSON.stringify(data));

        let app = data && data.state && data.state.app;
        if (this.isDebug) console.log('wiredPage: app extracted ',app);
        this.isSiteBuilder = (app === 'commeditor');

        if (this.isDebug) console.log('wiredPage: END anchor with isSiteBuilder',this.isSiteBuilder);
    };
    
    //----------------------------------------------------------------
    // Component Initialization
    //----------------------------------------------------------------

    connectedCallback(){
        if (this.isDebug) console.log('connected: START with linkName ',this.linkName);
        if (this.isDebug) console.log('connected: END with linkLabel ',this.linkLabel);
    }

    renderedCallback(){
        if (this.isDebug) console.log('rendered: START with linkName ',this.linkName);
        this.linkId = this.linkId || this.refs.linkDiv?.id;
        if (this.isDebug) console.log('rendered: linkId set ',this.linkId);
        if (this.isDebug) console.log('rendered: triggering sfpegAnchorChange event');
        document.dispatchEvent(new CustomEvent("sfpegAnchorChanges", {"detail": {anchor: this.linkId, operation: 'add'}}));
        if (this.isDebug) console.log('rendered: END');
    }

    disconnectedCallback(){
        if (this.isDebug) console.log('disconnected: START with linkName ',this.linkName);
        if (this.sendEvent) {
            if (this.isDebug) console.log('rendered: triggering sfpegAnchorChange event');
            document.dispatchEvent(new CustomEvent("sfpegAnchorChanges", {"detail": {anchor: this.linkId, operation: 'remove'}}));
        }
        if (this.isDebug) console.log('disconnected: END with linkLabel ',this.linkLabel);
    }
}