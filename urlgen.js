function urlGen(queryInfo) {
  const queryProdcut = queryInfo["product"].replace(/\s/g, "+");
  const queryCategory = queryInfo["categorie"];
  const queryAddress = queryInfo["postcode"];
  const queryDistance = queryInfo["afstandMeters"];
  const querySort = queryInfo["sort"];
  const BASEURL = "https://www.marktplaats.nl/";
  let sortString;
  switch (querySort) {
    case "Standaard":
      sortString = "sortBy:OPTIMIZED|sortOrder:DECREASING";
      break;
    case "Datum (nieuw-oud)":
      sortString = "sortBy:SORT_INDEX|sortOrder:DECREASING";
      break;
    case "Datum (oud-nieuw)":
      sortString = "sortBy:SORT_INDEX|sortOrder:INCREASING";
      break;
    case "Prijs (laag-hoog)":
      sortString = "sortBy:PRICE|sortOrder:INCREASING";
      break;
    case "Prijs (hoog-laag)":
      sortString = "sortBy:PRICE|sortOrder:DECREASING";
      break;
    case "Afstand":
      sortString = "sortBy:LOCATION|sortOrder:INCREASING";
      break;
    default:
      sortString = "sortBy:OPTIMIZED|sortOrder:DECREASING";
  }

  if (queryProdcut.length === 0) {
    console.error("Geen product ingevoerd");
    return;
  }

  // logic of generating
  if (
    queryProdcut.length > 0 &&
    queryCategory.length === 0 &&
    queryAddress.length === 0 &&
    queryDistance.length === 0 &&
    querySort.length === 0
  ) {
    console.log("alleen queryProdcut: ", queryProdcut);
    return BASEURL + `q/${queryProdcut}/`;
  }
  // when only the product and the category have a value
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length > 0 &&
    queryAddress.length === 0 &&
    queryDistance.length === 0 &&
    querySort.length === 0
  ) {
    return BASEURL + `l/${queryCategory}/#q:${queryProdcut}/`;
  }
  // when only the product and the queryAddress have a value
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length === 0 &&
    queryAddress.length > 0 &&
    queryDistance.length === 0 &&
    querySort.length === 0
  ) {
    console.warn("Er is geen afstand ingevoerd");
    return BASEURL + `q/${queryProdcut}/#postcode:${queryAddress}/`;
  }
  // when only the product and the queryDistance have a value
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length === 0 &&
    queryAddress.length === 0 &&
    queryDistance.length > 0 &&
    querySort.length === 0
  ) {
    console.warn("Er is geen postcode ingevoerd");
    return BASEURL + `q/${queryProdcut}/#distanceMeters:${queryDistance}/`;
  }
  // when only the product and the querySort have a value
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length === 0 &&
    queryAddress.length === 0 &&
    queryDistance.length === 0 &&
    querySort.length > 0
  ) {
    return BASEURL + `q/${queryProdcut}/#${sortString}/`;
  }
  // when there is a product, category and address
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length > 0 &&
    queryAddress.length > 0 &&
    queryDistance.length === 0 &&
    querySort.length === 0
  ) {
    return (
      BASEURL +
      `l/${queryCategory}/#q:${queryProdcut}|postcode:${queryAddress}/`
    );
  }
  // when there is a product, category and distance
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length > 0 &&
    queryAddress.length === 0 &&
    queryDistance.length > 0 &&
    querySort.length === 0
  ) {
    return (
      BASEURL +
      `l/${queryCategory}/#q:${queryProdcut}|distanceMeters:${queryDistance}/`
    );
  }
  // when there is a product, category and sortorder
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length > 0 &&
    queryAddress.length === 0 &&
    queryDistance.length === 0 &&
    querySort.length > 0
  ) {
    return BASEURL + `l/${queryCategory}/#q:${queryProdcut}|${sortString}/`;
  }
  // when there is a product, address and distance
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length === 0 &&
    queryAddress.length > 0 &&
    queryDistance.length > 0 &&
    querySort.length === 0
  ) {
    return (
      BASEURL +
      `q/${queryProdcut}/#distanceMeters:${queryDistance}|postcode:${queryAddress}/`
    );
  }
  // when there is a product, address and sort
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length === 0 &&
    queryAddress.length > 0 &&
    queryDistance.length === 0 &&
    querySort.length > 0
  ) {
    return (
      BASEURL + `q/${queryProdcut}/#${sortString}|postcode:${queryAddress}/`
    );
  }
  // when there is a product, distance and sortorder
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length === 0 &&
    queryAddress.length === 0 &&
    queryDistance.length > 0 &&
    querySort.length > 0
  ) {
    return (
      BASEURL +
      `q/${queryProdcut}/#${sortString}|distanceMeters:${queryDistance}/`
    );
  }
  // when there is a product, category, address and distance
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length > 0 &&
    queryAddress.length > 0 &&
    queryDistance.length > 0 &&
    querySort.length === 0
  ) {
    return (
      BASEURL +
      `l/${queryCategory}/#q:${queryProdcut}|distanceMeters:${queryDistance}|postcode:${queryAddress}/`
    );
  }
  // when there is a product, category, address and sortorder
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length > 0 &&
    queryAddress.length > 0 &&
    queryDistance.length === 0 &&
    querySort.length > 0
  ) {
    return (
      BASEURL +
      `l/${queryCategory}/#q:${queryProdcut}|${sortString}|postcode:${queryAddress}/`
    );
  }
  // when there is a product, category, distance and sortorder
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length > 0 &&
    queryAddress.length === 0 &&
    queryDistance.length > 0 &&
    querySort.length > 0
  ) {
    return (
      BASEURL +
      `l/${queryCategory}/#q:${queryProdcut}|${sortString}|distanceMeters:${queryDistance}/`
    );
  }
  // when there is a product, address, distance and sortorder
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length === 0 &&
    queryAddress.length > 0 &&
    queryDistance.length > 0 &&
    querySort.length > 0
  ) {
    return (
      BASEURL +
      `q/${queryProdcut}/#${sortString}|distanceMeters:${queryDistance}|postcode:${queryAddress}/`
    );
  }
  // when every parameter is present
  else if (
    queryProdcut.length > 0 &&
    queryCategory.length > 0 &&
    queryAddress.length > 0 &&
    queryDistance.length > 0 &&
    querySort.length > 0
  ) {
    return (
      BASEURL +
      `l/${queryCategory}/#q:${queryProdcut}|${sortString}|distanceMeters:${queryDistance}|postcode:${queryAddress}/`
    );
  }
}

exports.urlGen = urlGen;
