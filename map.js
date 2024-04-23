const num_bushes = 40;
const num_pokeballs = 10;
const player = document.querySelector(".player");
const balls = [];
const bushes = [];
const sound = new Audio("assets/coin.mp3");
const pokemons = [];
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
document.addEventListener("DOMContentLoaded", async function () {
  try {
    for (let i = 1; i <= 20; i++) {
      await getPokemon(i);
    }
    console.log(pokemons);
    init();
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
  }
});

const player_pos = {
  x: parseInt(window.innerWidth / 2),
  y: parseInt(window.innerHeight / 2),
};

const player_vel = {
  x: 0,
  y: 0,
};

function collision($div1, $div2) {
  var x1 = $div1.getBoundingClientRect().left;
  var y1 = $div1.getBoundingClientRect().top;
  var h1 = $div1.clientHeight;
  var w1 = $div1.clientWidth;
  var b1 = y1 + h1;
  var r1 = x1 + w1;

  var x2 = $div2.getBoundingClientRect().left;
  var y2 = $div2.getBoundingClientRect().top;
  var h2 = $div2.clientHeight;
  var w2 = $div2.clientWidth;
  var b2 = y2 + h2;
  var r2 = x2 + w2;

  if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
  return true;
}

function checkCollisions() {
  balls.forEach((ball) => {
    if (collision(ball.ball, player)) {
      ball.ball.remove();
      sound.play();
      console.log(ball.pok);
      // generateCard(ball.pok);
      pokemonID = ball.pok.id;
      window.location.href = `card-page.html?id=${pokemonID}`;
      generateBall();
    }
  });
}

function createBushes() {
  for (let i = 0; i < num_bushes; i++) {
    const div = document.createElement("div");
    div.classList.add("bush");
    let x = Math.random() * 100 + "%";
    let y = Math.random() * 100 + "%";
    div.style.left = x;
    div.style.top = y;
    bushes.push({
      bush: div,
      pos: {
        x: x,
        y: y,
      },
    });
    document.body.appendChild(div);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function generateBall() {
  let ballExists = false;
  let randomPokemon = Math.floor(Math.random() * pokemons.length);
  const pokData = pokemons[randomPokemon];
  console.log(pokData);
  console.log(pokData.type);
  while (!ballExists) {
    let randomIndex = Math.floor(Math.random() * bushes.length);
    let randomBush = bushes[randomIndex];

    if (!randomBush.containsBall) {
      const pokeball = document.createElement("div");
      pokeball.classList.add("pokeball");
      pokeball.style.left = randomBush.pos.x;
      pokeball.style.top = randomBush.pos.y;
      document.body.appendChild(pokeball);

      const pokemon = new Pokemon(
        pokData.name,
        pokData.type,
        pokData.hp,
        pokData.attack,
        pokData.defense,
        pokData.img,
        pokData.id
      );

      balls.push({
        ball: pokeball,
        pos: {
          x: randomBush.pos.x,
          y: randomBush.pos.y,
        },
        pok: pokemon,
      });

      randomBush.containsBall = true;
      ballExists = true;
    }
  }
}

function createBalls() {
  for (let i = 0; i < num_bushes; i++) {
    const addPokeball = Math.random() < num_pokeballs / num_bushes;
    if (addPokeball) {
      generateBall();
    }
  }
}

function init() {
  createBushes();
  createBalls();

  run();
}

function run() {
  player_pos.x += player_vel.x;
  player_pos.y += player_vel.y;

  player.style.left = player_pos.x + "px";
  player.style.bottom = player_pos.y + "px";
  checkCollisions();
  requestAnimationFrame(run);
}

window.addEventListener("keydown", function (e) {
  if (e.key == "ArrowDown") {
    player_vel.y = -3;
    player.style.backgroundImage = `url("assets/player_back.png")`;
  }
  if (e.key == "ArrowRight") {
    player_vel.x = 3;
    player.style.backgroundImage = `url("assets/player_right.png")`;
  }
  if (e.key == "ArrowLeft") {
    player_vel.x = -3;
    player.style.backgroundImage = `url("assets/player_left.png")`;
  }
  if (e.key == "ArrowUp") {
    player_vel.y = 3;
    player.style.backgroundImage = `url("assets/player_front.png")`;
  }
  player.classList.add("active");
});

window.addEventListener("keyup", function () {
  player_vel.x = 0;
  player_vel.y = 0;
  player.classList.remove("active");
});

// battle logic here
class Pokemon {
  constructor(name, type, hp, attack, defense, img, id) {
    this.name = name;
    this.type = type;
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
    this.img = img;
    this.id = id;
  }

  takeDamage(damage) {
    this.hp -= damage;
  }

  useMove(move, target) {
    let damage = this.attack - target.defense;
    target.takeDamage(damage);
    console.log(`${this.name} used ${move.name}!`);
    console.log(`${target.name} took ${damage} damage.`);
  }
}

class Move {
  constructor(name, type, power) {
    this.name = name;
    this.type = type;
    this.power = power;
  }
}

function calculateDamage(move, attacker, defender) {
  let effectiveness = 1;

  // Check type advantages
  if (move.type === "Electric" && defender.type === "Water") {
    effectiveness = 2; // Electric moves are super effective against Water Pokémon
  } else if (move.type === "Water" && defender.type === "Fire") {
    effectiveness = 2; // Water moves are super effective against Fire Pokémon
  } else if (move.type === "Fire" && defender.type === "Grass") {
    effectiveness = 2; // Fire moves are super effective against Grass Pokémon
  }

  let damage = Math.floor(
    (move.power * attacker.attack * effectiveness) / defender.defense
  );
  return damage;
}

function battle(attacker, defender, move) {
  let damage = calculateDamage(move, attacker, defender);
  defender.takeDamage(damage);
  console.log(`${attacker.name} used ${move.name}!`);
  console.log(`${defender.name} took ${damage} damage.`);
}

//battle logic ends

//fetching pokemon data
async function getPokemon(pok_num) {
  let url = "https://pokeapi.co/api/v2/pokemon/" + pok_num.toString();

  let res = await fetch(url);
  let pokemon = await res.json();
  console.log(pokemon);

  let pokemonName = pokemon.name;
  let pokemonType = pokemon.types.map((type) => type.type.name);
  let pokemonImg = pokemon.sprites.front_default;
  let pokemonHP = pokemon.stats[0].base_stat;
  let pokemonAttack = pokemon.stats[1].base_stat;
  let pokemonDefense = pokemon.stats[2].base_stat;

  res = await fetch(pokemon.species.url);
  let pokemonDesc = await res.json();

  pokemonDesc = pokemonDesc.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  ).flavor_text;

  pokemons.push({
    id: pok_num,
    name: pokemonName,
    type: pokemonType,
    img: pokemonImg,
    hp: pokemonHP,
    attack: pokemonAttack,
    defense: pokemonDefense,
    description: pokemonDesc,
  });
}
