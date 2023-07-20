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

/**
 * @slot conditionSection
 * @slot defaultSection
 */

export default class SfpegConditionalContainerCmp extends LightningElement {

    //----------------------------------------------------------------
    // Configuration Parameters
    //----------------------------------------------------------------
    //@api currentValue;          // Field value provided from the page context.
    _currentValue;
    @api 
    get currentValue() {
        return this._currentValue;
    }
    set currentValue(value) {
        if (this.isDebug) console.log('set: currentValue to ',value);
        this._currentValue = value;
        this.evalCondition();
    }
    
    @api operator;              // Comparison operator
    //@api targetValue;           // Target value with which the current value should be compared
    _targetValue;
    @api 
    get targetValue() {
        return this._targetValue;
    }
    set targetValue(value) {
        if (this.isDebug) console.log('set: targetValue to ',value);
        this._targetValue = value;
        this.evalCondition();
    }

    @api hasDefault = false;    // Flag to activate default section

    @api wrappingClass;         // CSS classes to wrap each section

    @api forceDisplay = false;  // Flag to bypass condition evaluation and display all sections (for Builder configuration)

    @api isDebug;               // debug activation

    //----------------------------------------------------------------
    // Internal Parameters
    //----------------------------------------------------------------
    showCondition = false;
    
    //----------------------------------------------------------------
    // Custom Getters
    //----------------------------------------------------------------
    get showDefault() {
        return ((!this.showCondition || this.forceDisplay) && this.hasDefault);
    }

    //----------------------------------------------------------------
    // Component Initialisation
    //----------------------------------------------------------------
    connectedCallback() {
        if (this.isDebug) console.log('connected: START ConditionalLayout');
        if (this.isDebug) console.log('connected: currentValue ',this.currentValue);
        if (this.isDebug) console.log('connected: operator ',this.operator);
        if (this.isDebug) console.log('connected: targetValue ',this.targetValue);
        if (this.isDebug) console.log('connected: hasDefault? ',this.hasDefault);
        if (this.isDebug) console.log('connected: forceDisplay? ',this.forceDisplay);

        this.evalCondition();
        if (this.isDebug) console.log('connected: showCondition init ',this.showCondition);

        if (this.isDebug) console.log('connected: END ConditionalLayout');
    }

    //----------------------------------------------------------------
    // Component Utilities
    //----------------------------------------------------------------
    evalCondition = function() {
        if (this.isDebug) console.log('evalCondition: START with currentValue ',this.currentValue);

        if (this.forceDisplay) {
            this.showCondition = true;
            if (this.isDebug) console.log('evalCondition: END / forceDisplay ');
            return;
        }

        if (this.isDebug) console.log('evalCondition: evaluating operator ',this.operator);
        if (this.isDebug) console.log('evalCondition: current value type ',typeof this.currentValue);
        if (this.isDebug) console.log('evalCondition: target value type ',typeof this.targetValue);
        switch (this.operator) {
            case 'IS TRUE':
                this.showCondition = Boolean(this.currentValue);
                break;
            case 'IS FALSE':
                this.showCondition = !Boolean(this.currentValue);
                break;
            case 'IS BLANK':
                this.showCondition = !Boolean(this.currentValue);
                break;
            case 'IS NOT BLANK':
                this.showCondition = Boolean(this.currentValue);
                break;
            case 'EQUALS':
                this.showCondition = (this.currentValue === this.targetValue);
                break;
            case 'NOT EQUALS':
                this.showCondition = (this.currentValue !== this.targetValue);
                break;
            case 'IN':
                this.showCondition = this.targetValue.split(';').includes(this.currentValue);
                break;
            case 'NOT IN':
                this.showCondition = !(this.targetValue.split(';').includes(this.currentValue));
                break;
            case 'CONTAINS':
                this.showCondition = this.currentValue.split(';').includes(this.targetValue);
                break;
            case 'CONTAINS NOT':
                this.showCondition = !(this.currentValue.split(';').includes(this.targetValue));
                break;
            case 'MATCHES':
                const regex = new RegExp(this.targetValue);
                this.showCondition = regex.test(this.currentValue);
                break;
            case 'MATCHES NOT':
                this.showCondition = !(regex.test(this.currentValue));
                break;
            default:
                this.showCondition = false;  
        }
        if (this.isDebug) console.log('evalCondition: END / showCondition ', this.showCondition);
    }
}