from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
import json

CHROMEDRIVERPATH: str

driver: webdriver

# function to load in the local config file
def loadLocaleConfig():
    with open('./config.json') as f:
        global CHROMEDRIVERPATH
        jsn = json.load(f)
        CHROMEDRIVERPATH = jsn['chromeDriverPath']


# function to start the webdriver
def startDriver():
    # load in the config file to get the path to the chromedriver
    loadLocaleConfig()
    global driver
    if(len(CHROMEDRIVERPATH.strip()) == 0):
        driver = webdriver.Chrome()
    else:
        driver = webdriver.Chrome(CHROMEDRIVERPATH.strip())


# function to search through a list of url's
def searchList(urls: list):
    for i in range(0, len(urls)):
        print(f"{i}: {urls[i]}");
        driver.get(urls[i])
        time.sleep(2)

if __name__ == '__main__':
    startDriver()
    searchList(['https://marktplaats.nl'])