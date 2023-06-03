var pokemonlist = document.getElementById('pokemon-list');
var pokeInfo = document.getElementById('poke-info');
var heading = document.querySelector('h2');
var radnButton = document.querySelector('.random-btn');
var searchBar = document.querySelector('input');
var searchBar2 = document.querySelector('.fixed-bottom > form > input');
var submitbtn = document.querySelector('form > button');
var submitbtn2 = document.querySelector('.fixed-bottom > form > button');
var searchHistory = document.querySelector('.search-history');

// loop to add an event listener "generateList" on every generation button

for(let i = 1; i <= 9; ++i) {
  document.getElementById('gen-' + i).addEventListener('click', generateList);
  document.getElementById('gen-' + i + '-' + i).addEventListener('click', generateList);
}

// function to generate list of pokemon based on generation selected

function generateList(event) {
    heading.textContent = "Select a pokemon";
    pokemonlist.innerHTML = "";
    pokeInfo.setAttribute('style', 'display: none !important');
    pokemonlist.style.display = null;
    var mypokemon = [];
    searchHistory.setAttribute('style', 'display: none !important');
    fetch("https://pokeapi.co/api/v2/generation/" + event.target.id[event.target.id.length-1])
        .then(function (response) {
        return response.json()
        })
        .then(function(data) {
     
        for(var pokemon of data.pokemon_species) {
            mypokemon.push(pokemon.name);
        }
   
        mypokemon.sort();
   
        for(let j = 0; j < mypokemon.length; ++j) {
            fetch("https://pokeapi.co/api/v2/pokemon/" + mypokemon[j])
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                var entry = document.createElement('button');
                var image = document.createElement('img');
                var pokeName = document.createElement('div');
                image.src = data.sprites.front_default;
                pokeName.textContent = mypokemon[j];
                entry.style.textAlign = "center";
                entry.className = "btn btn-outline-light";
                entry.style.margin = "1rem";
                entry.id = mypokemon[j];
                entry.addEventListener('click', displayInfo);
                entry.appendChild(image);
                entry.appendChild(pokeName);
                pokemonlist.appendChild(entry);
            })
        }
    })
}

// function to display the information about the pokemon that was selected

function displayInfo(event) {
    heading.style.display = "none";
    pokeInfo.style.display = null;
    document.documentElement.scrollTop = 0;
    searchHistory.setAttribute('style', 'display: none !important');
    pokemonlist.setAttribute('style', 'display: none !important');
    pokeInfo.className = "d-flex flex-row-reverse flex-wrap-reverse justify-content-center";
    pokeInfo.innerHTML = "";
    pokeInfo.style.position = "relative";
    var backButton = document.createElement('button');
    backButton.className = "btn btn-outline-light";
    backButton.textContent = "Back";
    backButton.addEventListener('click', goBack);
    backButton.style.position = "absolute";
    backButton.style.right = "2rem";
    backButton.style.top = "0";
    if(event.target.localName != "button") {
        generateText(event.target.parentNode.id);
        localStorage.setItem(event.target.parentNode.id, event.target.parentNode.id);
    }
    else {
        generateText(event.target.id);
        localStorage.setItem(event.target.id, event.target.id);
    }
    pokeInfo.appendChild(backButton);
    var wordCloud = document.createElement('img');
    wordCloud.id = "wordCloud";
    pokeInfo.appendChild(wordCloud);
}

// function to generate the text for the word cloud from the wordCloud API.
// the text is generated by using the pokemon's name, type, and move set.

function generateText(pokemonName) {
    let pokemon = pokemonName;
    let text = "";
    var infocard = document.createElement('div');
    var infocardtitle = document.createElement('div');
    var pokeimage = document.createElement('img');

    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        data.moves.forEach(function(move) {
        text += move.move.name.replace("-", " ") + " ";
        fetch(data.species.url)
        .then(function (response) {
        return response.json()
        })
        .then(function (data2) {
   
   
    pokeimage.src = data.sprites.front_default;
    pokeimage.style.width = "200px";
    infocard.appendChild(pokeimage);
    infocardtitle.innerHTML = pokemon + '<br>' +  "Gen-" + data2.generation.url[data2.generation.url.length-2];
    infocardtitle.style.textAlign = "center";
    infocardtitle.style.fontSize = "2rem";
    infocard.appendChild(infocardtitle);
    infocard.className = "align-self-center";
    pokeInfo.appendChild(infocard);

    var type = data.types[0].type.name.toUpperCase();

    text += type + " "  +
    type + " " +
    type + " " +
    pokemon + " " +
    pokemon + " " +
    pokemon + " " +
    pokemon + " " +
    pokemon + " " +
    pokemon + " " +
    pokemon;
   
    fetch("https://textvis-word-cloud-v1.p.rapidapi.com/v1/textToCloud", {
        method: "POST",
        headers: {
       "x-rapidapi-host": "textvis-word-cloud-v1.p.rapidapi.com",
       "x-rapidapi-key": '1e54701521msh83fcf41713777e2p133787jsn43170dc8dfba',
       "content-type": "application/json",
       accept: "application/json"
    },
    body: JSON.stringify({
       text: text,
       scale: 1,
       width: 800,
       height: 800,
       colors: ["#375E97", "#FB6542", "#FFBB00", "#3F681C"],
       font: "Tahoma",
       use_stopwords: true,
       language: "en",
       uppercase: false
     })
   })
     .then(response => {
       return response.text();
     })
     .then(wordCloud => {
       var img = document.getElementById("wordCloud");
       img.src = wordCloud;
       img.height = 800;
       img.width = 800;
     })
     .catch(err => {
       console.log(err);
      });
    })
    })
     })
  }


// function for the 'Back' button to return to the generated list page

function goBack() {
    heading.style.display = "block";
    pokeInfo.setAttribute('style', 'display: none !important');
    pokemonlist.style.display = null;
}

function chooseRandom(event) {
    var generations = [1,2,9];
    searchHistory.setAttribute('style', 'display: none !important');
    var randomGeneration = generations[Math.floor(Math.random() * generations.length)];
    console.log(randomGeneration);
    fetch("https://pokeapi.co/api/v2/generation/" + randomGeneration)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        event.target.id = data.pokemon_species[Math.floor(Math.random()*data.pokemon_species.length)].name;
        console.log(event.target);
        displayInfo(event);
   })
}

function searchPokemon(event) {
    event.preventDefault();
    var pokemonSearchName = event.target.previousSibling.previousSibling.value.trim();
    pokemonSearchName = pokemonSearchName.split(' ').join('-').toLowerCase();
    event.target.id = pokemonSearchName;
    searchBar.value = "";
    displayInfo(event);
}

function searchPokemon2(event) {
    event.preventDefault();
    var pokemonSearchName = event.target.previousSibling.previousSibling.value.trim();
    pokemonSearchName = pokemonSearchName.split(' ').join('-').toLowerCase();
    event.target.id = pokemonSearchName;
    searchBar2.value = "";
    displayInfo(event);
}

function displayHistory() {
  if(localStorage.length > 0) {
    for(var i = 0; i < localStorage.length; ++i) {
      var entry = document.createElement('button');
      entry.innerHTML = localStorage.getItem(localStorage.key(i));
      entry.id = localStorage.key(i);
      entry.addEventListener('click', displayInfo);
      entry.className = "btn btn-outline-white mb-2";
      searchHistory.appendChild(entry);
     }
    }
  }

radnButton.addEventListener('click', chooseRandom);
submitbtn.addEventListener('click', searchPokemon);
submitbtn2.addEventListener('click', searchPokemon2);
displayHistory();