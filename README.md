# Web-scraper in NodeJS
Dit is een prototype voor een web-scraper.  
Op het moment is de enige zoekterm "Iphone 11" op [Marktplaats](https://marktplaats.nl) en gaat het de pagina's 1 tot en met 10 af en slaat de informatie van de producten vervolgens op in een .json bestand.  
Dit bestand kan vervolgens uitgelezen worden door een programma, maar op het moment wordt er nog niks mee gedaan.
## Begin
Als je net de repo hebt gecloned, run dan eerst 
```Terminal
npm install
```
in de directory waar het ".git" bestand in zit voordat je ook maar iets gaat doen. 
Dit command zorgt er namelijk voor dat de benodigde dependencies worden gedownload.  
Zorg er ook voor dat je een ".env" bestand in je directory hebt staan met het volgende erin:
```env
EMAIL_SENDER=email-sender-address
EMAIL_RECIEVER=email-reciever-address
EMAIL_PASSWORD=email-sender-password
```

## Info
Ik doe hier een poging om ee web-scraper te maken in NodeJS.
Hiervoor gebruik ik de volgende pagina voor informatie: [The Ultimate Guide to Web Scraping with Node.js](https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/)  
Verder maak ik gebruik van de volgende dependencies:
 - cheerio
 - puppeteer
 - request
 - request-promise
 - dotenv
 - nodemailer
  
 versies staan in de [package.json](./package.json).