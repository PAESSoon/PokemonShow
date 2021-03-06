let typeOfCards = [];
let uniqueTypes = [];
let typeList = document.querySelector("#type-list");
let listSelection = typeList.options[typeList.selectedIndex].text;
let userSelectedType = "Any";
let userSelectedRarity = "Any";

// ************** Checkbox for Rarity ***************
function updateCards(checkbox) {
  var checkboxes = document.getElementsByName("1");
  checkboxes.forEach((item) => {
    if (item !== checkbox) item.checked = false;
  });

  const selector = "label[for=" + checkbox.id + "]";
  const check_label = document.querySelector(selector);
  let query = check_label.innerHTML;
  console.log(query);
  userSelectedRarity = query;

  fetch("https://api.pokemontcg.io/v2/cards?", {
    method: "GET",
  })
    .then((response) => response.json())
    .then(function (json) {
      updateTypes(json, userSelectedRarity, userSelectedType);
    })
    .catch((err) => console.log(err));
}

// ************** Dropdown List for Types ***************
function myFunction() {
  fetch("https://api.pokemontcg.io/v2/cards?", {
    method: "GET",
  })
    .then((response) => response.json())
    .then(function (json) {
      getTypes(json);
    })
    .then(function () {
      displayTypes();
    })
    .catch((err) => console.log(err));
}

// ************** Show options in Dropdown List ***************
function getTypes(json) {
  updateTypes(json, "any", "any");
  for (item of json.data) {
    let singleType = item.types[0];
    typeOfCards.push(singleType);
  }
}

function displayTypes() {
  // console.log("typeOfCards: " + typeOfCards);
  uniqueTypes = typeOfCards.filter((v, i, a) => a.indexOf(v) === i);
  // console.log("Unique:" + uniqueTypes);

  for (let i = 0; i < uniqueTypes.length; i++) {
    const singleOption = document.createElement("option");
    singleOption.setAttribute("value", uniqueTypes[i]);
    singleOption.innerHTML = uniqueTypes[i];

    typeList.append(singleOption);
  }

  listSelection = typeList.options[typeList.selectedIndex].text;
}

// ************** When Select an option in Dropdown List ***************
function updatePage(value) {
  userSelectedType = value;
  fetch("https://api.pokemontcg.io/v2/cards?", {
    method: "GET",
  })
    .then((response) => response.json())
    // .then((json) => console.log(json))
    .then(function (json) {
      updateTypes(json, userSelectedRarity, userSelectedType);
    })
    .catch((err) => console.log(err));
}

function updateTypes(json, cardRarity, cardType) {
  console.log("CardType: " + cardType);
  console.log("CardRarity: " + cardRarity);
  const results = document.querySelector("#results");
  results.innerHTML = "";
  if (cardRarity.toLowerCase() === "any" && cardType.toLowerCase() === "any") {
    console.log("In 1st if");
    for (let item of json.data) {
      if (item.images !== undefined) {
        helper(item);
      }
    }
  } else if (cardType.toLowerCase() === "any") {
    console.log("In 1st else if");
    for (item of json.data) {
      if (item.rarity !== undefined) {
        if (
          item.rarity.toLowerCase() === cardRarity.toLowerCase() &&
          item.images !== undefined
        ) {
          helper(item);
        }
      }
    }
  } else if (cardRarity.toLowerCase() === "any") {
    console.log("In 2nd else if");
    for (item of json.data) {
      if (cardType === item.types[0] && item.images !== undefined) {
        helper(item);
      }
      // console.log(cardType);
      // console.log(item.types[0]);
    }
  } else {
    console.log("In else");
    for (item of json.data) {
      if (item.rarity !== undefined) {
        if (
          item.rarity.toLowerCase() === cardRarity.toLowerCase() &&
          cardType === item.types[0] &&
          item.images !== undefined
        ) {
          helper(item);
        }
      }
    }
  }
}

function firstLetterToUpperCase(word) {
  let firstLetter = word.substring(0, 1);
  let result = firstLetter.toUpperCase() + word.substring(1);
  return result;
}

function helper(item) {
  console.log("in helper");
  console.log(item);
  const name = item.name;
  const cardType = item.types[0];
  const rarity = item.rarity;

  // console.log(item.attacks[0].text);
  const text = item.attacks ? item.attacks[0].text : "";
  const imgURL = item.images.small;
  const div = document.createElement("div");
  div.className = "item fade-in-image";

  const parafImg = document.createElement("img");
  parafImg.setAttribute("src", imgURL);
  parafImg.setAttribute("alt", "some image");
  div.append(parafImg);

  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-description");

  const parafName = document.createElement("h5");
  parafName.innerHTML = name;
  parafName.setAttribute("class", "card-title");

  const parafType = document.createElement("p");
  parafType.innerHTML = "<span>Type: </span>" + cardType;
  parafType.setAttribute("class", "card-text");

  const parafRarity = document.createElement("p");
  console.log(rarity);
  if (rarity !== undefined) {
    parafRarity.innerHTML =
      "<span>Rarity: </span>" + firstLetterToUpperCase(rarity);
    parafRarity.setAttribute("class", "card-text");
  } else {
    parafRarity.remove();
  }

  const parafText = document.createElement("p");
  parafText.innerHTML = text;
  parafText.setAttribute("class", "card-text desc");

  cardBody.append(parafName);
  cardBody.append(parafType);
  cardBody.append(parafRarity);
  cardBody.append(parafText);

  div.append(cardBody);

  results.append(div);
}
