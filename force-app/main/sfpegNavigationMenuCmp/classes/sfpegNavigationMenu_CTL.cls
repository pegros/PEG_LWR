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
    *               User ID is simply used to trigger a reevaluation of the menu when switching from guest to connected mode
    *               (and bypass the cacheable setting) and nor actually used in the logic.
    * @param        navigationLabel Label of the Navigation Menu
    * @param        includeHome     Boolean flag to include the Home tab
    * @param        userId          User ID for which the navigation menu details should be requested.
    * @return       List<ConnectApi.NavigationMenuItem> List of supported menu items
    * @exception    Various exceptions in case of missing input or wrong context.
    ***/

    @AuraEnabled(cacheable=true)
    public static List<ConnectApi.NavigationMenuItem> getMenuItems(String navLabel, Boolean showHome, final String userId) {
        System.debug('getMenuItems: START for ' + navLabel);
        System.debug('getMenuItems: with home? ' + showHome);
        System.debug('getMenuItems: with userId ' + userId);
        if (String.isEmpty(navLabel)) {
            System.debug(LoggingLevel.ERROR, 'getMenuItems: END KO / Missing navigation Label');
            throw new System.AuraHandledException('Missing Navigation Menu Label!');
        }

        String networkId;
        if (!Test.isRunningTest()) {
            networkId = Network.getNetworkId();
        }
        else {
            System.debug('getMenuItems: setting networkId to userId for tests');
            networkId = userId;
        }
        if (String.isEmpty(networkId)) {
            System.debug(LoggingLevel.ERROR, 'getMenuItems: END KO / No networkId');
            throw new System.AuraHandledException('Network ID not available!');
        }
        System.debug('getMenuItems: networkId retrieved ' + networkId);

        NavigationLinkSet navigationLink = null;
        if (!Test.isRunningTest()) {
            navigationLink = [  SELECT DeveloperName
                                FROM NavigationLinkSet
                                WHERE NetworkId = :networkId AND MasterLabel = :navLabel
                                LIMIT 1];
        }
        else {
            System.debug(LoggingLevel.ERROR, 'getMenuItems: setting test navigation set');
            if (navLabel != 'NONE') {
                System.debug(LoggingLevel.FINEST, 'getMenuItems: registering menu ' + navLabel);
                navigationLink = new NavigationLinkSet(DeveloperName = navLabel, MasterLabel = navLabel);
            }
            else {
                System.debug(LoggingLevel.FINEST, 'getMenuItems: ignoring menu ' + navLabel);
            }
        }
        if (navigationLink == null) {
            System.debug(LoggingLevel.ERROR, 'getMenuItems: END KO / No navigation found with label ' + navLabel + ' on network ' + networkId);
            throw new System.AuraHandledException('Navigation menu not found!');
        }
        System.debug('getMenuItems: navigationLink retrieved ' + navigationLink);
        String navName = navigationLink.DeveloperName;
        System.debug('getMenuItems: navName extracted ' + navName);

        ConnectApi.NavigationMenuItemCollection navMenu;
        if (!Test.isRunningTest()) {
            navMenu = ConnectApi.NavigationMenu.getCommunityNavigationMenu(
                networkId, null, navName,
                ConnectApi.PublishStatus.Live, false, showHome, EXCLUDED_TYPES);
            System.debug('getMenuItems: navigation Menu retrieved ' + navMenu);
        }
        else {
            System.debug('getMenuItems: setting test navigation menu');
            navMenu = new ConnectApi.NavigationMenuItemCollection();
            navMenu.menuItems = new List<ConnectApi.NavigationMenuItem>();
            ConnectApi.NavigationMenuItem newItem = new ConnectApi.NavigationMenuItem();
            if (showHome) {
                System.debug('getMenuItems: adding home option');
                newItem.Label = 'Home';
                newItem.actionValue = 'www.home.test';
            }
            else {
                System.debug('getMenuItems: no home option');
                newItem.Label = 'Other';
                newItem.actionValue = 'www.other.test';
            }
            navMenu.menuItems.add(newItem);
        }

        List<ConnectApi.NavigationMenuItem> navItems = navMenu.menuItems;
        System.debug('getMenuItems: END returning ' + navItems);
        return navItems;
    }
}