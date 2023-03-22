/**
 * A global counter used for generating unique IDs for static instances of Objects.
 * @type {number}
 */
let __static__ = 0;

/**
 * Represents a Pokemon type.
 * @class
 */
function Type() {
  /**
   * The unique ID of the type.
   * @private
   * @type {number}
   */
  const _id = __static__++;

  /**
   * A mapping of effectiveness values for each type against this type.
   * @private
   * @type {Object.<string, Object.<string, number>>}
   */
  const _effectiveness = {
    [Type.BUG]: { [Type.FIGHTING]: 0.5, [Type.FLYING]: 2, [Type.GROUND]: 0.5, [Type.ROCK]: 2, [Type.FIRE]: 2, [Type.GRASS]: 0.5 },
    [Type.DARK]: { [Type.FIGHTING]: 2, [Type.PSYCHIC]: 0, [Type.BUG]: 2, [Type.GHOST]: 0.5, [Type.DARK]: 0.5, [Type.FAIRY]: 2 },
    [Type.DRAGON]: { [Type.FIRE]: 0.5, [Type.WATER]: 0.5, [Type.ELECTRIC]: 0.5, [Type.GRASS]: 0.5, [Type.ICE]: 2, [Type.DRAGON]: 2, [Type.FAIRY]: 2 },
    [Type.ELECTRIC]: { [Type.FLYING]: 0.5, [Type.GROUND]: 2, [Type.ELECTRIC]: 0.5, [Type.DRAGON]: 0.5, [Type.STEEL]: 0.5 },
    [Type.FAIRY]: { [Type.FIGHTING]: 0.5, [Type.POISON]: 2, [Type.BUG]: 0.5, [Type.DRAGON]: 0, [Type.DARK]: 0.5, [Type.STEEL]: 2 },
    [Type.FIGHTING]: { [Type.FLYING]: 2, [Type.ROCK]: 0.5, [Type.BUG]: 0.5, [Type.PSYCHIC]: 2, [Type.DARK]: 0.5, [Type.FAIRY]: 2 },
    [Type.FIRE]: { [Type.ROCK]: 2, [Type.BUG]: 0.5, [Type.STEEL]: 0.5, [Type.FIRE]: 0.5, [Type.WATER]: 2, [Type.GRASS]: 0.5, [Type.ICE]: 0.5, [Type.DRAGON]: 0.5, [Type.GROUND]: 2, [Type.FAIRY]: 0.5 },
    [Type.FLYING]: { [Type.FIGHTING]: 0.5, [Type.ROCK]: 2, [Type.BUG]: 0.5, [Type.GRASS]: 0.5, [Type.ELECTRIC]: 2, [Type.ICE]: 2, [Type.GROUND]: 0 },
    [Type.DELTA_FLYING]: { [Type.FIGHTING]: 0.5, [Type.ROCK]: 1, [Type.BUG]: 0.5, [Type.GRASS]: 0.5, [Type.ELECTRIC]: 1, [Type.ICE]: 1, [Type.GROUND]: 0 },
    [Type.GHOST]: { [Type.NORMAL]: 0, [Type.FIGHTING]: 0, [Type.POISON]: 0.5, [Type.BUG]: 0.5, [Type.GHOST]: 2, [Type.DARK]: 2 },
    [Type.GRASS]: { [Type.FLYING]: 2, [Type.POISON]: 2, [Type.GROUND]: 0.5, [Type.BUG]: 2, [Type.FIRE]: 2, [Type.GRASS]: 0.5, [Type.WATER]: 0.5, [Type.ELECTRIC]: 0.5, [Type.ICE]: 2 },
    [Type.GROUND]: { [Type.POISON]: 0.5, [Type.ROCK]: 2, [Type.WATER]: 2, [Type.GRASS]: 0.5, [Type.ELECTRIC]: 0, [Type.ICE]: 2 },
    [Type.ICE]: { [Type.STEEL]: 2, [Type.FIRE]: 2, [Type.ICE]: 0.5, [Type.ROCK]: 2, [Type.FIGHTING]: 2 },
    [Type.NORMAL]: { [Type.FIGHTING]: 2, [Type.GHOST]: 0 },
    [Type.POISON]: { [Type.FIGHTING]: 0.5, [Type.POISON]: 0.5, [Type.GROUND]: 2, [Type.BUG]: 0.5, [Type.GRASS]: 0.5, [Type.FAIRY]: 0.5, [Type.PSYCHIC]: 2 },
    [Type.PSYCHIC]: { [Type.FIGHTING]: 0.5, [Type.PSYCHIC]: 0.5, [Type.DARK]: 2, [Type.GHOST]: 2, [Type.BUG]: 2 },
    [Type.ROCK]: { [Type.NORMAL]: 0.5, [Type.FIGHTING]: 2, [Type.FLYING]: 0.5, [Type.POISON]: 0.5, [Type.GROUND]: 2, [Type.STEEL]: 2, [Type.FIRE]: 0.5, [Type.WATER]: 2, [Type.GRASS]: 2 },
    [Type.STEEL]: { [Type.NORMAL]: 0.5, [Type.FIGHTING]: 2, [Type.FLYING]: 0.5, [Type.ROCK]: 0.5, [Type.BUG]: 0.5, [Type.STEEL]: 0.5, [Type.FIRE]: 2, [Type.GRASS]: 0.5, [Type.ICE]: 0.5, [Type.FAIRY]: 0.5, [Type.POISON]: 0, [Type.GROUND]: 2, [Type.PSYCHIC]: 0.5, [Type.DRAGON]: 0.5 },
    [Type.WATER]: { [Type.FIRE]: 0.5, [Type.WATER]: 0.5, [Type.GRASS]: 2, [Type.ELECTRIC]: 2, [Type.ICE]: 0.5, [Type.STEEL]: 0.5 }
  };

  /**
   * A mapping of power multipliers for power-modifying weathers and the type's whose powers are modified.
   * @private
   * @type {Object.<string, Object.<string, number>>}
   */
  const _weather = {
    [Weather.HARSH_SUN]: { [Type.FIRE]: 1.5, [Type.WATER]: 0.5 },
    [Weather.EXTREMELY_HARSH_SUN]: { [Type.FIRE]: 1.5, [Type.WATER]: 0 },
    [Weather.RAIN]: { [Type.FIRE]: 0.5, [Type.WATER]: 1.5 },
    [Weather.HEAVY_RAIN]: { [Type.FIRE]: 0, [Type.WATER]: 1.5 }
  };

  this.attack = function(fDefenderType, sDefenderType = Type.TYPELESS) {
    if (!(fDefenderType instanceof Type) || !(sDefenderType instanceof Type))
      throw new TypeError("Defender types must be instances of the Type function");

    let mod = 1;
    if (_effectiveness.hasOwnProperty(fDefenderType) && _effectiveness[fDefenderType].hasOwnProperty(this)) {
      mod *= _effectiveness[fDefenderType][this];
    }

    if (_effectiveness.hasOwnProperty(sDefenderType) && _effectiveness[sDefenderType].hasOwnProperty(this)) {
      mod *= _effectiveness[sDefenderType][this];
    }

    return mod;
  };

  this.passThrough = function(weather) {
    if (!(weather instanceof Weather))
      throw new TypeError("Weather must in an instance of the Weather function");

    if (_weather.hasOwnProperty(weather) && _weather[weather].hasOwnProperty(this)) {
      return _weather[weather][this];
    }

    // Either the weather doesn't affect the power of moves or this type isn't affected by the weather.
    return 1;
  };

  this.toString = function() {
    return `${_id}`;
  };
}

// All valid known types
Type.TYPELESS = new Type();
Type.BUG = new Type();
Type.DARK = new Type();
Type.DRAGON = new Type();
Type.ELECTRIC = new Type();
Type.FAIRY = new Type();
Type.FIGHTING = new Type();
Type.FIRE = new Type();
Type.FLYING = new Type();
Type.GHOST = new Type();
Type.GRASS = new Type();
Type.GROUND = new Type();
Type.ICE = new Type();
Type.NORMAL = new Type();
Type.POISON = new Type();
Type.PSYCHIC = new Type();
Type.ROCK = new Type();
Type.STEEL = new Type();
Type.WATER = new Type();

// Flying type during Delta Stream
Type.DELTA_FLYING = new Type();

/**
 * Represents a static instance of a weather condition in Pokemon games.
 * The weather is determined by a predefined set of global variables.
 *
 * @class
 */
function Weather() {
  /**
   * The unique ID of the weather.
   * @private
   * @type {number}
   */
  const _id = __static__++;

  this.toString = function() {
    return `${_id}`;
  };
}

/**
 * All observed weathers in Pokemon games, excluding Pokemon XD.
 * Each weather is instantiated statically as a property of the Weather object.
 * @class
 */
Weather.NONE = new Weather();
Weather.HARSH_SUN = new Weather();
Weather.RAIN = new Weather();
Weather.SANDSTORM = new Weather();
Weather.HAIL = new Weather();
Weather.SNOW = new Weather();
Weather.FOG = new Weather();
Weather.EXTREMELY_HARSH_SUN = new Weather();
Weather.HEAVY_RAIN = new Weather();
Weather.STRONG_WINDS = new Weather();

/**
 * Maps the full stat name to its abbreviation.
 * 
 * @param {string} stat - The stat that will be abbreviated.
 * @returns {string} The abbreviation of the stat.
 */
function abbreviate(stat) {
  switch (stat.toLowerCase()) {
    case 'health points':
    case 'health point':
    case 'health':
      return 'hp';

    case 'attack':
      return 'atk';

    case 'defense':
      return 'def';

    case 'special attack':
      return 'sp.atk';

    case 'special defense':
      return 'sp.def';

    case 'speed':
      return 'spe';

    default:
      return stat.toLowerCase();
  }
}

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
  if (stat.toLowerCase() === increase || stat.toLowerCase() === abbreviate(increase)) {
    return 1.1;
  } else if (stat.toLowerCase() === decrease || stat.toLowerCase() === abbreviate(decrease)) {
    return 0.9;
  } else {
    return 1;
  }
}

/**
 * Calculates the multiplier for the number of stages a stat has been raised or lowered.
 * 
 * @param {string} stat - The stat being modified.
 * @param {number} stage - An integer [-6, 6] that denotes the stages that the stat has been modified.
 * @param {number} gen=3 - The Pokémon generation that the stat change took place.
 * @returns {number} The corresponding multiplier for the stat.
 */
function calcStatStageMod(stat, stage, gen = 3) {
  // Stages and generations only exist in integer values.
  stage = Math.floor(stage);
  gen = Math.floor(gen);

  if (stage < -6 || stage > 6) {
    throw new Error("A stat can only be lowered 6 stages or raised 6 stages.");
  }

  // Gen 1 uses an approximated multiplier values
  if (gen === 1) {
    switch (stage) {
      case -6:
        return 0.25;
      case -5:
        return 0.28;
      case -4:
        return 0.33;
      case -3:
        return 0.4;
      case -2:
        return 0.5;
      case -1:
        return 0.66;
      case 0:
        return 1;
      case 1:
        return 1.5;
      case 2:
        return 2;
      case 3:
        return 2.5;
      case 4:
        return 3;
      case 5:
        return 3.5;
      case 6:
        return 4;
      default:
        throw new Error(`Impossible stage reached. Got ${stage}.`);
    }
  }

  switch (stat.toLowerCase()) {
    case "acc":
    case "accuracy":
      if (gen >= 5) {
        return (3 + Math.max(0, stage)) / (3 - Math.min(0, stage));
      } else if (gen >= 2 && gen <= 4) {
        // Gens II - IV use approximated multiplier values.
        switch (stage) {
          case -6:
            return 0.33;
          case -5:
            return 0.36;
          case -4:
            return 0.43;
          case -3:
            return 0.5;
          case -2:
            return 0.6;
          case -1:
            return 0.75;
          case 0:
            return 1;
          case 1:
            return 1.33;
          case 2:
            return 1.66;
          case 3:
            return 2;
          case 4:
            return gen === 2 ? 2.33 : 2.5;
          case 5:
            return 2.66;
          case 6:
            return 3;
          default:
            throw new Error(`Impossible stage reached. Got ${stage}.`);
        }
      }
      break;

    case "eva":
    case "evsn":
    case "evasion":
      if (gen >= 5) {
        return (3 - Math.min(0, stage)) / (3 + Math.max(0, stage));
      } else if (gen >= 2 && gen <= 4) {
        // Gens II - IV use approximated mutiplier values.
        switch (stage) {
          case -6:
            return 3;
          case -5:
            return 2.66;
          case -4:
            return gen === 2 ? 2.33 : 2.5;
          case -3:
            return 2;
          case -2:
            return 1.66;
          case -1:
            return 1.33;
          case 0:
            return 1;
          case 1:
            return 0.75;
          case 2:
            return 0.6;
          case 3:
            return 0.5;
          case 4:
            return 0.43;
          case 5:
            return 0.36;
          case 6:
            return 0.33;
          default:
            throw new Error(`Impossible stage reached. Got ${stage}.`);
        }
      }
      break;

    default:
      return (2 + Math.max(0, stage)) / (2 - Math.min(0, stage));
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
 * @param {number} a - The base Attack stat of the attacking Pokémon.
 * @param {number} d - The base Defense stat of the target, or the base Defense of the target for Beat Up.
 * @param {number} as - The multiplier for the attack stat based on stat changes made during battle. Ignored for
 *                      Beat Up. Multipliers < 1 are treated as 1 if this is a critical hit.
 * @param {number} ds - The multiplier for the defense stat based on stat changes made during battle. Ignored for
 *                      Beat Up. Multipliers > 1 are treated as 1 if this is a critical hit.
 * @param {number} power - The effective power of the used move.
 * @param {number} screen - 0.5, 2/3, or 1 depending on the presence of Reflect/Light Screen and whether it's a Double
 *                          Battle. 1 if critical hit
 * @param {number} targets - 0.5 in Double Battles if the move targets both foes, 1 otherwise.
 * @param {number} weather - 0.5, 1, or 1.5 depending on the weather and the presence of Cloud Nine/Air Lock.
 * @param {number} ff - 1.5 if the attacker has Flash Fire and the move is Fire-type, 1 otherwise.
 * @param {number} stockpile - 1, 2, or 3 depending on Stockpiles done for Spit Up, 1 otherwise.
 * @param {number} critical - 2 for a critical hit, 1 otherwise. Always 1 if Future Sight, Doom Desire, Spit Up, or if
 *                            the target has the abilities:
 *                              - Battle Armor
 *                              - Shell Armor
 * @param {number} doubleDmg - 2 if the used move is one of the following moves and conditions apply, 1 otherwise:
 *                           - Gust or Twister and the target is in the semi-invulnerable turn of Fly or Bounce.
 *                           - Stomp, Needle Arm, Astonish, or Extrasensory and the target has previously used Minimize.
 *                           - Surf or Whirlpool and the target is in the semi-invulnerable turn of Dive.
 *                           - Earthquake or Magnitude and the target is in the semi-invulnerable turn of Dig.
 *                           - Pursuit and the target is attempting to switch out.
 *                           - Facade and the user is poisoned, burned, or paralyzed.
 *                           - SmellingSalt and the target is paralyzed.
 *                           - Revenge and the attacker has been damaged by the target this turn.
 *                           - Weather Ball, there is non-clear weather, and no Pokémon on the field have the Ability
 *                             Cloud Nine or Air Lock.
 * @param {number} charge - 2 if the move is Electric-type and Charge takes effect, 1 otherwise.
 * @param {number} hh - 1.5 if the attacker's ally used Helping Hand, 1 otherwise.
 * @param {number} stab - Same-Type Attack Bonus. 1 if the move's type doesn't match one of the user's types, 1.5
 *                        otherwise.
 * @param {number} type - The type effectiveness. Can be 0.25, 0.5, 1, 2, or 4. Struggle, Future Sight, Doom Desire, and
 *                        Beat Up are always 1.
 * @param {number} random - The random factor that affects how much final damage is done. Varies from [0.85 to 1]
 *                          rounded down.
 * @param {boolean} isBurned - True if the attacker is burned, false otherwise.
 * @param {boolean} ignoreCrit - True if critical should be ignored, false otherwise.
 * @param {boolean} ignoreRandom - True if the random factor should be ignored, false otherwise.
 * @returns {number} - The calculated damage.
 */
function calcGenIIIDamage(level, a, d, as, ds, power, screen, targets, weather, ff, stockpile, critical,
  doubleDmg, charge, hh, stab, type, random, isBurned, ignoreCrit, ignoreRandom) {
  // Stat changes to the attack/defense stat are ignored if they negatively affect the attacker.
  const critMod = (xs, cmp = v => v < 1) => !ignoreCrit && critical > 1 && cmp(xs) ? 1 : xs;

  let burn = isBurned ? 0.5 : 1;

  let initDamage = (((2 * level / 5) + 2) * power * (a * critMod(as)) / (d * critMod(ds, v => v > 1)) / 50) *
    burn * (!ignoreCrit && critical > 1 ? 1 : screen) * targets * weather * ff + 2;
  
  return initDamage * stockpile * (ignoreCrit ? 1 : critical) * doubleDmg * charge * hh * stab * type * (ignoreRandom ? 1 : random);
}

function calcGenIIIDamage({level = 1, a = 1, d = 1, as = 0, ds = 0, move = "Struggle", power = 50, reflect = false, lightScreen = false, isDoubleBattle = false, targets = 1, weather = "None", ffActive = false, stockpile = 1, crit = false, meetsDoubleDmg = false, isCharged = false, hasHH = false, attackerTypes = [], defenderTypes = [], moveType = "Typeless", random = 1, isBurned = false} = {}) {

}

/**
 * Calculates the damage inflicted by a move in the fourth generation of Pokémon games.
 * @param {number} level - The level of the attacking Pokémon.
 * @param {number} a - The effective Attack stat of the attacking Pokémon if the used move is physical, or the effective Special Attack stat of the attacking Pokémon if the used move is special.
 * @param {number} d - The effective Defense stat of the target if the used move is physical, or the effective Special Defense stat of the target if the used move is special.
 * @param {number} as - The multiplier for the attack stat based on stat changes made during battle. Ignored for Beat Up. Multipliers < 1 are treated as 1
 *                      if this is a critical hit.
 * @param {number} ds - The multiplier for the defense stat based on stat changes made during battle. Ignored for Beat Up. Multipliers > 1 are treated as 1
 *                      if this is a critical hit.
 * @param {number} power - The effective power of the used move.
 * @param {number} burn - 0.5 if the attacker is burned, its Ability is not Guts, and the used move is a physical move, and 1 otherwise.
 * @param {number} screen - 0.5 if the used move is physical and Reflect is present on the target's side of the field, or special and Light Screen is present. For a Double Battle, Screen is instead 2/3. Screen is 1 otherwise or if the used move lands a critical hit.
 * @param {number} targets - 0.75 in Double Battles if the used move has more than one target, and 1 otherwise.
 * @param {number} weather - 1.5 if a Water-type move is being used during rain or a Fire-type move during harsh sunlight, and 0.5 if a Water-type move is used during harsh sunlight or a Fire-type move during rain, or SolarBeam during any non-clear weather besides harsh sunlight, and 1 otherwise or if any Pokémon on the field have the Ability Cloud Nine or Air Lock.
 * @param {number} ff - 1.5 if the used move is Fire-type and the attacker's Ability is Flash Fire that has been activated by a Fire-type move, and 1 otherwise.
 * @param {number} critical - 2 for a critical hit, 3 if the move lands a critical hit and the attacker's Ability is
 *                            Sniper, 1 if the target is under the effect of Lucky Chant, and 1 otherwise. Always 1 if
 *                            the used move is Future Sight, Doom Desire, Spit Up, or if the target has the abilities:
 *                              - Battle Armor
 *                              - Shell Armor
 * @param {number} item - 1.3 if the attacker is holding a Life Orb, 1 + (n / 10) if the attacker is holding a Metronome, where n is the amount of times the same move has been successfully and consecutively used, up to 10, and 1 otherwise.
 * @param {number} first - 1.5 if the used move was stolen with Me First, and 1 otherwise.
 * @param {number} stab - Same-Type Attack Bonus. 1 if the move's type doesn't match one of the user's types, 1.5
 *                        otherwise.
 * @param {number} type1 - The type effectiveness of the used move against the target's first type (or only type, if it only has a single type).
 * @param {number} type2 - The type effectiveness of the used move against the target's second type. If the target only has a single type, Type2 is 1.
 * @param {number} srf - 0.75 if the used move is super effective, the target's Ability is Solid Rock or Filter, and the attacker's Ability is not Mold Breaker, and 1 otherwise.
 * @param {number} eb - 1.2 if the used move is super effective and the attacker is holding an Expert Belt, and 1 otherwise.
 * @param {number} tl - 2 if the used move is not very effective and the attacker's Ability is Tinted Lens, and 1 otherwise.
 * @param {number} berry - A multiplier that applies when a Berry is used. Its value is 0.5, 1, or 2 depending on the type of Berry used.
 * @param {number} random - The random factor that affects how much final damage is done. Varies from [0.85 to 1]
 *                          rounded down.
 * @param {boolean} ignoreCrit - True if critical should be ignored, false otherwise.
 * @param {boolean} ignoreRandom - True if the random factor should be ignored, false otherwise.
 * @param {boolean} isSniper - True if the attacker has the ability Sniper, false otherwise.
 * @param {boolean} isAdaptability - True if the attacker has Adaptability, false otherwise.
 * @returns {number} The amount of damage inflicted by the move.
 */
function calcGenIVDamage(level, a, d, as, ds, power, burn, screen, targets, weather, ff, critical, item, first, stab,
  type1, type2, srf, eb, tl, berry, random, ignoreCrit, ignoreRandom, isSniper, isAdaptability) {
  // Stat changes to the attack/defense stat are ignored if they negatively affect the attacker.
  const critMod = (xs, cmp = v => v < 1) => !ignoreCrit && critical > 1 && cmp(xs) ? 1 : xs;

  // Sniper has a crit rate of 3 rather than 2
  if (isSniper && critical > 1) {
    critical = 3;

  // STAB for attackers with Adaptability is 2 rather than 1.5
  } else if (isAdaptability && stab > 1) {
    stab = 2;
  }

  // TODO: Whatever other conditions that go here before the actual damage calculation takes place.
  // https://bulbapedia.bulbagarden.net/wiki/Damage


  const typeEffectiveness = type1 * type2;
  const damage = (((((2 * level / 5) + 2) * power * a / d) / 50) * burn * screen * targets * weather * ff + 2) * critical * item * first * random * stab * typeEffectiveness * srf * eb * tl * berry;
  return damage;
}
