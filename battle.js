let currentPokemonId = null;

// let typeMatch = {
//   Charizard: [["ground"], ["water", "rock"], ["fire", "grass", "stew"]],
//   Blastoise: [[""], ["grass"], ["fire", "water"]],
//   Venusaur: [["poison"], ["fire", "fly", "ice", "steel"], ["grass", "water"]],
// };

document.addEventListener("DOMContentLoaded", () => {
  try {
    const MAX_POKEMONS = 20;
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10);

    if (id < 1 || id > MAX_POKEMONS) {
      return (window.location.href = "./map.html");
    }

    currentPokemonId = id;
    loadPokemon(id);
  } catch (error) {
    console.error("an error occurred");
  } finally {
    loadingScreen.style.display = "none"; // Hide loading screen
  }
});

async function loadPokemon(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    // let randomPokemonID = Math.floor(Math.random() * 20);
    let randomPokemonID = Math.floor(Math.random() * 20);

    const [randomPokemon, randomPokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonID}`).then(
        (res) => res.json()
      ),
      fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${randomPokemonID}`
      ).then((res) => res.json()),
    ]);

    const pokemonMoves = await Promise.all(
      pokemon.moves.map(async (item) => {
        return await fetchMoveDetails(item.move.name.toString());
      })
    );

    const randomPokemonMoves = await Promise.all(
      randomPokemon.moves.map(async (item) => {
        return await fetchMoveDetails(item.move.name.toString());
      })
    );
    if (pokemonMoves) {
      displayNone();
    }
    console.log(pokemon);
    console.log(randomPokemon);
    pokemonList = [pokemon, randomPokemon];
    let pk1 = spawn(pokemon, pokemonMoves, true, "back");
    s1 = document.createElement("img");
    s1.src = pk1.sprite;

    document.getElementById("pk1").appendChild(s1);
    document.getElementById("hp1").innerHTML =
      `<p>HP: ` + pk1.hp + "/" + pk1.fullhp + `</p>`;

    let pk2 = spawn(randomPokemon, randomPokemonMoves, false, "front");
    s2 = document.createElement("img");
    s2.src = pk2.sprite;

    document.getElementById("pk2").appendChild(s2);
    document.getElementById("hp2").innerHTML =
      `<p>HP: ` + pk2.hp + "/" + pk2.fullhp + `</p>`;

    for (let i = 0; i < 4; i++) {
      let btn = document.getElementById("m" + i);
      let move = pk1.moves[i];
      let move2 = pk2.moves[Math.floor(Math.random() * 3)];

      const mtypeDet = await getTypeDetails(move.type.name);

      const rtypeDet = await getTypeDetails(move2.type.name);
      console.log(rtypeDet);
      function addHandler(btn, move, pk1, pk2) {
        btn.addEventListener("click", function (e) {
          attack(move, pk1, pk2, "hp1", "", mtypeDet);
          setTimeout(attack, 2000, move2, pk2, pk1, "hp2", "Foe ", rtypeDet);
        });
      }
      addHandler(btn, move, pk1, pk2);
    }

    return true;
  } catch (error) {
    console.error("An error occured while fetching Pokemon data:", error);
    return false;
  }
}

function displatNone() {}

const typeColor = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF",
};

const card = document.getElementById("battleCard");
async function fetchMoveDetails(moveName) {
  let url = `https://pokeapi.co/api/v2/move/${moveName}`;
  try {
    const moveData = await fetch(url).then((res) => res.json());
    console.log(moveData);
    return moveData;
  } catch {
    console.error("An error occurred while fetching pokemon move details");
  }
}
const typeDetailsCache = {};

async function getTypeDetails(typeName) {
  // Check if the type details are already cached
  if (typeDetailsCache[typeName]) {
    return typeDetailsCache[typeName];
  }

  const url = `https://pokeapi.co/api/v2/type/${typeName}`;
  const typeMatch = [[], [], []]; // Initialize as empty arrays

  try {
    const typeData = await fetch(url).then((res) => res.json());
    let noDamage = typeData.damage_relations.no_damage_to;
    let doubleDamage = typeData.damage_relations.double_damage_to;
    let halfDamage = typeData.damage_relations.half_damage_to;

    // Populate typeMatch arrays correctly
    noDamage.forEach((item) => {
      typeMatch[0].push(item.name);
    });
    doubleDamage.forEach((item) => {
      typeMatch[1].push(item.name);
    });
    halfDamage.forEach((item) => {
      typeMatch[2].push(item.name);
    });

    // Cache the result before returning
    typeDetailsCache[typeName] = typeMatch;
    return typeMatch;
  } catch {
    console.error(`details for ${typeName} couldn't be fetched`);
  }
}

let generateCard = (data, doc_id) => {
  console.log(data);
  const hp = data.stats[0].base_stat;
  const imgSrc = data.sprites.other.dream_world.front_default;
  const pokeName = data.name[0].toUpperCase() + data.name.slice(1);
  const statAttack = data.stats[1].base_stat;
  const statDefense = data.stats[2].base_stat;
  const statSpeed = data.stats[5].base_stat;
  const moves = data.moves;
  console.log(hp);
  const themeColor = typeColor[data.types[0].type.name];
  console.log(themeColor);
  document.getElementById(doc_id).innerHTML = `
            <p class="hp">
              <span>HP</span>
                ${hp}
            </p>
            <img id = "battleCardImage" src=${imgSrc} />
            <h2 class="poke-name">${pokeName}</h2>
            <div class="types">

            </div>

      `;

  appendTypes(data.types);
  styleCard(themeColor, doc_id);
};

let appendTypes = (types) => {
  types.forEach((item) => {
    let span = document.createElement("SPAN");
    span.textContent = item.type.name;
    document.querySelector(".types").appendChild(span);
  });
};
let styleCard = (color, elementID) => {
  const card1 = document.getElementById(elementID);

  card1.style.background = `radial-gradient(circle at 50% 0%, ${color} 40%, #ffffff 36% `;
  card1.querySelectorAll(".types span").forEach((typeColor) => {
    typeColor.style.backgroundColor = color;
  });
};

//battle logic video
class Pokemon {
  constructor(name, sprite, hp, moves, attack, defense) {
    this.name = name;
    this.sprite = sprite;
    this.hp = hp;
    this.moves = moveArray;
    this.attack = attack;
    this.defense = defense;

    this.fullhp = hp;
  }
}

function spawn(pkm, moveData, bool, side) {
  moveArray = moveData;

  const name = pkm.name;
  const hp = pkm.stats[0].base_stat;
  const imgSrc =
    side == "front"
      ? pkm.sprites.other.showdown.front_default
      : pkm.sprites.other.showdown.back_default;
  const pokeName = pkm.name[0].toUpperCase() + pkm.name.slice(1);
  const statAttack = pkm.stats[1].base_stat;
  const statDefense = pkm.stats[2].base_stat;
  const statSpeed = pkm.stats[5].base_stat;
  const moves = moveArray;

  let pokemon = new Pokemon(name, imgSrc, hp, moves, statAttack, statDefense);
  console.log(moves);
  console.log(pokemon.sprite);

  if (bool) {
    for (let i = 0; i < 4; i++) {
      document.getElementById("m" + i).value = pokemon.moves[i].name;
    }
  }
  return pokemon;
}

function attack(move, attacker, receiver, hp, owner, rtypeDet) {
  console.log(move);
  document.getElementById("comment").innerHTML =
    "<p>" + owner + attacker.name + " used " + move.name + "!</p>";

  if (Math.random() < move.accuracy / 100) {
    let power = move.power;
    console.log(power);

    let rtype = rtypeDet;
    console.log(rtype.length);
    let mtype = move.type.name;
    let scale = 1;

    for (let i = 0; i < rtype.length; i++) {
      //   console.log("rtype" + rtype);
      //   console.log("mtype" + mtype);
      console.log(rtype[i]);
      console.log("mtype: " + mtype);
      if (rtype[i].includes(mtype)) {
        switch (i) {
          case 0:
            scale = 0;
            setTimeout(() => {
              document.getElementById("comment").innerHTML =
                "<p>It had no effect!</p>";
            }, 1000);
          case 1:
            scale = 2;
            setTimeout(() => {
              document.getElementById("comment").innerHTML =
                "<p>It was super effective!</p>";
            }, 1000);
          case 2:
            scale = 0.5;
            setTimeout(() => {
              document.getElementById("comment").innerHTML =
                "<p>It was not very effective</p>";
            }, 1000);
            break;
        }

        break;
      } else {
        console.log("nothing happened");
      }
    }
    power *= scale;
    receiver.hp -= Math.floor(power);
    document.getElementById(hp).innerHTML =
      "<p>HP: " + receiver.hp + "/" + receiver.fullhp + "</p>";
  } else {
    setTimeout(function () {
      document.getElementById("comment").innerHTML = "<p>Attack Missed!</p>";
    }, 2000);
  }
  checkWinner(attacker, receiver);
}

function displayNone() {
  comment = document.getElementById("comment");
  comment.innerHTML = "<p>Play a move</p>";
}

// function checkWinner(hp) {
//   let f = pk1.hp <= 0 ? pk1 : pk2.hp <= 0 ? pk2 : false;
//   if (f != false) {
//     alert("GAME OVER: " + f.name + "fainted!");
//     document.getElementById(hp).innerHTML = "<p>HP: 0/" + f.fullhp + "</p>";
//     setTimeout(function () {
//       location.reload;
//     }, 1500);
//   }
// }

function checkWinner(pk1, pk2) {
  // Determine the winner based on HP
  let winner = pk1.hp <= 0 ? pk2 : pk2.hp <= 0 ? pk1 : null;

  if (winner == pk1) {
    alert("GAME OVER: " + pk1.name + " fainted!");
    // Update the HP display for the winner
    document.getElementById(
      "hp1"
    ).innerHTML = `<p>HP: ${pk1.hp}/${pk1.fullhp}</p>`;
    document.getElementById("hp2").innerHTML = `<p>HP: 0/${pk2.fullhp}</p>`;
    // Reload the page after a delay
    setTimeout(function () {
      window.location.href = "map.html";
    }, 1500);
  } else if (winner == pk2) {
    alert("GAME OVER: " + pk2.name + " fainted!");
    // Update the HP display for the winner
    document.getElementById("hp1").innerHTML = `<p>HP: 0/${pk1.fullhp}</p>`;
    document.getElementById(
      "hp2"
    ).innerHTML = `<p>HP: ${pk2.hp}/${pk2.fullhp}</p>`;
    // Reload the page after a delay
    setTimeout(function () {
      window.location.href = "map.html";
    }, 1500);
  }
}
