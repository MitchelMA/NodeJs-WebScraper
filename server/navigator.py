from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
# import this class for type specific variables
from selenium.webdriver.chrome.webdriver import WebDriver
# import this DriverManager so when someone uses this program,
# they don't need to have a chromedrive.exe preinstalled somewhere
from webdriver_manager.chrome import ChromeDriverManager
import time
import json

AUTOMESSAGE: str

driver: WebDriver

# function to load in the local config file
def loadLocaleConfig():
    with open('./config.json') as f:
        # data to read from this file *may* come in the future maybe not
        f.close();


# open the auto-message file in readonly
def loadAutoMessage():
    try:
        with open('./auto-message.txt', "r") as f:
            global AUTOMESSAGE
            AUTOMESSAGE = f.read().strip();
            print(AUTOMESSAGE);
    except FileNotFoundError as err:
        print("Er is geen bestand gevonden met de naam \"auto-message.txt\" in de server directory:")
        print(err)
        exit(1)
    except Exception as err:
        print("er ging onverwachts iets mis:")
        print(err)
        exit(1)


def writeToLog(url: str):
    try:
        parsed: list
        with open('./log.json', 'r') as f:
            # parse the file as json first
            parsed: list = json.load(f)
            # now that it's parsed, I can add the url in the array
            print(parsed)
            parsed.append(url)
        if len(parsed) > 0 :
            with open('./log.json', 'w') as f:
                json.dump(parsed, f)

    except ValueError as err:
        print("ValueError!")
        print(err)
        # when something goes wrong with the parsing
        # assume that the file wasn't in json and ad the string as an array
        with open('./log.json', 'w') as f:
            f.write(f"[\"{url}\"]")

    except Exception as err:
        print("Er ging iets mis bij het lezen van het bestand")
        print(err)


# function to start the webdriver
def startDriver():
    # load in the config file to get the path to the chromedriver
    global driver
    driver = webdriver.Chrome(ChromeDriverManager().install())


# function to search through a list of url's
def searchList(urls: list):
    for i in range(0, len(urls)):
        print(f"{i}: {urls[i]}");
        driver.get(urls[i])
        time.sleep(2)


# default startup to navigate to a login page (may that be a random product)
def defaultStartup():
    driver.get("https://marktplaats.nl")
    # I found a way to force the login overlay:
    # go to a product, and press the "bericht" button
    # (when nog logged in, this will obviously force you to the login overlay)
    product_items = driver.find_elements(by=By.CSS_SELECTOR, value="section.hz-CardCollection.hz-CardCollection--grid > a.hz-Link.hz-Link--block")
    for i in product_items:
        print(i.get_attribute("href"))

    # go to the url of the first product
    driver.get(product_items[0].get_attribute("href"))

    # now press the "accept" button of the cookies overlay (cookies cannot get stored)
    accept_btn = driver.find_element(by=By.CSS_SELECTOR, value="button.gdpr-consent-button.mp-Button.mp-Button--primary.mp-Button--lg.mp-width-full")
    accept_btn.click()

    # now we can proceed to press the "bericht" btn
    bericht_btn = driver.find_element(by=By.CSS_SELECTOR, value="button.hz-Button.hz-Button--primary.SellerContactOptions-button")
    bericht_btn.click()

    # At this point, the user should login themselves


if __name__ == '__main__':
    loadAutoMessage()
    startDriver()
    defaultStartup()