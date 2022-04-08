// https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const rp = require("request-promise");
const url = "https://www.marktplaats.nl/q/iphone+11/";
const fs = require("fs");
const { html } = require("cheerio/lib/static");
for (let i = 1; i <= 10; ++i) {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url + `p/${i}/`);
    const content = await page.content();

    await search(content, i);

    await browser.close();
  })();
}

async function search(content, pageNum) {
  console.log(pageNum);
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
  //#endregion
  //-----------------------------------------------------//

  //-----------------------------------------------------//
  //#region write to data.json
  // first check if there is already a data.json file to open
  let endData = {};
  try {
    const readData = JSON.parse(fs.readFileSync("data.json"));
    endData = readData;
    endData[`page ${pageNum}`] = itemObjects;
    fs.writeFileSync("data.json", JSON.stringify(endData, null, 2));
    // code continuing after this means that it did not fail
  } catch (err) {
    // so that means when the data.json file is empty or doesn't exist, i can immediately write to it
    endData[`page ${pageNum}`] = itemObjects;
    fs.writeFileSync("data.json", JSON.stringify(endData, null, 2));
  }
  //#endregion
  //-----------------------------------------------------//
}
