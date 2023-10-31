/***
* @author P-E GROS
* @date   Oct 2023
* @description  LWC Component to provide conditional display sections in LWR Experience Sites
*               based on a sfpegMergeUtl condition (see PEG_LIST package)
* @see PEG_LWR package (https://github.com/pegros/PEG_LWR)
* @see PEG_LIST package (https://github.com/pegros/PEG_LIST)
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
import currentUserId from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import sfpegMergeUtl from 'c/sfpegMergeUtl';

/**
 * @slot conditionSection
 * @slot defaultSection
 */

export default class SfpegConditionalSectionCmp extends LightningElement {

    //----------------------------------------------------------------
    // Configuration Parameters
    //----------------------------------------------------------------
    @api forceDisplay;          // Field value provided from the page context
    @api condition;             // Condition to evaluate leveraging the SF PEG Context Merge Syntax
    @api hasDefault;            // Flag to activate default section when condition not met
    @api isDebug;               // Flag to activate debug information
    @api objectApiName;         // API Name of the current record for the SF PEG Merge context
    @api recordId;              // Record ID of the current record for the SF PEG Merge context

    userId = currentUserId;     // Current user ID from context

    //----------------------------------------------------------------
    // Technical internal Parameters
    //----------------------------------------------------------------
    showCondition = false;
    mergedCondition;
    contextInputs;
    contextData = {};
    userFields;
    userData;
    recordFields;
    recordData;

    //----------------------------------------------------------------
    // Custom Getters
    //----------------------------------------------------------------
    get showCondition() {
        return ((this.showCondition || this.forceDisplay));
    }
    get showDefault() {
        return ((!this.showCondition || this.forceDisplay) && this.hasDefault);
    }
    

    //----------------------------------------------------------------
    // Context Fetch
    //----------------------------------------------------------------

    // Current Record Data 
    @wire(getRecord, { "recordId": '$recordId', "fields": '$recordFields' })
    wiredRecord({ error, data }) {
        if (this.isDebug) console.log('wiredRecord: START for conditional section with ID ', this.recordId);
        if (this.isDebug) console.log('wiredRecord: recordFields ',JSON.stringify(this.recordFields));
        if (data) {
            if (this.isDebug) console.log('wiredRecord: data fetch OK ', JSON.stringify(data));

            sfpegMergeUtl.sfpegMergeUtl.isDebug = this.isDebugFine;
            this.recordData = sfpegMergeUtl.sfpegMergeUtl.convertLdsData(data,this.contextInputs.RCD);
            if (this.isDebug) console.log('wiredRecord: recordData updated ', JSON.stringify(this.recordData));

            //if ((this.configDetails.input.USR) && (!this.userData)) {
            if ((this.userFields) && (!this.userData)) {
                if (this.isDebug) console.log('wiredRecord: END for conditional section / waiting for user LDS fetch');
            }
            else {
                if (this.isDebug) console.log('wiredRecord: END for conditional section / calling merge');
                this.evaluateCondition();
            }
        }
        else if (error) {
            this.recordData = null;
            console.warn('wiredRecord: END for conditional section / data fetch KO ', JSON.stringify(error));
        }
        else {
            if (this.isDebug) console.log('wiredRecord: END for conditional section  / N/A');
        }
    };

    // Current User Data
    @wire(getRecord, { "recordId": '$userId', "fields": '$userFields' })
    wiredUser({ error, data }) {
        if (this.isDebug) console.log('wiredUser: START for conditional section with ID ', this.userId);
        if (this.isDebug) console.log('wiredUser: userFields ',JSON.stringify(this.userFields));
        if (data) {
            if (this.isDebug) console.log('wiredUser: data fetch OK', JSON.stringify(data));

            sfpegMergeUtl.sfpegMergeUtl.isDebug = this.isDebugFine;
            this.userData = sfpegMergeUtl.sfpegMergeUtl.convertLdsData(data,this.contextInputs.USR);
            if (this.isDebug) console.log('wiredUser: userData updated ', JSON.stringify(this.userData));

            //if ((this.configDetails.input.RCD) && (!this.recordData)) {
            if ((this.recordFields) && (!this.recordData)) {
                if (this.isDebug) console.log('wiredUser: END for conditional section / waiting for record LDS fetch');
            }
            else {
                if (this.isDebug) console.log('wiredUser: END for conditional section / calling merge');
                this.evaluateCondition();
            }
        }
        else if (error) {
            this.userData = null;
            console.warn('wiredUser: END for conditional section / data fetch KO ', JSON.stringify(error));
        }
        else {
            if (this.isDebug) console.log('wiredUser: END for conditional section / N/A');
        }
    }

    //----------------------------------------------------------------
    // Component Initialisation
    //----------------------------------------------------------------
    connectedCallback() {
        if (this.isDebug) console.log('connected: START for Conditional Section');
        if (this.isDebug) console.log('connected: condition ',this.condition);
        if (this.isDebug) console.log('connected: objectApiName ',this.objectApiName);
        if (this.isDebug) console.log('connected: recordId ',this.recordId);

        this.contextInputs = sfpegMergeUtl.sfpegMergeUtl.extractTokens(this.condition,this.objectApiName);
        if (this.isDebug) console.log('connected: contextInputs extracted ',JSON.stringify(this.contextInputs));

        let ldsFetchRequired = false;
        if (this.contextInputs.USR) {
            if (this.isDebug) console.log('connected: registering userFields ');
            ldsFetchRequired = true;
            this.contextData.userFields = this.contextInputs.USR.ldsFields;
            this.userFields = this.contextData.userFields;
            if (this.isDebug) console.log('connected: userFields init from config',JSON.stringify(this.userFields));
        }

        if (this.contextInputs.RCD) {
            if (this.isDebug) console.log('connected: registering new recordFields ');
            ldsFetchRequired = true;
            this.contextData.recordFields = {};
            this.contextData.recordFields = this.contextInputs.RCD.ldsFields;
            this.recordFields = this.contextData.recordFields;
            if (this.isDebug) console.log('connected: recordFields init from config',JSON.stringify(this.recordFields));
        }

        if (ldsFetchRequired) {
            if (this.isDebug) console.log('connected: END for Conditional Section / waiting for LDS data fetch');
        }
        else {
            if (this.isDebug) console.log('connected: END for Conditional Section / calling evaluation');
            this.evaluateCondition();
        }
    }


    // Configuration data merge
    evaluateCondition = () => {
        if (this.isDebug) console.log('evaluateCondition: START with ',this.condition);
        if (this.isDebug) console.log('evaluateCondition: userId ',this.userId);
        if (this.isDebug) console.log('evaluateCondition: recordId ',this.recordId);

        sfpegMergeUtl.sfpegMergeUtl.isDebug = this.isDebugFine;
        sfpegMergeUtl.sfpegMergeUtl.mergeTokens(this.condition,this.contextInputs,this.userId,this.userData,this.objectApiName,this.recordId,this.recordData,null,null)
        .then( value => {
            if (this.isDebug) console.log('evaluateCondition: context merged ',value);
            this.mergedCondition = value;

            if (typeof value == "string") {
                this.showCondition = eval(value);
                if (this.isDebug) console.log('evaluateCondition: END evaluating string condition', this.showCondition);
                return;
            }
            this.showCondition = value || false;
            if (this.isDebug) console.log('evaluateCondition: END evaluating boolean condition', this.showCondition);
        }).catch( error => {
            console.warn('evaluateCondition: END KO with ',JSON.stringify(error));
            this.showCondition = false;
            this.mergedCondition = null;
        });

        if (this.isDebug) console.log('evaluateCondition: merge requested ');
    }

}