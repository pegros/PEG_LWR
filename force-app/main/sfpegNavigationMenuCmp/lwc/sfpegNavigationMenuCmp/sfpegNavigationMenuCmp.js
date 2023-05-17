/***
* @author P-E GROS
* @date   Feb 2023
* @description  LWC Component to a navigation menu of an Experience Site
*               in various formats (tabs, horizontal link list...)
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
import { NavigationMixin } from 'lightning/navigation';
import getMenuItems from '@salesforce/apex/sfpegNavigationMenu_CTL.getMenuItems';


export default class SfpegNavigationMenuCmp extends NavigationMixin(LightningElement) {

    //----------------------------------------------------------------
    // Main configuration fields (for Site Builder)
    //----------------------------------------------------------------
    @api navLabel;              // Navigation menu master label
    @api displayMode = 'tabs';  // Navigation display mode (tabs, links)
    @api currentTab;            // Current Tab label (when tabs mode is used)
    @api showHome = false;      // Flag to incude the home entry or not
    @api wrapperClass;          // CSS class for the wrapping container ('slds-align_absolute-center')

    @api isDebug = false;       // Flag to activate debug information

    //----------------------------------------------------------------
    // Internal Initialization Parameters
    //----------------------------------------------------------------
    menuItems = [];
    errorMessage = null;

    //----------------------------------------------------------------
    // Custom UI Display getters
    //----------------------------------------------------------------
    get isTabset() {
        return (this.displayMode === 'tabs');
    }
    get isHList() {
        return (this.displayMode === 'links');
    }
    get menuItemsString() {
        return JSON.stringify(this.menuItems);
    }
    
    
    //----------------------------------------------------------------
    // Component initialisation  
    //----------------------------------------------------------------      
    connectedCallback() {
        if (this.isDebug) console.log('connected: START NavigationMenu ',this.navLabel);
        if (this.isDebug) console.log('connected: showHome? ',this.showHome);
        if (this.isDebug) console.log('connected: END NavigationMenu');
    }

    @wire(getMenuItems, { navLabel: '$navLabel', showHome: '$showHome' })
    wiredMenu({ error, data }) {
        if (this.isDebug) console.log('wiredMenu: START for ',this.navLabel);
        if (data) {
            if (this.isDebug) console.log('wiredMenu: data  received ', JSON.stringify(data));

            if ((this.displayMode === 'tabs') && (this.currentTab)) {
                if (this.isDebug) console.log('wiredMenu: looking for currentTab ',this.currentTab);
                const defaultItem = data.find(item => item.label === this.currentTab);
                if (defaultItem) {
                    if (this.isDebug) console.log('wiredMenu: END / using data as menuItems');
                    this.menuItems = data;
                }
                else {
                    let menuItems = [...data];
                    menuItems.push({id:"additional",label:this.currentTab});
                    this.menuItems = menuItems;
                    if (this.isDebug) console.log('wiredMenu: END / using data with additional currentTab ',this.menuItems);
                }
            }
            else {
                if (this.isDebug) console.log('wiredMenu: END / using data as menuItems');
                this.menuItems = data;
            }
            this.errorMessage = null;
        }
        else if (error) {
            if (this.isDebug) console.warn('wiredMenu: END KO / error  received ', JSON.stringify(error));
            this.errorMessage = error;
            this.menuItems = [];
        }
        else {
            if (this.isDebug) console.log('wiredMenu: END / no response');
        }
    }

    renderedCallback() {
        if (this.isDebug) console.log('rendered: START NavigationMenu ',this.navLabel);
        if (this.isDebug) console.log('rendered: menuItems fetched ',JSON.stringify(this.menuItems));
        if (this.isDebug) console.log('rendered: END NavigationMenu');
    }

    //----------------------------------------------------------------
    // Event handling  
    //----------------------------------------------------------------      
    handleTabActive(event) {
        if (this.isDebug) console.log('handleTabActive: START NavigationMenu ',this.navLabel);
        if (this.isDebug) console.log('handleTabActive: event received ',event);
        event.stopPropagation();
        event.preventDefault();

        let selectedTab = event.target.value;
        if (this.isDebug) console.log('handleTabActive: selectedTab identified ',selectedTab);

        if ((this.currentTab) && (selectedTab === this.currentTab)) {
            if (this.isDebug) console.log('handleTabActive: END NavigationMenu / ignoring selection of current tab');
            return;
        }
        
        const selectedItem = this.menuItems.find(item => item.label === selectedTab);
        if (this.isDebug) console.log('handleTabActive: selectedItem found ',JSON.stringify(selectedItem));

        const pageRef = {
            type: 'standard__webPage',
            attributes: {
                url: selectedItem.actionValue
            }
        };
        if (this.isDebug) console.log('handleTabActive: pageRef prepared ',JSON.stringify(pageRef));

        this[NavigationMixin.Navigate](pageRef);
        if (this.isDebug) console.log('handleTabActive: END NavigationMenu / Navigation triggered');
    }
    handleLinkClick(event){
        if (this.isDebug) console.log('handleLinkClick: START NavigationMenu ',this.navLabel);
        if (this.isDebug) console.log('handleLinkClick: event received ',event);
        event.stopPropagation();
        event.preventDefault();

        //if (this.isDebug) console.log('handleLinkClick: event target ',event.target);
        //if (this.isDebug) console.log('handleLinkClick: event target value ',event.target.getAttribute('data-value'));
        const selectedLink = event.target.dataset.value;
        if (this.isDebug) console.log('handleLinkClick: selectedLink identified ',selectedLink);

        const selectedItem = this.menuItems.find(item => item.label === selectedLink);
        if (this.isDebug) console.log('handleLinkClick: selectedItem found ',JSON.stringify(selectedItem));

        const pageRef = {
            type: 'standard__webPage',
            attributes: {
                url: selectedItem.actionValue
            }
        };
        if (this.isDebug) console.log('handleLinkClick: pageRef prepared ',JSON.stringify(pageRef));

        this[NavigationMixin.Navigate](pageRef);
        if (this.isDebug) console.log('handleLinkClick: END NavigationMenu / Navigation triggered');
    }
}