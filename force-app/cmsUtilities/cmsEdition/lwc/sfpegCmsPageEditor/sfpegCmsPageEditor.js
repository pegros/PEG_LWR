/***
* @author P-E GROS
* @date   Dec 2024
* @description  LWC Component to ease the edition of hierarchical page CMS contents (custom content type)
*               in the standard CMS Content edition page for enhanced workspaces (i.e. for LWR Experience Sites)
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

import { LightningElement, wire } from 'lwc';
import { getContext, getContent, updateContent }  from 'experience/cmsEditorApi';

// Custom controllers to fetch additional reference data
import getDisplayVariants from '@salesforce/apex/sfpegCmsPageEditor_CTL.getDisplayVariants';
import getIconNames from '@salesforce/apex/sfpegCmsPageEditor_CTL.getIconNames';
import getIconLink from '@salesforce/apex/sfpegCmsPageEditor_CTL.getIconLink';
import getRelatedPages from '@salesforce/apex/sfpegCmsPageEditor_CTL.getRelatedPages';
import getSpacePages from '@salesforce/apex/sfpegCmsPageEditor_CTL.getSpacePages';

// Custom labels
import COMPONENT_TITLE  from '@salesforce/label/c.sfpegPageEditorTitle';
import COMPONENT_HELP   from '@salesforce/label/c.sfpegPageEditorHelp';
import COMPONENT_ERROR  from '@salesforce/label/c.sfpegPageEditorTypeError';
import SECTION_ICON     from '@salesforce/label/c.sfpegPageEditorIconSection';
import SECTION_VARIANT  from '@salesforce/label/c.sfpegPageEditorVariantSection';
import SECTION_PAGES    from '@salesforce/label/c.sfpegPageEditorPagesSection';
import SECTION_LINKS    from '@salesforce/label/c.sfpegPageEditorLinksSection';
import SELECT_ACTION    from '@salesforce/label/c.sfpegPageEditorSelectLabel';
import ADD_PAGE_ACTION  from '@salesforce/label/c.sfpegPageEditorAddPageLabel';
import EDIT_PAGE_ACTION from '@salesforce/label/c.sfpegPageEditorEditPagesLabel';
import ADD_LINK_ACTION  from '@salesforce/label/c.sfpegPageEditorAddLinkLabel';
import EDIT_LINK_ACTION from '@salesforce/label/c.sfpegPageEditorEditLinksLabel';
import EDIT_TITLE       from '@salesforce/label/c.sfpegPageEditorEditTitle';
import CLOSE_TITLE      from '@salesforce/label/c.sfpegPageEditorCloseTitle';
import ADD_TITLE        from '@salesforce/label/c.sfpegPageEditorAddTitle';
import REMOVE_TITLE     from '@salesforce/label/c.sfpegPageEditorRemoveTitle';
import UP_TITLE         from '@salesforce/label/c.sfpegPageEditorUpTitle';
import DOWN_TITLE       from '@salesforce/label/c.sfpegPageEditorDownTitle';
import LABEL_INPUT      from '@salesforce/label/c.sfpegPageEditorLabelInput';
import TITLE_INPUT      from '@salesforce/label/c.sfpegPageEditorTitleInput';
import URL_INPUT        from '@salesforce/label/c.sfpegPageEditorUrlInput';
import URL_HELP         from '@salesforce/label/c.sfpegPageEditorUrlHelp';



export default class SfpegCmsPageEditor extends LightningElement {

    //------------------------------------------------
    // Component Technical Params
    //------------------------------------------------
    isIconEdit = false;
    isVariantEdit = false;
    isPageEdit = false;
    isLinkEdit = false;
    isEditLinkModalOpen = false;
    selectedLink = { label: '', title: '', url: '', target: '' };
    selectedLinkIndex;

    //------------------------------------------------
    // Custom Labels
    //------------------------------------------------
    lblCmpTitle =   COMPONENT_TITLE;
    lblCmpHelp =    COMPONENT_HELP;
    lblCmpError =   COMPONENT_ERROR;
    lblIcon =       SECTION_ICON;
    lblVariant =    SECTION_VARIANT;
    lblPages =      SECTION_PAGES;
    lblLinks =      SECTION_LINKS;
    lblSelect =     SELECT_ACTION;
    lblAddPage =    ADD_PAGE_ACTION;
    lblManagePages= EDIT_PAGE_ACTION;
    lblAddLink =    ADD_LINK_ACTION;
    lblManageLinks= EDIT_LINK_ACTION;
    lblEdit =       EDIT_TITLE;
    lblClose =      CLOSE_TITLE;
    lblAdd =        ADD_TITLE;
    lblRemove =     REMOVE_TITLE;
    lblUp =         UP_TITLE;
    lblDown =       DOWN_TITLE;
    lblLabel =      LABEL_INPUT;
    lblTitle =      TITLE_INPUT;
    lblUrl =        URL_INPUT;
    lblUrlHelp =    URL_HELP;
    

    //------------------------------------------------
    // Custom Getters
    //------------------------------------------------
    get hasAvailablePages() {
        return this.availablePages.length > 0;
    }

    get isValidVariant() {
        return this.displayVariants?.findIndex(item => item.label === this.variantName) > 0;
    }

    get isPageType() {
        console.log("isPageType: pageContext ", JSON.stringify(this.pageContext));
        console.log("isPageType: contentTypeFQN ", this.pageContext?.contentTypeFQN);
        return (this.pageContext?.contentTypeFQN === 'sfpegPage');
    }

    //------------------------------------------------
    // Context Initialisation
    //------------------------------------------------

    spaceId;
    pageContext;
    currentKey;
    @wire(getContext, {})
    wiredContext(result) {
        //if (this.isDebug) {
            console.log("wiredContext: START for PageEditor");
            console.log("wiredContext: result received ",JSON.stringify(result));
            this.pageContext = result.data;
            this.spaceId = this.pageContext?.contentSpaceId;
            this.currentKey = this.pageContext?.contentKey;
            console.log("wiredContext: END with spaceId ",this.spaceId);
        //}
    }

    headline = 'Loading...';
    relatedPageKeys;
    links;
    iconName;
    variantName;
    pageContent;
    title = "CMS Page Editor";
    @wire(getContent, {})
    wiredContent(result) {
        //if (this.isDebug) {
            console.log("wiredContent: START for title ",this.title);
            console.log("wiredContent: result received ",JSON.stringify(result));

            this.pageContent = result.data;
            console.log("wiredContent: pageContent init ",JSON.stringify(this.pageContent));

            this.title = this.pageContent.title;

            if (this.pageContent?.contentBody?.Headline) this.headline = this.pageContent.contentBody.Headline;
            console.log("wiredContent: headline init ",this.headline);

            if (this.pageContent?.contentBody?.Icon) this.iconName = this.pageContent.contentBody.Icon;
            console.log("wiredContent: iconName init ",this.iconName);

            if (this.pageContent?.contentBody?.DisplayVariant) this.variantName = this.pageContent.contentBody.DisplayVariant;
            console.log("wiredContent: variantName init ",this.variantName);

            if (this.pageContent?.contentBody?.RelatedPages) {
                try {
                    this.relatedPageKeys = JSON.parse(this.pageContent.contentBody.RelatedPages);
                    console.log("wiredContent: relatedPageKeys init ",this.relatedPageKeys);
                }
                catch (error) {
                    console.warn("wiredContent: RelatedPages parsing failed ",error);
                    console.warn("wiredContent: for value ",this.pageContent?.contentBody?.RelatedPages);
                    this.relatedPageKeys = [];
                }
            }
            else {
                console.log("wiredContent: no relatedPageKeys received");
                this.relatedPageKeys = [];
            }

            if (this.pageContent?.contentBody?.Links) {
                try {
                    this.links = JSON.parse(this.pageContent.contentBody.Links);
                    console.log("wiredContent: links init ",this.links);
                }
                catch (error) {
                    console.warn("wiredContent: linls parsing failed ",error);
                    console.warn("wiredContent: for value ",this.pageContent?.contentBody?.Links);
                    this.links = [];
                }
            }
            else {
                console.log("wiredContent: no relatedPageKeys received");
                this.links = [];
            }

            console.log("wiredContent: END");
        //}
    }

    //------------------------------------------------
    // Aditional Data Fetch
    //------------------------------------------------

    displayVariants;
    @wire(getDisplayVariants, {})
    wiredDisplayVariants(result) {
        console.log("wiredDisplayVariants: START");
        console.log("wiredDisplayVariants: result received ",JSON.stringify(result));

        if (result?.data) {
            let displayVariants = [{label: '----',value: ''}];
            result.data.forEach(item => {
                displayVariants.push({label:item,value:item});
            });
            this.displayVariants = displayVariants;
        }
        console.log("wiredDisplayVariants: END with displayVariants ",JSON.stringify(this.displayVariants));
    }

    iconNames;
    @wire(getIconNames, {})
    wiredIconNames(result) {
        console.log("wiredIconNames: START");
        console.log("wiredIconNames: result received ",JSON.stringify(result));

        if (result?.data) {
            let iconNames = [{label: '----',value: ''}];
            result.data.forEach(item => {
                iconNames.push({label:item,value:item});
            });
            this.iconNames = iconNames;
        }
        console.log("wiredIconNames: END with iconNames ",JSON.stringify(this.iconNames));
    }

    iconURL;
    @wire(getIconLink, {iconName: "$iconName"})
    wiredIcon(result) {
        console.log("wiredIcon: START for iconName ",this.iconName);
        console.log("wiredIcon: result received ",JSON.stringify(result));
        this.iconURL = result?.data;
        console.log("wiredIcon: END with iconURL ",this.iconURL);
    }

    relatedPages;
    @wire(getRelatedPages, {contentKeys: "$relatedPageKeys"})
    wiredRelatedPages(result) {
        console.log("wiredRelatedPages: START for related Page Keys ",JSON.stringify(this.relatedPageKeys));
        console.log("wiredRelatedPages: result received ",JSON.stringify(result));
        if (Array.isArray(result?.data)) {
            console.log("wiredRelatedPages: sorting results received");
            this.relatedPages = [];
            this.relatedPageKeys.forEach(iter => {
                if (iter == this.currentKey) {
                    console.warn("wiredRelatedPages: related Page Keys contain current Key ",this.currentKey);
                }
                else {
                    let iterIndex = result.data.findIndex(item => item.ContentKey == iter);
                    if (iterIndex > -1) this.relatedPages.push(result.data[iterIndex]);
                }
            });
        }
        else {
            console.log("wiredRelatedPages: no result received");
            this.relatedPages = [];
        }
        console.log("wiredRelatedPages: END with related Pages ",JSON.stringify(this.relatedPages));
    }

    spacePages;
    availablePages;
    @wire(getSpacePages, {contentSpaceId: "$spaceId"})
    wiredSpacePages(result) {
        console.log("wiredSpacePages: START for spaceId ",this.spaceId);
        console.log("wiredSpacePages: result received ",JSON.stringify(result));
        this.spacePages = result?.data || [];
        console.log("wiredSpacePages: spacePages init ",JSON.stringify(this.spacePages));

        let currentPages = new Set(this.relatedPageKeys);
        console.log("wiredSpacePages: currentPages set init ",JSON.stringify(currentPages));
        this.availablePages = this.spacePages?.filter(item => (!currentPages.has(item.ContentKey)) && (item.ContentKey !== this.currentKey));

        console.log("wiredSpacePages: END with available Pages filtered ",JSON.stringify(this.availablePages));
    }


    //------------------------------------------------
    // Event handlers
    //------------------------------------------------

    // Mode toggle events
    toggleIconMode(event) {
        console.log("toggleIconMode: START with isIconEdit ",this.isIconEdit);
        this.isIconEdit = !this.isIconEdit;
        console.log("toggleIconMode: END with isIconEdit ",this.isIconEdit);
    }

    toggleVariantMode(event) {
        console.log("toggleVariantMode: START with isVariantEdit ",this.isVariantEdit);
        this.isVariantEdit = !this.isVariantEdit;
        console.log("toggleVariantMode: END with isVariantEdit ",this.isVariantEdit);
    }

    togglePageMode(event) {
        console.log("togglePageMode: START with isPageEdit ",this.isPageEdit);
        this.isPageEdit = !this.isPageEdit;
        console.log("togglePageMode: END with isPageEdit ",this.isPageEdit);
    }

    toggleLinkMode(event) {
        console.log("toggleLinkMode: START with isLinkEdit ",this.isLinkEdit);
        this.isLinkEdit = !this.isLinkEdit;
        console.log("toggleLinkMode: END with isLinkEdit ",this.isLinkEdit);
    }

    //----------------------------------------------------------------------
    // Icon / Variant change events
    //----------------------------------------------------------------------
    handleIconChange (event) {
        console.log("handleIconChange: START for iconName ",this.iconName);
        console.log("handleIconChange: with event ",event);
        this.iconName = event.detail.value;
        console.log("handleIconChange: new iconName ",this.iconName);
        this.applyChanges();
        console.log("handleIconChange: END / iconName update requested");
    }

    handleVariantChange (event) {
        console.log("handleVariantChange: START for variantName ",this.variantName);
        console.log("handleVariantChange: with event ",event);
        this.variantName = event.detail.value;
        console.log("handleVariantChange: new variantName ",this.variantName);
        this.applyChanges();
        console.log("handleVariantChange: END / variantName update requested");
    }

    //----------------------------------------------------------------------
    // Related Pages change events
    //----------------------------------------------------------------------
    handleMoveUp(event){
        console.log("handleMoveUp: START with ContentKey ",event.target.value);
        let pageIndex = this.relatedPages.findIndex(item => item.ContentKey == event.target.value);
        console.log("handleMoveUp: pageIndex found ",pageIndex);

        if (pageIndex == 0) {
            console.log("handleMoveUp: END / Item is already the first !");
            return;
        }

        console.log("handleMoveUp: current relatedPages ",JSON.stringify(this.relatedPages));
        [this.relatedPages[pageIndex -1],this.relatedPages[pageIndex]] = [this.relatedPages[pageIndex],this.relatedPages[pageIndex -1]];
        console.log("handleMoveUp: relatedPages updated ",JSON.stringify(this.relatedPages));

        this.applyChanges();
        console.log("handleMoveUp: END / RelatedPages update requested");
    }
    handleMoveDown(event){
        console.log("handleMoveDown: START with ContentKey ",event.target.value);
        let pageIndex = this.relatedPages.findIndex(item => item.ContentKey == event.target.value);
        console.log("handleMoveDown: pageIndex found ",pageIndex);

        if (pageIndex == this.relatedPages.length - 1) {
            console.log("handleMoveDown: END / Item is already the last !");
            return;
        }

        console.log("handleMoveDown: current relatedPages ",JSON.stringify(this.relatedPages));
        [this.relatedPages[pageIndex],this.relatedPages[pageIndex +1]] = [this.relatedPages[pageIndex +1],this.relatedPages[pageIndex]];
        console.log("handleMoveDown: relatedPages updated ",JSON.stringify(this.relatedPages));

        this.applyChanges();
        console.log("handleMoveDown: END / RelatedPages update requested");
    }
    handleRemove(event){
        console.log("handleRemove: START with ContentKey ",event.target.value);

        let pageIndex = this.relatedPages.findIndex(item => item.ContentKey == event.target.value);
        console.log("handleRemove: pageIndex found ",pageIndex);
        let page2remove = this.relatedPages.splice(pageIndex, 1)[0];
        console.log("handleRemove: page2remove extracted ",JSON.stringify(page2remove));

        console.log("handleRemove: current availablePages ",JSON.stringify(this.availablePages));
        this.availablePages.push(page2remove);
        console.log("handleRemove: availablePages updated ",JSON.stringify(this.availablePages));

        this.applyChanges();
        console.log("handleRemove: END / RelatedPages update requested");
    }
    handleAdd(event){
        console.log("handleAdd: START with ContentKey ",event.target.value);

        let pageIndex = this.availablePages.findIndex((item) => item.ContentKey == event.target.value);
        console.log("handleAdd: pageIndex found ",pageIndex);
        let page2add = this.availablePages.splice(pageIndex, 1)[0];
        console.log("handleAdd: page2add extracted ",JSON.stringify(page2add));
        console.log("handleAdd: availablePages updated ",JSON.stringify(this.availablePages));

        console.log("handleAdd: current relatedPages ",JSON.stringify(this.relatedPages));
        this.relatedPages.push(page2add);
        console.log("handleAdd: relatedPages updated ",JSON.stringify(this.relatedPages));
        
        this.applyChanges();
        console.log("handleAdd: END / RelatedPages update requested");
    }

    //----------------------------------------------------------------------
    // Link changes events
    //----------------------------------------------------------------------
    handleMoveLinkUp(event){
        console.log("handleMoveLinkUp: START with link ",event.target.value);
        let linkIndex = this.links.findIndex(item => item.label == event.target.value);
        console.log("handleMoveLinkUp: linkIndex found ",linkIndex);

        if (linkIndex == 0) {
            console.log("handleMoveLinkUp: END / Item is already the first !");
            return;
        }

        console.log("handleMoveLinkUp: current links ",JSON.stringify(this.links));
        [this.links[linkIndex -1],this.links[linkIndex]] = [this.links[linkIndex],this.links[linkIndex -1]];
        console.log("handleMoveLinkUp: links updated ",JSON.stringify(this.links));

        this.applyChanges();
        console.log("handleMovhandleMoveLinkUpeUp: END / links update requested");
    }
    handleMoveLinkDown(event){
        console.log("handleMoveLinkDown: START with link ",event.target.value);
        let linkIndex = this.links.findIndex(item => item.label == event.target.value);
        console.log("handleMoveLinkDown: pageIndex found ",linkIndex);

        if (linkIndex == this.links.length - 1) {
            console.log("handleMoveLinkDown: END / Item is already the last !");
            return;
        }

        console.log("handleMoveLinkDown: current links ",JSON.stringify(this.links));
        [this.links[linkIndex],this.links[linkIndex +1]] = [this.links[linkIndex +1],this.links[linkIndex]];
        console.log("handleMoveLinkDown: relatedPages updated ",JSON.stringify(this.links));

        this.applyChanges();
        console.log("handleMoveLinkDown: END / links update requested");
    }
    handleEditLink(event){
        console.log("handleEditLink: START with link ",event.target.value);
        let linkIndex = this.links.findIndex(item => item.label == event.target.value);
        console.log("handleEditLink: linkIndex found ",linkIndex);
        this.isEditLinkModalOpen = !this.isEditLinkModalOpen;
        console.log("handleEditLink: isEditLinkModalOpen Status: ",this.isEditLinkModalOpen);
        console.log("handleEditLink: link params: ", JSON.stringify(this.links[linkIndex]));
        this.selectedLink = {... this.links[linkIndex]};       
        this.selectedLinkIndex = linkIndex;
        console.log("handleEditLink: END / links update requested");
    }
    handleRemoveLink(event){
        console.log("handleRemoveLink: START with link ",event.target.value);

        let linkIndex = this.links.findIndex(item => item.label == event.target.value);
        console.log("handleRemoveLink: linkIndex found ",linkIndex);
        let link2remove = this.links.splice(linkIndex, 1)[0];
        console.log("handleRemoveLink: link2remove extracted ",JSON.stringify(link2remove));

        this.applyChanges();
        console.log("handleRemoveLink: END / links update requested");
    }
    handleAddLink(event){
        console.log("handleAddLink: START with event",event);
        event.preventDefault();

        let inputFields = this.template.querySelectorAll('lightning-input');
        console.log("handleAddLink: inputFields fetched ",inputFields);

        let link2add = {};
        //let isOK = true;
        inputFields.forEach(item => {
            console.log("handleAddLink: processing inputField ",item);
            console.log("handleAddLink: with name ",item.name);
            console.log("handleAddLink: with value ",item.value);
            /*item.reportValidity();
            isOK = isOK && item.checkValidity();
            console.log("handleAddLink: valid? ",item.validity.valid);*/
            link2add[item.name] = item.value;
        });
        console.log("handleAddLink: link2add init ",JSON.stringify(link2add));
        link2add.target = (link2add.url.startsWith('http') ? '_blank' : '_self');
        console.log("handleAddLink: link2add finalized ",JSON.stringify(link2add));

        //console.log("handleAddLink: isOK ",isOK);

        console.log("handleAddLink: current links ",JSON.stringify(this.links));
        this.links.push(link2add);
        console.log("handleAddLink: links updated ",JSON.stringify(this.links));

        this.refs.linkForm.reset();

        this.applyChanges();
        console.log("handleAddLink: END / Links update requested");
    }
    
    closeEditLinkModal(event){
        console.log("closeEditLinkModal: START with event",event);
        this.isEditLinkModalOpen = !this.isEditLinkModalOpen;
        console.log("closeEditLinkModal: isEditLinkModalOpen",this.isEditLinkModalOpen);
        console.log("closeEditLinkModal: END ");
    }

    handleUpdateLink(event){
        console.log("handleUpdateLink: START with event",event);
        event.preventDefault();
        console.log("handleUpdateLink: current links ",JSON.stringify(this.links));
        let linkIndex = this.selectedLinkIndex;
        console.log("handleUpdateLink: linkIndex: ",linkIndex);
        let labelInput = this.refs.editModalLabel;
        let titleInput = this.refs.editModalTitle;
        let urlInput = this.refs.editModalURL;
        // Sanity check: Guard against refs not being available
        if (!labelInput || !titleInput || !urlInput) {
            console.error('handleUpdateLink: Edit link Modal input references are not available.');
            this.isEditLinkModalOpen = !this.isEditLinkModalOpen;
            return;
        }

        let link2Update = {};    
        link2Update["label"] = labelInput.value;
        link2Update["title"] = titleInput.value;
        link2Update["url"] = urlInput.value;
        link2Update["target"] = (urlInput.value.startsWith('http') ? '_blank' : '_self');      
        console.log("handleUpdateLink: link2Update: ",JSON.stringify(link2Update)); 
        this.links[linkIndex] = link2Update;
        console.log("handleUpdateLink: this.links after update: ",JSON.stringify(this.links)); 
        this.applyChanges();
        this.isEditLinkModalOpen = !this.isEditLinkModalOpen;
        console.log("handleUpdateLink: END ");
    }


    //------------------------------------------------
    // Utilities
    //------------------------------------------------
    applyChanges = () => {
        console.log("applyChanges: START");

        console.log("applyChanges: current pageContent ",JSON.stringify(this.pageContent));
        console.log("applyChanges: current pageContent ",JSON.stringify(this.iconName));
        console.log("applyChanges: current relatedPages ",JSON.stringify(this.relatedPages));
        console.log("applyChanges: current links ",JSON.stringify(this.links));

        this.pageContent.contentBody.Icon = this.iconName;
        this.pageContent.contentBody.DisplayVariant = this.variantName;
        this.pageContent.contentBody.RelatedPages = JSON.stringify(this.relatedPages.map(item => item.ContentKey));
        this.pageContent.contentBody.Links = JSON.stringify(this.links);
        this.pageContent.contentBody.Target = '{"type":"standard__managedContentPage","attributes":{"contentTypeName":"sfpegPage","contentKey":"' + this.currentKey + '"}}';
        console.log("applyChanges: pageContent to update ",JSON.stringify(this.pageContent));

        updateContent(this.pageContent)
        .then(() => {
            console.log("applyChanges: END OK / changes propagated");
        })
        .catch(error => {
            console.error("applyChanges: END KO / change propagation failed",JSON.stringify(error));
        });
        console.log("applyChanges: change propagation requested");
    }
}