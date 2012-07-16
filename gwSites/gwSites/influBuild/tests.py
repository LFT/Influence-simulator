"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
from django.conf import settings
from django.test import TestCase
from django.test import LiveServerTestCase
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
from gwSites.influBuild.models import Building
import time
import re


class MySeleniumTests(LiveServerTestCase):
	fixtures = ['user-data.json']
	
	@classmethod
	def setUpClass(cls):
		cls.selenium = WebDriver()
		super(MySeleniumTests, cls).setUpClass()
		#print(cls.live_server_url)
		#cls.selenium.get('%s%s' % (cls.live_server_url, '/init/'))
		#cls.selenium.get('http://localhost:8081/init/')
		#print len(Building.objects.all())
		
	@classmethod
	def tearDownClass(cls):
		super(MySeleniumTests, cls).tearDownClass()
		cls.selenium.quit()
	
	def setUp(self):
		#self.selenium.get('http://localhost:8081/init/')
		self.selenium.get('%s%s' % (self.live_server_url, '/init/'))
		
	def testBasicDragAndDrop(self):
		buildObject = Building.objects.get(shortName = "Pol1")
		element = self.selenium.find_element_by_id(buildObject.shortName)
		target = self.selenium.find_element_by_id("buildList0")
		ActionChains(self.selenium).drag_and_drop(element,target).perform()
		droppedDiv = self.selenium.find_element_by_css_selector("#buildList0 > div:last-child")
		self.assertEqual(buildObject.name, droppedDiv.text)
		self.assertEqual(str(buildObject.timeToBuild), re.search("time(\d+)",droppedDiv.get_attribute("class")).group(1))
		self.assertEqual(str(buildObject.cost),self.selenium.find_element_by_css_selector("#totalCost > div:last-child").text)
		
	def testHoverInfo(self):
		buildObject = Building.objects.get(shortName = "Pol41")
		element = self.selenium.find_element_by_id(buildObject.shortName)
		hoverElement = self.selenium.find_element_by_id("buildTooltip")
		ActionChains(self.selenium).move_to_element(element)
		time.sleep(1)
		self.assertEqual(buildObject.completeDescr, hoverElement.text)
		self.assertEqual(true, hoverElement.is_displayed())
		ActionChains(self.selenium).move_to_element(self.selenium.find_element_by_id("buildList0"))
		self.assertEqual(false, hoverElement.is_displayed())

		
#class SimpleTest(TestCase):
#    def test_basic_addition(self):
#        """
#        Tests that 1 + 1 always equals 2.
#        """
#        self.assertEqual(1 + 1, 2)
