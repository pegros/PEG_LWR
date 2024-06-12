/***
* @author P-E GROS
* @date   Jan 2023
* @description  LWC Component to provide conditional display sections in LWR Experience Sites
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

import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import currentUserId from '@salesforce/user/Id';

/**
 * @slot section1
 * @slot section2
 * @slot section3
 * @slot section4
 * @slot section5
 * @slot section6
 * @slot section7
 * @slot section8
 * @slot section9
 * @slot section10
 * @slot section11
 * @slot section12
 * @slot section13
 * @slot section14
 * @slot defaultSection
 */

export default class SfpegConditionalContainerCmp extends LightningElement {

    //----------------------------------------------------------------
    // Configuration Parameters
    //----------------------------------------------------------------
    @api sourceField;           // Field to use for display condition evaluation
    @api isMvField = false;     // Flag to indicate that the sourceField is a multi-value

    @api list1;                 // set of possible field values for section 1
    @api list2;                 // set of possible field values for section 2
    @api list3;                 // set of possible field values for section 3
    @api list4;                 // set of possible field values for section 4
    @api list5;                 // set of possible field values for section 5
    @api list6;                 // set of possible field values for section 6
    @api list7;                 // set of possible field values for section 7
    @api list8;                 // set of possible field values for section 8
    @api list9;                 // set of possible field values for section 9
    @api list10;                // set of possible field values for section 10
    @api list11;                // set of possible field values for section 11
    @api list12;                // set of possible field values for section 12
    @api list13;                // set of possible field values for section 13
    @api list14;                // set of possible field values for section 14

    @api hasDefault;            // Flag to activate default section
    @api wrappingClass;         // CSS classes to wrap each section

    @api objectApiName;         // Object API Name for current page record (if any)
    @api recordId;              // ID of current page record (if any)

    @api forceDisplay = false;  // Flag to bypass condition evaluation and display all sections (for Builder configuration)

    @api isDebug;               // debug activation

    //----------------------------------------------------------------
    // Internal Parameters
    //----------------------------------------------------------------
    showSection = {};
    field2fetch;        
    errorMessage;               // Initialisation Error Message
    isSiteBuilder = false;

    //----------------------------------------------------------------
    // Custom Getters
    //----------------------------------------------------------------
    get showSectionTitle() {
        return (this.isSiteBuilder || this.forceDisplay);
    }

    //----------------------------------------------------------------
    // Context Fetch
    //----------------------------------------------------------------

    // Current page Data 
    @wire(CurrentPageReference)
    wiredPage(data){
        if (this.isDebug) console.log('wiredPage: START conditional container for ',this.sourceField);
        if (this.isDebug) console.log('wiredPage: with page ',JSON.stringify(data));

        let app = data && data.state && data.state.app;
        if (this.isDebug) console.log('wiredPage: app extracted ',app);
        this.isSiteBuilder = (app === 'commeditor');

        if (this.isDebug) console.log('wiredPage: END conditional container with isSiteBuilder',this.isSiteBuilder);
    };

    //----------------------------------------------------------------
    // Component Initialisation
    //----------------------------------------------------------------

    connectedCallback() {
        if (this.isDebug) console.log('connected: START ConditionalContainer');

        this.showSection = {
            s1:this.forceDisplay,
            s2:this.forceDisplay,
            s3:this.forceDisplay,
            s4:this.forceDisplay,
            s5:this.forceDisplay,
            s6:this.forceDisplay,
            s7:this.forceDisplay,
            s8:this.forceDisplay,
            s9:this.forceDisplay,
            s10:this.forceDisplay,
            s11:this.forceDisplay,
            s12:this.forceDisplay,
            s13:this.forceDisplay,
            s14:this.forceDisplay,
            default:this.forceDisplay
        };  
        if (this.isDebug) console.log('connected: showSection init ', JSON.stringify(this.showSection));

        this.recordId = this.recordId || currentUserId;
        if (this.isDebug) console.log('connected: recordId reset ', this.recordId);

        if ((this.objectApiName) && (this.sourceField)) {
            this.field2fetch = this.objectApiName + '.' + this.sourceField;
            if (this.isDebug) console.log('connected: field2fetch init ', this.field2fetch);
        }
        else {
            console.warn('connected: missing objectApiName or sourceField');
        }

        if (this.isDebug) console.log('connected: END ConditionalContainer');
    }

    @wire(getRecord, { "recordId": '$recordId', "fields": '$field2fetch' })
    wiredRecord({ error, data }) {
        if (this.isDebug) console.log('wiredRecord: START');

        if (data) {
            if (this.isDebug) console.log('wiredRecord: data ', JSON.stringify(data));

            if (!this.forceDisplay) {
                let fieldValue;
                if (this.sourceField.includes('.')) {
                    let fieldParts = this.sourceField.split('.');
                    if (this.isDebug) console.log('wiredRecord: getting complex sourceField value ', fieldParts);
                    fieldValue = data;
                    fieldParts.forEach(iter => {
                        fieldValue = fieldValue?.fields[iter]?.value;
                    });
                }
                else {
                    if (this.isDebug) console.log('wiredRecord: getting simple sourceField value ', this.sourceField);
                    fieldValue = data.fields[this.sourceField]?.value;
                }
                if (this.isDebug) console.log('wiredRecord: fieldValue extracted ', fieldValue);

                let showSection = {default: false};
                if (this.isMvField) {
                    if (this.isDebug) console.log('wiredRecord: handling multi-value field');
                    let fieldValues = fieldValue?.split(';') || [];
                    if (this.isDebug) console.log('wiredRecord: fieldValues split',fieldValues);

                    showSection.s1 = (this.list1 ? fieldValues.includes(this.list1) : false);
                    showSection.s2 = (this.list2 ? fieldValues.includes(this.list2) : false);
                    showSection.s3 = (this.list3 ? fieldValues.includes(this.list3) : false);
                    showSection.s4 = (this.list4 ? fieldValues.includes(this.list4) : false);
                    showSection.s5 = (this.list5 ? fieldValues.includes(this.list5) : false);
                    showSection.s6 = (this.list6 ? fieldValues.includes(this.list6) : false);
                    showSection.s7 = (this.list7 ? fieldValues.includes(this.list7) : false);
                    showSection.s8 = (this.list8 ? fieldValues.includes(this.list8) : false);
                    showSection.s9 = (this.list9 ? fieldValues.includes(this.list9) : false);
                    showSection.s10 = (this.list10 ? fieldValues.includes(this.list10) : false);
                    showSection.s11 = (this.list10 ? fieldValues.includes(this.list11) : false);
                    showSection.s12 = (this.list10 ? fieldValues.includes(this.list12) : false);
                    showSection.s13 = (this.list10 ? fieldValues.includes(this.list13) : false);
                    showSection.s14 = (this.list10 ? fieldValues.includes(this.list14) : false);
                }
                else {
                    if (this.isDebug) console.log('wiredRecord: handling non multi-value field');
                    showSection.s1 = this.list1?.includes(fieldValue);
                    showSection.s2 = this.list2?.includes(fieldValue);
                    showSection.s3 = this.list3?.includes(fieldValue);
                    showSection.s4 = this.list4?.includes(fieldValue);
                    showSection.s5 = this.list5?.includes(fieldValue);
                    showSection.s6 = this.list6?.includes(fieldValue);
                    showSection.s7 = this.list7?.includes(fieldValue);
                    showSection.s8 = this.list8?.includes(fieldValue);
                    showSection.s9 = this.list9?.includes(fieldValue);
                    showSection.s10 = this.list10?.includes(fieldValue);
                    showSection.s11 = this.list11?.includes(fieldValue);
                    showSection.s12 = this.list12?.includes(fieldValue);
                    showSection.s13 = this.list13?.includes(fieldValue);
                    showSection.s14 = this.list14?.includes(fieldValue);
                }
                if ((this.hasDefault) && !(showSection.s1 || showSection.s2 || showSection.s3 || showSection.s4 || showSection.s5 || showSection.s6 || showSection.s7 || showSection.s8 || showSection.s9 || showSection.s10 || showSection.s11 || showSection.s12 || showSection.s13 || showSection.s14)){
                    showSection.default = true;
                } 
                this.showSection = showSection;
                if (this.isDebug) console.log('wiredRecord: showSection updated ', JSON.stringify(this.showSection));
            }
        }
        else if (error) {
            console.warn('wiredRecord: error returned ',error);
            this.errorMessage = error.body.message || error.statusText || JSON.stringify(error);
        }
        else {
            console.warn('wiredRecord: nothing returned');
        }

        if (this.isDebug) console.log('wiredRecord: END');
    }

}