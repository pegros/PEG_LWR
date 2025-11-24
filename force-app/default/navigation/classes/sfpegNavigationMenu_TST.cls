/***
* @description  Test class for the sfpegNavigationMenu_CTL class.
*               Part of the PEG_LWR package.
* @author       P-E GROS
* @date         June 2024
* @see          sfpegNavigationMenu_CTL
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
public class  sfpegNavigationMenu_TST {

	/***
	* @description  Test method for the  sfpegNavigationMenu_CTL class, checking the "getNavigations" method
	*               including all error cases.
	* @see          sfpegNavigationMenu_CTL
	***/

	@isTest
	static void testGetMenuItems() {
		System.debug('testGetMenuItems: START');
		Test.startTest();

        List<Object> inputList;
        List<ConnectApi.NavigationMenuItem> outputList;

        // Passing Cases
        System.debug('testGetMenuItems: TEST 1 - testing correct input with home');

		try {
			outputList =  sfpegNavigationMenu_CTL.getMenuItems('Menu with Home',true,'UserId');
            System.debug('testGetMenuItems: returning ' + outputList);
			Assert.areEqual(1,outputList?.size(),'Returned Menu should contain 1 value as the correct input');
		}
		catch (Exception e) {
			System.debug(LoggingLevel.Error,'testGetMenuItems: Correct input should not raise exception ' + e.getMessage());
            Assert.fail('Correct input should not raise exception');
		}

        System.debug('testGetMenuItems: TEST 2 - testing correct input without home');

		try {
			outputList =  sfpegNavigationMenu_CTL.getMenuItems('Menu without Home',false,'UserId');
            System.debug('testGetMenuItems: returning ' + outputList);
			Assert.areEqual(1,outputList?.size(),'Returned Menu should contain 1 value as the correct input');
		}
		catch (Exception e) {
			System.debug(LoggingLevel.Error,'testGetMenuItems: Correct input should not raise exception ' + e.getMessage());
            Assert.fail('Correct input should not raise exception');
		}


        // Error Cases
        System.debug('testGetMenuItems: TEST 3 - testing when no menu provided ');
        try {
			outputList =  sfpegNavigationMenu_CTL.getMenuItems(null,true,'userId');
			System.debug(LoggingLevel.ERROR,'testGetMenuItems: no exception raised when no menu provided ' + outputList);
			Assert.fail('Exception should be raised when no menu provided');
		}
		catch (Exception e) {
			System.debug('testGetMenuItems: Exception properly raised when no menu provided ' + e.getMessage());
		}

        System.debug(' testGetMenuItems: TEST 4 - testing no valid menu name provided');
        try {
			outputList = sfpegNavigationMenu_CTL.getMenuItems('NONE',true,'userId');
			System.debug(LoggingLevel.ERROR,' testGetMenuItems: no exception raised when no valid menu name provided ' + outputList);
			Assert.fail('Exception should be raised when no valid menu name provided');
		}
		catch (Exception e) {
			System.debug(' testGetMenuItems: Exception properly raised when no valid menu name provided ' + e.getMessage());
		}

		Test.stopTest();
		System.debug('testGetMenuItems: END');
	}
}