const fs = require('fs');
const readline = require('readline');

/**
 * Finds the name of the property on the given function that refers to the given instance.
 *
 * @param {*} instance - The instance to search for.
 * @param {Function} fn - The function to search in.
 * @param {boolean} [incdlueFnName=true] - True if the function name should be prepended to the property name.
 * @returns {string} - The name of the property on the function that refers to the given instance, or
 *                     `${fn.name}.undefined` if the instance is not found in the function's properties.
 */
function getPropertyOfInstance(instance, fn, includeFnName = true) {
  for (const prop in fn) {
    if (fn[prop] === instance) {
      return `${includeFnName ? fn.name + '.' : ''}${prop}`;
    }
  }

  return `${includeFnName ? fn.name + '.' : ''}undefined`;
}

/**
 * Contains the base stat, type, and ability data of all available Pokemon up to Gen IX.
 * @type {Object<string, Object<string, number|Array<string>>>}
 */
const pokedex = JSON.parse(fs.readFileSync('m_pokedex.json'));

/**
 * A global counter used for generating unique IDs for static instances of Objects.
 * @type {number}
 */
let __static__ = 1;

/**
 * Represents a static instance of a Pokemon generation.
 * Each generation is determined by a predefined set of global variables.
 * @class
 */
function Gen() {
  /**
   * The unique ID of the Pokemon generation.
   * @private
   * @type {number}
   */
  const _id = __static__++;

  /**
   * The string name of the generation.
   */
  let _name = null;
  
  /**
   * Regex string that matches Roman numerals from 1 to 100.
   * @private
   * @type {string}
   */
  const _rnrStr = '(C|XC|L|XL|X{0,3}(IX|IV|V?I{0,3})|IX|IV|V|I)';

  /**
   * Matches the generation of this object with a specified generation range.
   * @method
   * @param {string} genRange - The specified generation range in the form of "DIGIT(S)-DIGIT(S)" or
   *                            "ROMAN_NUM-ROMAN_NUM" or "DIGIT(S)+" or "ROMAN_NUM+"
   * @returns {boolean} - Returns true if this object's generation falls within the specified range, else false.
   * @throws {TypeError} - Throws an error if the specified generation range is not in an acceptable format.
   */
  this.match = function(genRange) {
    const thisGen = romanToNumber(this.getName());
    let match;

    // A generation range has been specified in the form DIGIT(S)-DIGIT(S) or ROMAN_NUM-ROMAN_NUM
    if ((match = genRange.match(/^(\d+)\s*-\s*(\d+)$/)) ||
      (match = genRange.match(new RegExp(`^(${_rnrStr})\\s*-\\s*(${_rnrStr})$`)))) {
      const [_, minGenStr, maxGenStr] = match;
      const [g1, g2] = [romanToNumber(minGenStr), romanToNumber(maxGenStr)];
      const [minGen, maxGen] = [Math.min(g1, g2), Math.max(g1, g2)];

      return thisGen >= minGen && thisGen <= maxGen;
    }

    // A minimum generation has been specified
    else if ((match = genRange.match(/^(\d+)\+$/)) || (match = genRange.match(new RegExp(`^(${_rnrStr})\\+$`)))) {
      const [_, minGenStr] = match;
      const minGen = romanToNumber(minGenStr);

      return thisGen >= minGen;
    }

    // A specific generation has been specified
    else if ((match = genRange.match(/^(\d+)$/)) || (match = genRange.match(new RegExp(`^(${_rnrStr})$`)))) {
      const [_, genStr] = match;
      const gen = romanToNumber(genStr);

      return thisGen === gen;
    }

    // The generation range given is not in an acceptable format to be checked with this generation.
    throw new TypeError('Invalid generation range format provided.');
  };

  /**
   * Returns the name of this generation.
   *
   * @method
   * @returns {string} The name of this generation.
   */
  this.getName = function() {
    if (_name === null) {
      _name = getPropertyOfInstance(this, Gen, false);
    }

    return _name;
  };

  this.toString = function() {
    return `Gen ${this.getName()} (${_id})`;
  };

  /**
   * Converts a Roman numeral or regular number string to a decimal number.
   * @private
   * @param {string} str The input string to convert.
   * @returns {number} The decimal equivalent of the input string, or NaN if the input is invalid.
   */
  function romanToNumber(str) {
    /**
     * A map of Roman numerals to their decimal equivalents.
     *
     * @private
     * @type {Object.<string, number>}
     */
    const romanNumeralMap = {
      'I': 1,
      'IV': 4,
      'V': 5,
      'IX': 9,
      'X': 10,
      'XL': 40,
      'L': 50,
      'XC': 90,
      'C': 100
    };

    /**
     * Checks if a string is a valid Roman numeral.
     *
     * @private
     * @param {string} str The input string to check.
     * @returns {boolean} True if the input string is a valid Roman numeral, false otherwise.
     */
    function isValidRomanNumeral(str) {
      return /^M{0,10}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(str);
    }

    if (isValidRomanNumeral(str)) {
      let result = 0;
      for (let i = 0; i < str.length; i++) {
        if (romanNumeralMap[str[i]] < romanNumeralMap[str[i+1]]) {
          result -= romanNumeralMap[str[i]];
        } else {
          result += romanNumeralMap[str[i]];
        }
      }
      return result;
    } else if (!isNaN(Number(str))) {
      return Number(str);
    } else {
      console.warn('Input is not a valid Roman numeral or number!');
      return NaN;
    }
  }
}

/**
 * All Pokemon generations current and past.
 * Each generation is instantiated statically as a property of the Gen object.
 * @class
 */
Gen.I = new Gen();
Gen.II = new Gen();
Gen.III = new Gen();
Gen.IV = new Gen();
Gen.V = new Gen();
Gen.VI = new Gen();
Gen.VII = new Gen();
Gen.VIII = new Gen();
Gen.IX = new Gen();

/**
 * Represents a static instance of a weather condition in Pokemon games.
 * The weather is determined by a predefined set of global variables.
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
 * Represents a Pokemon type.
 * @class
 */
function Type() {
  /**
   * The string name of the type.
   */
  let _name = null;

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

  /**
   * Performs an attack with a defender type and optional secondary defender type.
   * Calculates the attack modifier based on the effectiveness of the attack type against the defender type(s).
   * @param {Type} fDefenderType - The primary defender type.
   * @param {Type} [sDefenderType=Type.TYPELESS] - The optional secondary defender type.
   * @throws {TypeError} If either defender type is not an instance of the Type function.
   * @returns {number} The calculated attack modifier.
   */
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

  /**
   * Calculates the effectiveness of this type in a given weather condition.
   * @method
   * @param {Weather} weather - The weather condition to calculate the effectiveness of this type against.
   * @throws {TypeError} Throws an error if the input weather is not an instance of the Weather function.
   * @returns {number} The effectiveness of this type against the given weather condition. Returns 1 if the weather condition does not affect this type or if this type is not affected by weather.
   */
  this.attackThrough = function(weather) {
    if (!(weather instanceof Weather))
      throw new TypeError("Weather must in an instance of the Weather function");

    if (_weather.hasOwnProperty(weather) && _weather[weather].hasOwnProperty(this)) {
      return _weather[weather][this];
    }

    // Either the weather doesn't affect the power of moves or this type isn't affected by the weather.
    return 1;
  };

  /**
   * Returns the name of this type.
   *
   * @method
   * @returns {string} The name of this type.
   */
  this.getName = function() {
    if (_name === null) {
      _name = getPropertyOfInstance(this, Type);
    }

    return _name;
  };

  this.toString = function() {
    return `#${_id}: ${this.getName()}`;
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

// Edge case when a second type read from the pokedex doesn't exist because a Pokemon is monotype
Type.undefined = Type.TYPELESS;

/**
 * Create a new instance of StatDistribution with given stat values.
 * @param {Object} param - The object containing stat values.
 * @param {number} [param.hp=0] - The HP value.
 * @param {number} [param.atk=0] - The Attack value.
 * @param {number} [param.def=0] - The Defense value.
 * @param {number} [param["sp.atk"]=0] - The Special Attack value.
 * @param {number} [param["sp.def"]=0] - The Special Defense value.
 * @param {number} [param.spe=0] - The Speed value.
 */
function StatDistribution({hp = 0, atk = 0, def = 0, "sp.atk": spAtk = 0, "sp.def": spDef = 0, spe = 0}) {
  let _hpVal = hp;
  let _atkVal = atk;
  let _defVal = def;
  let _spAtkVal = spAtk;
  let _spDefVal = spDef;
  let _speVal = spe;

  /**
   * Get all stats in a single call.
   * @returns {Object} The current value of all stats as an Object.
   */
  this.getStats = function() {
    return {
      hp: _hpVal,
      atk: _atkVal,
      def: _defVal,
      spAtk: _spAtkVal,
      spDef: _spDefVal,
      spe: _speVal
    };
  };

  /**
   * Get the current HP value.
   * @returns {number} The current HP value.
   */
  this.getHpVal = function() {
    return _hpVal;
  };

  /**
   * Set the HP value.
   * @param {number} newVal - The new HP value.
   */
  this.setHpVal = function(newVal) {
    _hpVal = newVal;
    return this;
  };

  /**
   * Get the current Attack value.
   * @returns {number} The current Attack value.
   */
  this.getAtkVal = function() {
    return _atkVal;
  };

  /**
   * Set the Attack value.
   * @param {number} newVal - The new Attack value.
   */
  this.setAtkVal = function(newVal) {
    _atkVal = newVal;
    return this;
  };

  /**
   * Get the current Defense value.
   * @returns {number} The current Defense value.
   */
  this.getDefVal = function() {
    return _defVal;
  };

  /**
   * Set the Defense value.
   * @param {number} newVal - The new Defense value.
   */
  this.setDefVal = function(newVal) {
    _defVal = newVal;
    return this;
  };

  /**
   * Get the current Special Attack value.
   * @returns {number} The current Special Attack value.
   */
  this.getSpAtkVal = function() {
    return _spAtkVal;
  };

  /**
   * Set the Special Attack value.
   * @param {number} newVal - The new Special Attack value.
   */
  this.setSpAtkVal = function(newVal) {
    _spAtkVal = newVal;
    return this;
  };

  /**
   * Get the current Special Defense value.
   * @returns {number} The current Special Defense value.
   */
  this.getSpDefVal = function() {
    return _spDefVal;
  };

  /**
   * Set the Special Defense value.
   * @param {number} newVal - The new Special Defense value.
   */
  this.setSpDefVal = function(newVal) {
    _spDefVal = newVal;
    return this;
  };

  /**
   * Get the current Speed value.
   * @returns {number} The current Speed value.
   */
  this.getSpeVal = function() {
    return _speVal;
  };

  /**
   * Set the Speed value.
   * @param {number} newVal - The new Speed value.
   */
  this.setSpeVal = function(newVal) {
    _speVal = newVal;
    return this;
  };
}

/**
 * Creates an object representing the distribution of effort values (EVs) of a Pokémon.
 * Effort values represent a Pokemon's training and are typically gained after defeating enemy Pokemon.
 * 
 * @class
 * @augments StatDistribution
 * @param {Object} stats - An object containing the EVs for each stat.
 * @param {number} stats.hp - The EVs for HP.
 * @param {number} stats.atk - The EVs for Attack.
 * @param {number} stats.def - The EVs for Defense.
 * @param {number} stats.spAtk - The EVs for Special Attack.
 * @param {number} stats.spDef - The EVs for Special Defense.
 * @param {number} stats.spe - The EVs for Speed.
 * @throws {RangeError} If any individual stat has a value less than 0 or greater than 252, or if the total sum of EVs exceeds 510.
 */
class EVs extends StatDistribution {
  constructor({ hp = 0, atk = 0, def = 0, spAtk = 0, spDef = 0, spe = 0 }) {
    const stats = { hp, atk, def, spAtk, spDef, spe };
    for (let ev in stats) {
      stats[ev] = this.#checkEV(ev, stats[ev]);
    }
    this.#checkEVSum(stats);
    super(stats);
  }

  /**
   * Validates that an individual EV is within the valid range of 0 to 252.
   * If the value is less than 0, it sets the value to 0 and logs a warning.
   * If the value is greater than 252, it sets the value to 252 and logs a warning.
   * 
   * @private
   * @param {string} ev - The name of the EV to check.
   * @param {number} evVal - The value of the EV to check.
   * @returns {number} - The validated EV value.
   */
  #checkEV(ev, evVal) {
    if (evVal < 0) {
      console.warn(`The "${ev}" effort value is less than 0. Its value will be set to 0.`);
      return 0;
    } else if (evVal > 252) {
      console.warn(`The "${ev}" effort value is greater than 252. Its value will be set to 252.`);
      return 252;
    }
    return evVal;
  }

  /**
   * Validates that the total sum of all EVs does not exceed 510.
   * If the total sum exceeds 510, it throws a RangeError.
   * 
   * @private
   * @param {Object} evs - An object containing the EVs for each stat.
   * @returns {this} - Returns the instance of the EVs class.
   * @throws {RangeError} If the total sum of EVs exceeds 510.
   */
  #checkEVSum(evs) {
    let evTotal = 0;
    for (let ev in evs) {
      evTotal += evs[ev];
    }
    if (evTotal > 510) {
      throw new RangeError(`The total sum of EVs may not exceed 510. Got ${evTotal}.`);
    }

    return this;
  }

    /**
   * Sets the value of HP and updates the EV sum accordingly.
   * 
   * @param {number} newVal - The new HP value.
   * @returns {EVs} This object, allowing for method chaining.
   * @throws {RangeError} If the new value is less than 0 or greater than 252.
   */
  setHpVal(newVal) {
    return super.setHpVal(this.#checkEV("hp", newVal)).#checkEVSum(this.getStats());
  }

  /**
   * Sets the value of Attack and updates the EV sum accordingly.
   * 
   * @param {number} newVal - The new Attack value.
   * @returns {EVs} This object, allowing for method chaining.
   * @throws {RangeError} If the new value is less than 0 or greater than 252.
   */
  setAtkVal(newVal) {
    return super.setAtkVal(this.#checkEV("atk", newVal)).#checkEVSum(this.getStats());
  }

  /**
   * Sets the value of Defense and updates the EV sum accordingly.
   * 
   * @param {number} newVal - The new Defense value.
   * @returns {EVs} This object, allowing for method chaining.
   * @throws {RangeError} If the new value is less than 0 or greater than 252.
   */
  setDefVal(newVal) {
    return super.setDefVal(this.#checkEV("spDef", newVal)).#checkEVSum(this.getStats());
  }

  /**
   * Sets the value of Special Attack and updates the EV sum accordingly.
   * 
   * @param {number} newVal - The new Special Attack value.
   * @returns {EVs} This object, allowing for method chaining.
   * @throws {RangeError} If the new value is less than 0 or greater than 252.
   */
  setSpAtkVal(newVal) {
    return super.setSpAtkVal(this.#checkEV("spAtk", newVal)).#checkEVSum(this.getStats());
  }

  /**
   * Sets the value of Special Defense and updates the EV sum accordingly.
   * 
   * @param {number} newVal - The new Special Defense value.
   * @returns {EVs} This object, allowing for method chaining.
   * @throws {RangeError} If the new value is less than 0 or greater than 252.
   */
  setSpDefVal(newVal) {
    return super.setSpDefVal(this.#checkEV("spDef", newVal)).#checkEVSum(this.getStats());
  }

  /**
   * Sets the value of Speed and updates the EV sum accordingly.
   * 
   * @param {number} newVal - The new Speed value.
   * @returns {EVs} This object, allowing for method chaining.
   * @throws {RangeError} If the new value is less than 0 or greater than 252.
   */
  setSpeVal(newVal) {
    return super.setSpeVal(this.#checkEV("spe", newVal)).#checkEVSum(this.getStats());
  }
}

/**
 * Creates an object representing a Pokémon's Individual Values (IVs) for each stat.
 * Individual values are values between 0 and 31 that represent a Pokémon's genetics.
 * 
 * @class
 * @augments StatDistribution
 * @param {Object} stats - An object with properties for each of the six stats, representing the Pokémon's IVs for each
 *                         stat. Missing values default to 0.
 * @param {number} [stats.hp=0] - The IV for the HP stat.
 * @param {number} [stats.atk=0] - The IV for the Attack stat.
 * @param {number} [stats.def=0] - The IV for the Defense stat.
 * @param {number} [stats.spAtk=0] - The IV for the Special Attack stat.
 * @param {number} [stats.spDef=0] - The IV for the Special Defense stat.
 * @param {number} [stats.spe=0] - The IV for the Speed stat.
 */
class IVs extends StatDistribution {
  constructor({hp = 0, atk = 0, def = 0, spAtk = 0, spDef = 0, spe = 0}) {
    const stats = {hp: hp, atk: atk, def: def, spAtk: spAtk, spDef: spDef, spe: spe};
    for (let iv in stats) {
      stats[iv] = this.#checkIV(iv, stats[iv]);
    }

    super(stats);
  }

  /**
   * Checks an individual value (IV) to ensure it falls within the valid range of 0 to 31. If it falls outside this
   * range, a warning message is logged to the console and the value is set to the nearest valid value.
   * @private
   * @param {string} iv - The name of the IV being checked (e.g. "hp", "atk", "def", etc.).
   * @param {number} ivVal - The value of the IV being checked.
   * @returns {number} The valid IV value (i.e. a value between 0 and 31, inclusive).
   */
  #checkIV(iv, ivVal) {
    if (ivVal < 0) {
      console.warn(`The "${iv}" individual value is less than 0. Its value will be set to 0.`);
      return 0;
    } else if (ivVal > 31) {
      console.warn(`The "${iv}" individual value is greater than 31. Its value will be set to 31.`);
      return 31;
    }

    return ivVal;
  }

  /**
   * Sets the value of HP and updates the IV accordingly. If the value falls below 0 or above 31, it is set to 0 or 31,
   * respectively.
   * 
   * @param {number} newVal - The new Special Defense value.
   * @returns {IVs} This object, allowing for method chaining.
   */
  setHpVal(newVal) {
    return super.setHpVal(this.#checkIV("hp", newVal));
  }

  /**
   * Sets the value of Attack and updates the IV accordingly. If the value falls below 0 or above 31, it is set to 0 or
   * 31, respectively.
   * 
   * @param {number} newVal - The new Special Defense value.
   * @returns {IVs} This object, allowing for method chaining.
   */
  setAtkVal(newVal) {
    return super.setAtkVal(this.#checkIV("atk", newVal));
  }

  /**
   * Sets the value of Defense and updates the IV accordingly. If the value falls below 0 or above 31, it is set to 0 or
   * 31, respectively.
   * 
   * @param {number} newVal - The new Special Defense value.
   * @returns {IVs} This object, allowing for method chaining.
   */
  setDefVal(newVal) {
    return super.setDefVal(this.#checkIV("def", newVal));
  }

  /**
   * Sets the value of Special Attack and updates the IV accordingly. If the value falls below 0 or above 31, it is set
   * to 0 or 31, respectively.
   * 
   * @param {number} newVal - The new Special Defense value.
   * @returns {IVs} This object, allowing for method chaining.
   */
  setSpAtkVal(newVal) {
    return super.setSpAtkVal(this.#checkIV("spAtk", newVal));
  }

  /**
   * Sets the value of Special Defense and updates the IV accordingly. If the value falls below 0 or above 31, it is set
   * to 0 or 31, respectively.
   * 
   * @param {number} newVal - The new Special Defense value.
   * @returns {IVs} This object, allowing for method chaining.
   */
  setSpDefVal(newVal) {
    return super.setSpDefVal(this.#checkIV("spDef", newVal));
  }

  /**
   * Sets the value of Speed and updates the IV accordingly. If the value falls below 0 or above 31, it is set to 0 or
   * 31, respectively.
   * 
   * @param {number} newVal - The new Special Defense value.
   * @returns {IVs} This object, allowing for method chaining.
   */
  setSpeVal(newVal) {
    return super.setSpeVal(this.#checkIV("spe", newVal));
  }
}

function Pokemon({name, teraType = Type.TYPELESS, ivs}) {
  const _name = name;

  const [_type1, _type2] = [Type[pokedex[name].types[0]], Type[pokedex[name].types[1]]];

  this.data = pokedex[name];

  this.getFirstType = function() {
    return _type1;
  };

  this.getSecondType = function() {
    return _type2;
  };

  this.toString = function() {
    return JSON.stringify(this.data, null, 4);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Name a Pokemon: ', (name) => {
  if (!pokedex.hasOwnProperty(name)) {
    console.log("This Pokemon doesn't exist.");
  } else {
    const pkm = new Pokemon({name: name});
    console.log(`These are the stats for "${name}":`);
    console.log(pkm.toString());
    console.log(`Internally, "${name}" has Type values of ${pkm.data.types.map(t => `"${Type[t].toString()}"`).join(", and ")}`);
  }

  rl.close();
});

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
