/***
* @description  Test class for the sfpegCmsPageEditor_CTL class.
*               Part of the PEG_LWR package.
* @author       P-E GROS
* @date         Dec 2024
* @see          sfpegCmsPageEditor_CTL
* @see          PEG_LWR package (https://github.com/pegros/PEG_LWR)
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

@isTest
@SuppressWarnings('PMD.ClassNamingConventions')
public class  sfpegCmsPageEditor_TST {

    /***
	* @description  Test method for the sfpegCmsPageEditor_CTL class, checking the "getDisplayVariants" method
	*               including all error cases.
	* @see          sfpegCmsPageEditor_CTL
	***/

	@isTest
	static void testGetDisplayVariants() {
		System.debug('testGetDisplayVariants: START');
		Test.startTest();

        // Case #1 - Missing configuration
        System.debug('testGetDisplayVariants: Test #1 - Custom setting not set');
        try {
            List<Object> displayVariants = sfpegCmsPageEditor_CTL.getDisplayVariants();
            System.debug('testGetDisplayVariants: display variants fetched' + displayVariants);
            Assert.isNull(displayVariants, 'Null value should be returned when custom setting not initialized');
        }
        catch(Exception error){
            System.debug('testGetDisplayVariants: Exception raised' + error);
            Assert.fail('Exception should not be raised when custom setting is missing');
        }

        // Case #2 - Bad DisplayModes configuration
        System.debug('testGetDisplayVariants: Test #2 - Bad DisplayModes configuration');

        sfpegPageSettings__c pageSettings = new sfpegPageSettings__c();
        pageSettings.DisplayVariants__c = 'DUMMY;TEST';
        insert pageSettings;
		System.debug('testGetDisplayVariants: pageSettings custom setting inserted ' + pageSettings);

        try {
            List<Object> displayVariants = sfpegCmsPageEditor_CTL.getDisplayVariants();
            System.debug('testGetDisplayVariants: display variants fetched' + displayVariants);
            Assert.fail('Exception should be raised with bad DisplayModes configuration');
        }
        catch(Exception error){
            System.debug('testGetDisplayVariants: Exception properly raised' + error);
        }

        // Case #3 - Passing case
        System.debug('testGetDisplayVariants: Test #3 - Passing case');

        pageSettings.DisplayVariants__c = '["Mode1","Mode2"]';
        update pageSettings;
		System.debug('testGetDisplayVariants: pageSettings custom setting updated ' + pageSettings);

        try {
            List<Object> displayVariants = sfpegCmsPageEditor_CTL.getDisplayVariants();
            System.debug('testGetDisplayVariants: display variants fetched' + displayVariants);
            Assert.areEqual(2,displayVariants.size(),'2 display modes should be returned');
        }
        catch(Exception error){
            System.debug('testGetDisplayVariants: Exception raised' + error);
            Assert.fail('Exception should not be raised when everything is OK');
        }

		Test.stopTest();
		System.debug('testGetDisplayVariants: END');

    }


	/***
	* @description  Test method for the sfpegCmsPageEditor_CTL class, checking the "getIconNames" method
	*               including all error cases.
	* @see          sfpegCmsPageEditor_CTL
	***/

	@isTest
	static void testGetIconNames() {
		System.debug('testGetIconNames: START');
		Test.startTest();

        // Case #1 - Missing configuration
        System.debug('testGetIconNames: Test #1 - Custom setting not set');
        try {
            List<Object> iconList = sfpegCmsPageEditor_CTL.getIconNames();
            System.debug('testGetIconNames: icon names fetched' + iconList);
            Assert.fail('Exception should be raised when custom setting not initialized');
        }
        catch(Exception error){
            System.debug('testGetIconNames: Exception properly raised' + error);
        }

        // Case #2 - Missing Static Resource
        System.debug('testGetIconNames: Test #2 - Missing Static resource');

        sfpegPageSettings__c pageSettings = new sfpegPageSettings__c();
        pageSettings.IconExtension__c = '.png';
        pageSettings.IconNameResource__c = 'sfpegPageEditorTestIcons';
        pageSettings.IconFilesResource__c = 'DummyIconNamesRsc';
        pageSettings.IconPath__c = '/';
        insert pageSettings;
		System.debug('testGetIconNames: pageSettings custom setting inserted ' + pageSettings);

        try {
            List<Object> iconList = sfpegCmsPageEditor_CTL.getIconNames();
            System.debug('testGetIconNames: icon names fetched' + iconList);
            Assert.fail('Exception should be raised when static resource is missing');
        }
        catch(Exception error){
            System.debug('testGetIconNames: Exception properly raised' + error);
        }

        // Case #3 - Passing case
        System.debug('testGetIconNames: Test #3 - Passing case');

        pageSettings.IconNameResource__c = 'sfpegPageEditorTestNames';
        update pageSettings;
		System.debug('testGetIconNames: pageSettings custom setting updated ' + pageSettings);

        try {
            List<Object> iconList = sfpegCmsPageEditor_CTL.getIconNames();
            System.debug('testGetIconNames: icon names properly fetched' + iconList);
            Assert.areEqual(9,iconList.size(),'9 icon names should be returned');
        }
        catch(Exception error){
            System.debug('testGetIconNames: Exception raised' + error);
            Assert.fail('Exception should not be raised when everything is OK');
        }

		Test.stopTest();
		System.debug('testGetIconNames: END');

    }


    /***
	* @description  Test method for the sfpegCmsPageEditor_CTL class, checking the "getIconLink" method
	*               including all error cases.
	* @see          sfpegCmsPageEditor_CTL
	***/

	@isTest
	static void testGetIconLink() {
		System.debug('testGetIconLink: START');
		Test.startTest();

        // Case #1 - Missing configuration
        System.debug('testGetIconLink: Test #1 - Custom setting not set');
        try {
            String iconLink = sfpegCmsPageEditor_CTL.getIconLink('icon');
            System.debug('testGetIconLink: icon link fetched' + iconLink);
            Assert.fail('Exception should be raised when custom setting not initialized');
        }
        catch(Exception error){
            System.debug('testGetIconLink: Exception properly raised' + error);
        }

        // Case #2 - Missing Static Resource
        System.debug('testGetIconLink: Test #2 - Missing Static resource');

        sfpegPageSettings__c pageSettings = new sfpegPageSettings__c();
        pageSettings.IconExtension__c = '.svg';
        pageSettings.IconNameResource__c = 'IconNames';
        pageSettings.IconFilesResource__c = 'IconFiles';
        pageSettings.IconPath__c = '/test/';
        insert pageSettings;
		System.debug('testGetIconLink: pageSettings custom setting inserted ' + pageSettings);

        try {
            String iconLink = sfpegCmsPageEditor_CTL.getIconLink('icon');
            System.debug('testGetIconLink: icon link fetched' + iconLink);
            Assert.fail('Exception should be raised when static resource is missing');
        }
        catch(Exception error){
            System.debug('testGetIconLink: Exception properly raised' + error);
        }

        // Case #3 - Missing icon name
        System.debug('testGetIconLink: Test #3 - Missing icon name');
        try {
            String iconLink = sfpegCmsPageEditor_CTL.getIconLink('');
            System.debug('testGetIconLink: icon link fetched ' + iconLink);
            Assert.isNull(iconLink,'URL should be null when no icon name provided');
        }
        catch(Exception error){
            System.debug('testGetIconLink: Exception raised' + error);
            Assert.fail('Exception should not be raised when no icon name provided');
        }

        // Case #4 - Passing case
        System.debug('testGetIconLink: Test #4 - Passing case');

        pageSettings.IconFilesResource__c = 'sfpegPageEditorTest';
        update pageSettings;
		System.debug('testGetIconLink: pageSettings custom setting updated ' + pageSettings);

        try {
            String iconLink = sfpegCmsPageEditor_CTL.getIconLink('icon');
            System.debug('testGetIconLink: icon link fetched' + iconLink);
        }
        catch(Exception error){
            System.debug('testGetIconLink: Exception raised' + error);
            Assert.fail('Exception should not be raised when everything is OK');
        }

		Test.stopTest();
		System.debug('testGetIconLink: END');
    }

    /***
	* @description  Test method for the sfpegCmsPageEditor_CTL class, checking the "getRelatedPages" method
	*               including all error cases.
	* @see          sfpegCmsPageEditor_CTL
	***/

	@isTest
	static void testGetRelatedPages() {
		System.debug('testGetRelatedPages: START');
		Test.startTest();

        // Case #1 - No content key
        System.debug('testGetRelatedPages: Test #1 - no contentKey provided');
        try {
            List<ManagedContent> pageList = sfpegCmsPageEditor_CTL.getRelatedPages(null);
            System.debug('testGetRelatedPages: page list fetched' + pageList);
            Assert.isNull(pageList, 'Null page list should be provided when no contentKey is provided');
        }
        catch(Exception error){
            System.debug('testGetRelatedPages: Exception raised' + error);
            Assert.fail('Exception should not be raised with null content key list');
        }

        // Case #2 - Passing case
        System.debug('testGetRelatedPages: Test #2 -  contentKeys provided');
        try {
            List<ManagedContent> pageList = sfpegCmsPageEditor_CTL.getRelatedPages(new List<String>{'key1','key2'});
            System.debug('testGetRelatedPages: page list fetched' + pageList);
            Assert.areEqual(0,pageList.size(), 'Empty page list should be provided when dummy contentKeys are provided');
        }
        catch(Exception error){
            System.debug('testGetRelatedPages: Exception raised' + error);
            Assert.fail('Exception should not be raised with content key list');
        }

        Test.stopTest();
		System.debug('testGetRelatedPages: END');
    }

    /***
	* @description  Test method for the sfpegCmsPageEditor_CTL class, checking the "getSpacePages" method
	*               including all error cases.
	* @see          sfpegCmsPageEditor_CTL
	***/

	@isTest
	static void testGetSpacePages() {
		System.debug('testGetSpacePages: START');
		Test.startTest();

        // Case #1 - No workspaceId
        System.debug('testGetSpacePages: Test #1 - no content space ID provided');
        try {
            List<ManagedContent> pageList = sfpegCmsPageEditor_CTL.getSpacePages(null,null);
            System.debug('testGetSpacePages: page list fetched' + pageList);
            Assert.fail('Exception should be raised with null content key list');
        }
        catch(Exception error){
            System.debug('testGetSpacePages: Exception properly raised' + error);
        }

        // Case #2 - Passing case without search
        System.debug('testGetSpacePages: Test #2 - Passing case without search');
        try {
            List<ManagedContent> pageList = sfpegCmsPageEditor_CTL.getSpacePages('workspaceId',null);
            System.debug('testGetSpacePages: page list fetched' + pageList);
        }
        catch(Exception error){
            System.debug('testGetSpacePages: Exception raised' + error);
            Assert.fail('Exception should not be raised with proper workspace ID');
        }

        // Case #3 - Passing case with search
        System.debug('testGetSpacePages: Test #3 - Passing case with search');
        try {
            List<ManagedContent> pageList = sfpegCmsPageEditor_CTL.getSpacePages('workspaceId','test');
            System.debug('testGetSpacePages: page list fetched' + pageList);
        }
        catch(Exception error){
            System.debug('testGetSpacePages: Exception raised' + error);
            Assert.fail('Exception should not be raised with proper workspace ID and search');
        }

        Test.stopTest();
		System.debug('testGetSpacePages: END');
    }
    
}