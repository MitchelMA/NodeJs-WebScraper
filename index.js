// https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const url =
  "https://www.marktplaats.nl/l/telecommunicatie/mobiele-telefoons-apple-iphone/#q:iphone+11|sortBy:OPTIMIZED|sortOrder:DECREASING/";
const fs = require("fs");

// read the config.json file
const CONFIG = JSON.parse(fs.readFileSync("./config.json"));
console.log("instellingen omvatten: ");
console.log(CONFIG);

// the desired difference in time between checking in minutes
const desiredTimeDiff = CONFIG["scrape-interval"];

// the time in milliseconds after which the interval to check will for the difference in time
const checkTime = 10000;

// the last date with which the interval will check the progression of time
let lastDate = new Date();

async function main(time) {
  console.log(time.toFixed(1) + " minuten sinds de laatste keer scrapen");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const content = await page.content();

  search(content);

  await browser.close();
}

function search(content) {
  const $ = cheerio.load(content);
  const ITEMCSS =
    "ul.mp-Listings.mp-Listings--list-view > li.mp-Listing.mp-Listing--list-item";
  let listItems = $(ITEMCSS);

  //-----------------------------------------------------//
  //#region get the titles
  let titles = [];
  $(ITEMCSS + " h3.mp-Listing-title").each(function () {
    titles.push($(this).text());
  });
  //#endregion
  //-----------------------------------------------------//

  //-----------------------------------------------------//
  //#region get the hyperlinks
  let hyperlinks = [];
  listItems.each(function (index, element) {
    hyperlinks.push($(element).children("a")[0].attribs.href);
  });
  //#endregion
  //-----------------------------------------------------//

  //-----------------------------------------------------//
  //#region get the descriptions
  let descriptions = [];
  $(ITEMCSS + " .mp-Listing-description.mp-text-paragraph ").each(function (
    index,
    element
  ) {
    descriptions.push($(element).text());
  });
  //#endregion
  //-----------------------------------------------------//

  //-----------------------------------------------------//
  //#region get the prices and listing dates
  let prices = [];
  let listingDates = [];
  $(ITEMCSS + " .mp-Listing-group--price-date-feature").each(function (
    index,
    element
  ) {
    // get the child with the price
    const price = $(element)
      .children(".mp-Listing-price.mp-text-price-label")
      .text();
    const date = $(element)
      .children(".mp-Listing-date.mp-Listing-date--desktop")
      .text();
    prices.push(price);
    listingDates.push(date);
  });
  //#endregion
  //-----------------------------------------------------//

  //-----------------------------------------------------//
  //#region other info
  let others = [];
  $(ITEMCSS + " .mp-Listing-attributes").each(function (index, element) {
    // get its "span" element children
    const children = $(element).children(
      "span.mp-Attribute.mp-Attribute--default"
    );
    // get all the other info
    let infoStr = "";

    $(children).each(function (j, child) {
      infoStr += $(child).text().trim();
      if (j < children[0].childNodes.length) infoStr += " | ";
    });

    others.push(infoStr);
  });
  //#endregion
  //-----------------------------------------------------//

  //-----------------------------------------------------//
  //#region combining
  // combine all this ^ info into one array, which will contain objects
  let itemObjects = [];

  // I can assume that all arrays have the same length:
  for (let i = 0; i < titles.length; ++i) {
    let tmp = {
      title: titles[i],
      hyperlink: "https://www.marktplaats.nl" + hyperlinks[i],
      description: descriptions[i],
      price: prices[i],
      listingDate: listingDates[i],
      other: others[i],
    };
    itemObjects.push(tmp);
  }
  console.log(itemObjects.length + " aantal producten gevonden");
  //#endregion
  //-----------------------------------------------------//

  //-----------------------------------------------------//
  //#region write to data.json
  const newData = {
    query: url,
    items: [...itemObjects],
  };
  // first check if there is already a data.json file to open
  try {
    // code continuing after this means that it did not fail
    const oldData = JSON.parse(fs.readFileSync("data.json"));
    const newItems = checkDifference({ ...newData }, { ...oldData });
    // logging the new items
    if (newItems.newQuery) {
      console.log(
        "Met een nieuwe search-query is het programma ervan uit gegaan dat alle items nieuw waren: "
      );
      console.log(newItems.newItems);
    } else {
      console.log(
        "Met dezelfde search-query heeft het programma " +
          newItems.newItems.length +
          " nieuw(e) item(s) gevonden: "
      );
      console.log(newItems.newItems);
    }

    // before writing to the file, send email -------------//
    // code that sends an email when new items are found:

    //-----------------------------------------------------//

    fs.writeFileSync("data.json", JSON.stringify(newData, null, 2));
  } catch (err) {
    // so that means when the data.json file is empty or doesn't exist, I can immediately write to it
    fs.writeFileSync("data.json", JSON.stringify(newData, null, 2));
  }
  //#endregion
  //-----------------------------------------------------//
}

/**
 * This function compares the new and the old data
 * @param {Object} newData New found data
 * @param {Object} oldData Old data
 * @return {Object} An object containing "newQuery": true if the search query was different from the last; else false.
 * And the new found items: "newItems"
 */
function checkDifference(newData, oldData) {
  // first, check if the queries were the same
  // if they are not the same, assume that all the found items are new
  if (newData.query !== oldData.query) {
    return {
      newQuery: true,
      newItems: [...newData.items],
    };
  }

  // else if the queries are equal
  else {
    let newItems = [];
    for (let i = 0; i < newData.items.length; i++) {
      if (!dataContains({ ...oldData }, newData.items[i])) {
        newItems.push(newData.items[i]);
      }
    }
    return {
      newQuery: false,
      newItems: [...newItems],
    };
  }
}

/**
 * Checks if the data contains a specified item
 * @param {*} data Data object you want to check
 * @param {*} item The item which's presence you want to determine
 * @returns Boolean which determines the presence of the item
 */
function dataContains(data, item) {
  for (let i = 0; i < data.items.length; i++) {
    if (data.items[i].title === item.title) return true;
  }
  return false;
}

main(0).catch(console.error);

// interval to check the progression of time
setInterval(() => {
  let currentDate = new Date();
  // current difference in time in minutes
  let currentDiff = (currentDate - lastDate) / 1000 / 60;

  // after the necessary amount of time has passed, the main may be called again
  if (currentDiff >= desiredTimeDiff) {
    // reset the lastDate
    lastDate = new Date();

    // call the main
    main(currentDiff).catch(console.log);
  }
}, checkTime);

// SIGINT (Signal interupt)
process.on("SIGINT", function () {
  console.log("Shutting Down...");
  process.exit(0);
});
