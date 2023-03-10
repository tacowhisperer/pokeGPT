/**
 * Calculates the HP stat of a Pokémon based on its base, IV, EV, and level.
 *
 * @param {number} base - The base HP stat of the Pokémon.
 * @param {number} iv - The individual value (IV) of the Pokémon's HP stat.
 * @param {number} ev - The effort value (EV) of the Pokémon's HP stat.
 * @param {number} lv - The level of the Pokémon.
 * @returns {number} The calculated HP stat of the Pokémon.
 */
function calcHP(base, iv, ev, lv) {
  return Math.floor(0.01 * (2 * base + iv + Math.floor(0.25 * ev)) * lv) + lv + 10;
}

/**
 * Calculates the non-HP stat of a Pokémon based on its base, IV, EV, nature, and level.
 *
 * @param {number} base - The base non-HP stat of the Pokémon.
 * @param {number} iv - The individual value (IV) of the Pokémon's non-HP stat.
 * @param {number} ev - The effort value (EV) of the Pokémon's non-HP stat.
 * @param {number} lv - The level of the Pokémon.
 * @param {number} nature - The nature modifier of the Pokémon.
 * @returns {number} The calculated non-HP stat of the Pokémon.
 */
function calcNonHP(base, iv, ev, lv, nature) {
  return nature * (Math.floor(0.01 * (2 * base + iv + Math.floor(0.25 * ev)) * lv) + 5);
}

/**
 * Calculates the nature modifier for a given stat and nature combination.
 *
 * @param {string} stat - The stat to calculate the nature modifier for.
 * @param {string} nature - The nature of the Pokémon.
 * @returns {number} The nature modifier for the given stat and nature combination.
 */
function calcNatureMod(stat, nature) {
  let increase = '';
  let decrease = '';

  // Determine the stat that the nature increases and decreases
  switch (nature) {
    case 'lonely':
    case 'adamant':
    case 'naughty':
    case 'brave':
      increase = 'attack';
      decrease = 'defense';
      break;
    case 'bold':
    case 'impish':
    case 'lax':
    case 'relaxed':
      increase = 'defense';
      decrease = 'attack';
      break;
    case 'timid':
    case 'hasty':
    case 'jolly':
    case 'naive':
      increase = 'speed';
      decrease = 'defense';
      break;
    case 'modest':
    case 'mild':
    case 'quiet':
    case 'rash':
      increase = 'special attack';
      decrease = 'attack';
      break;
    case 'calm':
    case 'gentle':
    case 'sassy':
    case 'careful':
      increase = 'special defense';
      decrease = 'special attack';
      break;
    default:
      return 1;
  }

  // Return the nature modifier based on the given stat and nature
  if (stat === increase) {
    return 1.1;
  } else if (stat === decrease) {
    return 0.9;
  } else {
    return 1;
  }
}

/**
 * Calculates the type effectiveness of a Pokémon's attack against a defender's type.
 *
 * @param {string} attackerType - The type of the Pokémon using the attack.
 * @param {string} defenderType - The type of the Pokémon being attacked.
 * @returns {number} A number value representing the effectiveness of the attack.
 */
function calcTypeMod(attackerType, defenderType) {
  const effectiveness = {
    bug: { fighting: 0.5, flying: 2, ground: 0.5, rock: 2, fire: 2, grass: 0.5 },
    dark: { fighting: 2, psychic: 0, bug: 2, ghost: 0.5, dark: 0.5, fairy: 2 },
    dragon: { fire: 0.5, water: 0.5, electric: 0.5, grass: 0.5, ice: 2, dragon: 2, fairy: 2 },
    electric: { flying: 0.5, ground: 2, electric: 0.5, dragon: 0.5, steel: 0.5 },
    fairy: { fighting: 0.5, poison: 2, bug: 0.5, dragon: 0, dark: 0.5, steel: 2 },
    fighting: { flying: 2, rock: 0.5, bug: 0.5, psychic: 2, dark: 0.5, fairy: 2 },
    fire: { rock: 2, bug: 0.5, steel: 0.5, fire: 0.5, water: 2, grass: 0.5, ice: 0.5, dragon: 0.5, ground: 2, fairy: 0.5 },
    flying: { fighting: 0.5, rock: 2, bug: 0.5, grass: 0.5, electric: 2, ice: 2, ground: 0 },
    ghost: { normal: 0, fighting: 0, poison: 0.5, bug: 0.5, ghost: 2, dark: 2 },
    grass: { flying: 2, poison: 2, ground: 0.5, bug: 2, fire: 2, grass: 0.5, water: 0.5, electric: 0.5, ice: 2 },
    ground: { poison: 0.5, rock: 2, water: 2, grass: 0.5, electric: 0, ice: 2 },
    ice: { steel: 2, fire: 2, ice: 0.5, rock: 2, fighting: 2 },
    normal: { fighting: 2, ghost: 0 },
    poison: { fighting: 0.5, poison: 0.5, ground: 2, bug: 0.5, grass: 0.5, fairy: 0.5, psychic: 2 },
    psychic: { fighting: 0.5, psychic: 0.5, dark: 2, ghost: 2, bug: 2 },
    rock: { normal: 0.5, fighting: 2, flying: 0.5, poison: 0.5, ground: 2, steel: 2, fire: 0.5, water: 2, grass: 2 },
    steel: { normal: 0.5, fighting: 2, flying: 0.5, rock: 0.5, bug: 0.5, steel: 0.5, fire: 2, grass: 0.5, ice: 0.5, fairy: 0.5, poison: 0, ground: 2, psychic: 0.5, dragon: 0.5 },
    water: { fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, steel: 0.5 }
  };

  if (effectiveness[defenderType.toLowerCase()].hasOwnProperty(attackerType.toLowerCase())) {
    return effectiveness[defenderType.toLowerCase()][attackerType.toLowerCase()];
  }

  // All undefined combination types hit for neutral damage
  return 1;
}

/**
 * Calculates the damage of a move in Generation III of the Pokémon games.
 * @param {number} level - The level of the attacking Pokémon.
 * @param {number} a - The effective Attack stat of the attacking Pokémon, or the base Attack of the Pokémon performing Beat Up.
 * @param {number} d - The effective Defense stat of the target, or the base Defense of the target for Beat Up.
 * @param {number} power - The effective power of the used move.
 * @param {number} burn - 0.5 if the attacker is burned, 1 otherwise.
 * @param {number} screen - 0.5, 2/3, or 1 depending on the presence of Reflect/Light Screen and whether it's a Double Battle.
 * @param {number} targets - 0.5 in Double Battles if the move targets both foes, 1 otherwise.
 * @param {number} weather - 0.5, 1, or 1.5 depending on the weather and the presence of Cloud Nine/Air Lock.
 * @param {number} ff - 1.5 if the attacker has Flash Fire and the move is Fire-type, 1 otherwise.
 * @param {number} stockpile - 1, 2, or 3 depending on Stockpiles done for Spit Up, 1 otherwise.
 * @param {number} critical - 2 for a critical hit, 1 otherwise.
 * @param {number} doubleDmg - 2 if the used move is one of the following moves and conditions apply, 1 otherwise:
 *                           - Gust or Twister and the target is in the semi-invulnerable turn of Fly or Bounce.
 *                           - Stomp, Needle Arm, Astonish, or Extrasensory and the target has previously used Minimize.
 *                           - Surf or Whirlpool and the target is in the semi-invulnerable turn of Dive.
 *                           - Earthquake or Magnitude and the target is in the semi-invulnerable turn of Dig.
 *                           - Pursuit and the target is attempting to switch out.
 *                           - Facade and the user is poisoned, burned, or paralyzed.
 *                           - SmellingSalt and the target is paralyzed.
 *                           - Revenge and the attacker has been damaged by the target this turn.
 *                           - Weather Ball, there is non-clear weather, and no Pokémon on the field have the Ability Cloud Nine or Air Lock.
 * @param {number} charge - 2 if the move is Electric-type and Charge takes effect, 1 otherwise.
 * @param {number} hh - 1.5 if the attacker's ally used Helping Hand, 1 otherwise.
 * @param {number} stab - Same-Type Attack Bonus. 1 if the move's type doesn't match one of the user's types, 1.5 otherwise.
 * @param {number} type - The type effectiveness. Can be 0.25, 0.5, 1, 2, or 4.
 * @param {boolean} spitUp - True if the move is Spit Up, false otherwise.
 * @returns {number} - The calculated damage.
 */

function calcGenIIIDamage(level, a, d, power, burn, screen, targets, weather, ff, stockpile, critical, doubleDmg, charge, hh, stab, type, spitUp) {
  let damage = (((2 * level / 5) + 2) * power * a / d / 50) * burn * screen * targets * weather * ff + 2;

  if (spitUp) {
    return damage * stockpile * hh * stab * type;
  }

  damage *= critical * doubleDmg * charge * hh * stab * type;

  return damage * Math.floor(Math.random() * (100 - 85 + 1) + 85) / 100;;
}
