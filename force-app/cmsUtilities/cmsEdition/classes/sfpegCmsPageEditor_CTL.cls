/***
* @description  Lightning controller to fetch various CMS Content information
*               for the sfpegCmsPageEditor LWC component.
*               Part of the PEG_LWR package.
* @author       P-E GROS
* @date         Dec 2024
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

@SuppressWarnings('PMD.ClassNamingConventions')
public with sharing class sfpegCmsPageEditor_CTL {

    /***
    * @description  Method to fetch all available display modes, from the sfpegPageSettings__c custom
    *               setting listing them as a simple JSON array of values.
    ***/
    @AuraEnabled(cacheable=true)
    public static List<Object> getDisplayVariants() {
        System.debug('getDisplayVariants: START');

        String displayVariantStr = sfpegPageSettings__c.getInstance()?.DisplayVariants__c;
        if (String.isBlank(displayVariantStr)) {
            System.debug('getDisplayVariants: END KO returning nothing, as on custom setting ' + sfpegPageSettings__c.getInstance());
            return null;
        }
        System.debug('getDisplayVariants: display variants fetched from custom setting ' + displayVariantStr);

        try {
            List<Object> displayVariants = (List<Object>) JSON.deserializeUntyped(displayVariantStr);
            System.debug('getDisplayVariants: display variants parsed ' + displayVariants);
            System.debug('getDisplayVariants: END returning #variants ' + displayVariants.size());
            return displayVariants;
        }
        catch(exception error) {
            System.debug(LoggingLevel.Error,'getDisplayVariants: END KO / Issue when parsing Display Variants list ' + error);
            throw new AuraException('Technical failure: parsing failed for configured Display Variants ' + displayVariantStr);
        }        
    }

    
    /***
    * @description  Method to fetch all available icon names, from a static resource listing
    *               them as a simple JSON array of names.
    *               It assumes the sfpegPageSettings__c custom setting has been set to provide
    *               the static resource name.
    ***/
    @AuraEnabled(cacheable=true)
    public static List<Object> getIconNames() {
        System.debug('getIconNames: START');

        String resourceName = sfpegPageSettings__c.getInstance()?.IconNameResource__c;
        if (String.isBlank(resourceName)) {
            System.debug(LoggingLevel.Error,'getIconNames: END KO / Issue with custom setting ' + sfpegPageSettings__c.getInstance());
            throw new AuraException('Technical failure: sfpegPageSettings custom setting misses Icon Name resource');
        }
        System.debug('getIconNames: Static resource name for the icon names fetched ' + resourceName);

        StaticResource resourceData = [  SELECT Body FROM StaticResource WHERE Name = :resourceName WITH SYSTEM_MODE LIMIT 1];
        System.debug('getIconNames: resourceData fetched ' + resourceData);

        try {
            String resourceBody = resourceData.Body.toString();
            List<Object> iconNames = (List<Object>) JSON.deserializeUntyped(resourceBody);
            System.debug('getIconNames: icon names parsed ' + iconNames);
            System.debug('getIconNames: END returning #names ' + iconNames.size());
            return iconNames;
        }
        catch(exception error) {
            System.debug(LoggingLevel.Error,'getIconNames: END KO / Issue when parsing Icon Name list ' + error);
            throw new AuraException('Technical failure: parsing failed for static resource ' + resourceName);
        }        
    }

    /***
    * @description  Method to generate the actual URL of the icon to display based on its name.
    *               It assumes the sfpegPageSettings__c custom setting has been set to provide
    *               the name of the static resource containing the icons and the relative path
    *               within the resource to reach the icon.
    ***/
    @AuraEnabled(cacheable=true)
    public static String getIconLink(String iconName) {
        System.debug('getIconLink: START for iconName ' + iconName);

        if (String.isBlank(iconName)) {
            System.debug('getIconLink: END / no icon');
            return null;
        }

        String resourceName = sfpegPageSettings__c.getInstance()?.IconFilesResource__c;
        String iconPath = sfpegPageSettings__c.getInstance()?.IconPath__c;
        String iconExtension = sfpegPageSettings__c.getInstance()?.IconExtension__c;
        if ((String.isBlank(resourceName)) || (String.isBlank(iconPath)) || (String.isBlank(iconExtension))) {
            System.debug(LoggingLevel.Error,'getIconNames: END KO / Issue with custom setting ' + sfpegPageSettings__c.getInstance());
            throw new AuraException('Technical failure: sfpegPageSettings custom setting misses Icon Files resource or icon path or icon extension');
        }
        System.debug('getIconLink: Static resource name for the icon names fetched ' + resourceName);
        System.debug('getIconLink: icon relative path within resource fetched ' + iconPath);
        System.debug('getIconLink: icon file extension fetched ' + iconExtension);


        //StaticResource imageRsc = [  SELECT Name,SystemModStamp FROM StaticResource WHERE Name = 'dsfr' LIMIT 1];
        StaticResource imageRsc = [  SELECT Name,SystemModStamp FROM StaticResource WHERE Name = :resourceName WITH SYSTEM_MODE LIMIT 1];
        System.debug('getIconLink: imageRsc fetched ' + imageRsc);

        String iconURL = '/resource/'
                        + String.valueOf(((DateTime)imageRsc.get('SystemModStamp')).getTime())
                        + '/' + imageRsc.get('Name') + iconPath + iconName + iconExtension;
        //                + '/' + imageRsc.get('Name') + '/artwork/pictograms/' + iconName + '.svg';
        System.debug('getIconLink: END returning icon URL ' + iconURL);
        return iconURL;
    }

    /***
    * @description  Method to get details of CMS Contents given their ContentKeys.
    *               Especially enables to check the existence of each ContentKey and
    *               get the Name of the corresponding Content.
    ***/
    @AuraEnabled(cacheable=true)
    public static List<ManagedContent> getRelatedPages(List<String> contentKeys) {
        System.debug('getRelatedPages: START for #keys ' + contentKeys?.size());

        if ((contentKeys == null) || (contentKeys.isEmpty())) {
            System.debug('getRelatedPages: END / no key provided');
            return null;
        }

        List<ManagedContent> pageList = [   SELECT Name, ContentKey
                                            FROM ManagedContent
                                            WHERE ContentKey IN :contentKeys
                                            WITH SYSTEM_MODE
                                            ORDER BY Name];
        System.debug('getRelatedPages: pages fetched ' + pageList);
        System.debug('getRelatedPages: END returning #pages ' + pageList.size());
        return pageList;
    }

    /***
    * @description  Method to get the list of all CMS Content records of the 
    *               sfpegPage custom type defined for a content space and
    *               with a name optionally containing a search term.
    ***/
    @AuraEnabled(cacheable=true)
    public static List<ManagedContent> getSpacePages(String contentSpaceId, String search) {
        System.debug('getSpacePages: START for space ' + contentSpaceId);
        System.debug('getSpacePages: refined with search term ' + search);

        if (String.isBlank(contentSpaceId)) {
            System.debug('getSpacePages: END / no contentSpaceId provided');
            throw new AuraException('Technical failure: Content Space ID undetermined');
        }

        // @TODO : START Review after Salesforce fix on ContentTypeFullyQualifiedName filter on custom types
        List<ManagedContent> contentList;
        if (String.isBlank(search)) {
            contentList = [ SELECT Name, ContentKey, ContentTypeFullyQualifiedName
                            FROM ManagedContent
                            WHERE AuthoredManagedContentSpaceId = :contentSpaceId 
                                AND (NOT ContentTypeFullyQualifiedName LIKE 'sfdc%') 
                            WITH SYSTEM_MODE
                            ORDER BY Name];
            System.debug('getSpacePages: #content found in space ' + contentList.size());
        }
        else {
            String searchTerm = '%' + search + '%';
            contentList = [ SELECT Name, ContentKey, ContentTypeFullyQualifiedName
                            FROM ManagedContent
                            WHERE AuthoredManagedContentSpaceId = :contentSpaceId 
                                AND (NOT ContentTypeFullyQualifiedName LIKE 'sfdc%') 
                                AND Name LIKE :searchTerm
                            WITH SYSTEM_MODE
                            ORDER BY Name];
            System.debug('getSpacePages: #content found in space with search ' + contentList.size());
        }
                                            
        List<ManagedContent> pageList = new List<ManagedContent>(); 
        for (ManagedContent iter : contentList) {
            if (iter.ContentTypeFullyQualifiedName == 'sfpegPage') {
                pageList.add(iter);
            }
        }
        System.debug('getSpacePages: pages filtered ' + pageList);
        // @TODO : END Review after Salesforce fix on ContentTypeFullyQualifiedName filter on custom types

        System.debug('getSpacePages: END returning #pages ' + pageList.size());
        return pageList;
    }
}