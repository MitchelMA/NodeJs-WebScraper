function urlGen(queryInfo) {
  console.log(queryInfo);
  const queryProdcut = queryInfo["product"];
  const queryCategory = queryInfo["categorie"];
  const queryAddress = queryInfo["postcode"];
  const queryDistance = queryInfo["afstandMeters"];

  // logic of generating
}

exports.urlGen = urlGen;
