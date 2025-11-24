/***
* @author P-E GROS
* @date   July 2024
* @description  Technical LWC Component to enforce the loading of record Data in the local browser data 
*               cache for LWR Experience Sites, without showing anything (unless in the Site Builder App).
*               This optimises performances, e.g. when using multiple embedded conditionnal layout components,
*               as all necessary fields are fetched at once right from the initial page display.
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
import { getRecord } from 'lightning/uiRecordApi';
import { CurrentPageReference } from 'lightning/navigation';

export default class SfpegRecordDataUtl extends LightningElement {

    //----------------------------------------------------------------
    // Main configuration properties (for Site Builder)
    //----------------------------------------------------------------
    @api objectApiName;
    @api recordId;
    @api fieldListStr;
    @api isDebug;

    //----------------------------------------------------------------
    // Technical properties
    //----------------------------------------------------------------

    fieldList;
    isSiteBuilder;

    //----------------------------------------------------------------
    // Context fetch
    //----------------------------------------------------------------

    // Current page Data 
    @wire(CurrentPageReference)
    wiredPage(data){
        if (this.isDebug) console.log('wiredPage: START dataload container for ',this.fieldListStr);
        if (this.isDebug) console.log('wiredPage: with page ',JSON.stringify(data));

        let app = data && data.state && data.state.app;
        if (this.isDebug) console.log('wiredPage: app extracted ',app);
        this.isSiteBuilder = (app === 'commeditor');

        if (this.isDebug) console.log('wiredPage: END dataload with isSiteBuilder',this.isSiteBuilder);
    };

    // Record Data 
    @wire(getRecord, { recordId: '$recordId', fields: '$fieldList' })
    wiredData({ error, data }) {
        if (this.isDebug) console.log('wiredData: START for fields ', JSON.stringify(this.fieldList));
        if (data) {
            if (this.isDebug) console.log('wiredData: END / data loaded',JSON.stringify(data));
        }
        else if (error) {
            console.warn('wiredData: END / error received',JSON.stringify(error));
        }
        else {
            if (this.isDebug) console.log('wiredData: END / nothing received');
        }
    }

    //----------------------------------------------------------------
    // Initialization
    //----------------------------------------------------------------

    connectedCallback(){
        if (this.isDebug) console.log('connected: START dataload with fields',this.fieldListStr);
        if (this.isDebug) console.log('connected: and object ',this.objectApiName);
        if (this.isDebug) console.log('connected: and record ',this.recordId);
            
        try {
            let parsedFieldList = JSON.parse(this.fieldListStr);
            if (this.isDebug) console.log('connected: fieldList parsed ',JSON.stringify(parsedFieldList));

            let fieldList = [];
            parsedFieldList.forEach(item => {
                fieldList.push(this.objectApiName + '.' + item);
            });
            if (this.isDebug) console.log('connected: fieldList init ', JSON.stringify(fieldList));
            this.fieldList = fieldList;
        }
        catch (error) {
            console.error('connected: fieldList parsing failed ',JSON.stringify(error));
        }
        if (this.isDebug) console.log('connected: END dataload with fieldList ',JSON.stringify(this.fieldList));

    }
}