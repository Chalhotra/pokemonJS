class Pokemon {
  constructor(name, type, hp, attack, defense) {
    this.name = name;
    this.type = type;
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
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
