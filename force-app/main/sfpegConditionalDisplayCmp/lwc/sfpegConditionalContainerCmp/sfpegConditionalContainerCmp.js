/***
* @author P-E GROS
* @date   Jan 2023
* @description  LWC Component to provide conditional display sections in LWR Experience Sites
* @see PEG_LIST package (https://github.com/pegros/PEG_MISC)
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
import { getRecord } from 'lightning/uiRecordApi';
import currentUserId from '@salesforce/user/Id';

/**
 * @slot section1
 * @slot section2
 * @slot section3
 * @slot section4
 * @slot section5
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

    //----------------------------------------------------------------
    // Custom Getters
    //----------------------------------------------------------------
    /*get containerClass() {
        return (this.forceDisplay ? 'slds-p-around_xx-small' :'');
    }*/

    //----------------------------------------------------------------
    // Component Initialisation
    //----------------------------------------------------------------

    connectedCallback() {
        if (this.isDebug) console.log('connected: START');

        this.showSection = {
            s1:this.forceDisplay,
            s2:this.forceDisplay,
            s3:this.forceDisplay,
            s4:this.forceDisplay,
            s5:this.forceDisplay,
            default:this.forceDisplay
        };  
        if (this.isDebug) console.log('connected: showSection init ', JSON.stringify(this.showSection));

        this.recordId = this.recordId || currentUserId;
        if (this.isDebug) console.log('connected: recordId reset ', this.recordId);

        this.field2fetch = this.objectApiName + '.' + this.sourceField;
        if (this.isDebug) console.log('connected: field2fetch init ', this.field2fetch);

        if (this.isDebug) console.log('connected: END');
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
                    let fieldValues = fieldValue.split(';') || [];
                    if (this.isDebug) console.log('wiredRecord: fieldValues split',fieldValues);

                    showSection.s1 = (this.list1 ? fieldValues.includes(this.list1) : false);
                    showSection.s2 = (this.list2 ? fieldValues.includes(this.list2) : false);
                    showSection.s3 = (this.list3 ? fieldValues.includes(this.list3) : false);
                    showSection.s4 = (this.list4 ? fieldValues.includes(this.list4) : false);
                    showSection.s5 = (this.list5 ? fieldValues.includes(this.list5) : false);
                }
                else {
                    if (this.isDebug) console.log('wiredRecord: handling non multi-value field');
                    showSection.s1 = this.list1?.includes(fieldValue);
                    showSection.s2 = this.list2?.includes(fieldValue);
                    showSection.s3 = this.list3?.includes(fieldValue);
                    showSection.s4 = this.list4?.includes(fieldValue);
                    showSection.s5 = this.list5?.includes(fieldValue);
                }
                if ((this.hasDefault) && !(showSection.s1 || showSection.s2 || showSection.s3 || showSection.s4 || showSection.s5)){
                    showSection.default = true;
                } 
                this.showSection = showSection;
                if (this.isDebug) console.log('wiredRecord: showSection updated ', JSON.stringify(this.showSection));
            }
        }
        else if (error) {
            console.warn('wiredRecord: error returned ',error);
            this.errorMessage = JSON.stringify(error);
        }
        else {
            console.warn('wiredRecord: nothing returned');
        }

        if (this.isDebug) console.log('wiredRecord: END');
    }

   /* @wire(getObjectInfo, { objectApiName: "$objectApiName" })
    wiredObject({ error, data }) {
        if (this.isDebug) console.log('wiredObject: START');

        if (this.isDebug) console.log('wiredObject: data ', JSON.stringify(data));
        if (this.isDebug) console.log('wiredObject: erro ', JSON.stringify(error));

        if (this.isDebug) console.log('wiredObject: END');
    }
    */

}