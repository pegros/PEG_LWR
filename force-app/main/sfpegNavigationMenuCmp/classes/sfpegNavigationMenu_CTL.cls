/***
* @description  Lightning controller to fetch the details of an
*               Experience Site navigation menu.
*               Part of the PEG_LWR package.
* @author       P-E GROS
* @date         Feb 2023
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

public with sharing class sfpegNavigationMenu_CTL {

    /***
    * @description  Static constant containing all navigation items types not supported in custom
    *               LWC navigation component.
    ***/
    final private static List<ConnectApi.NavigationMenuItemType> EXCLUDED_TYPES = new List<ConnectApi.NavigationMenuItemType>{
        ConnectApi.NavigationMenuItemType.Event,
        ConnectApi.NavigationMenuItemType.SystemLink
    };

    /***
    * @description  Simple method to fetch the list of supported menu items included
    *               in a navigation menu given its label displayed in the Site Builder.
    *               It assumes that the call is done from an Experience Site to retrieve
    *               its Network ID.
    * @param        navigationLabel Label of the Navigation Menu
    * @param        includeHome     
    * @return       List<ConnectApi.NavigationMenuItem> List of supported menu items
    * @exception    Various exceptions in case of missing input or wrong context.
    ***/

    @AuraEnabled(cacheable=true)
    public static List<ConnectApi.NavigationMenuItem> getMenuItems(String navLabel, Boolean showHome) {
        System.debug('getMenuItems: START for ' + navLabel);
        System.debug('getMenuItems: with home? ' + showHome);
        if (String.isEmpty(navLabel)) {
            System.debug(LoggingLevel.ERROR, 'getMenuItems: END KO / Missing navigation Label');
            throw new System.AuraHandledException('Missing Navigation Menu Label!');
        }

        String networkId = Network.getNetworkId();
        if (String.isEmpty(networkId)) {
            System.debug(LoggingLevel.ERROR, 'getMenuItems: END KO / No networkId');
            throw new System.AuraHandledException('Network ID not available!');
        }
        System.debug('getMenuItems: networkId retrieved ' + networkId);

        NavigationLinkSet navigationLinkSet = [ SELECT DeveloperName
                                                FROM NavigationLinkSet
                                                WHERE NetworkId = :networkId AND MasterLabel = :navLabel
                                                LIMIT 1];
        if (navigationLinkSet == null) {
            System.debug(LoggingLevel.ERROR, 'getMenuItems: END KO / No navigation found with label ' + navLabel + ' on network ' + networkId);
            throw new System.AuraHandledException('Navigation menu not found!');
        }
        System.debug('getMenuItems: navigationLinkSet retrieved ' + navigationLinkSet);
        String navName = navigationLinkSet.DeveloperName;

        ConnectApi.NavigationMenuItemCollection navMenu = ConnectApi.NavigationMenu.getCommunityNavigationMenu(
            networkId, null, navName,
            ConnectApi.PublishStatus.Live, false, showHome, EXCLUDED_TYPES);
        System.debug('getMenuItems: navigation Menu retrieved ' + navMenu);

        List<ConnectApi.NavigationMenuItem> navItems = navMenu.menuItems;
        System.debug('getMenuItems: END returning ' + navItems);
        return navItems;
    }
}