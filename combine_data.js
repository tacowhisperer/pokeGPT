const fs = require('fs');

/**
 * Read the contents of a file and return each line as an array element.
 * @param {string} filePath - The path of the file to read.
 * @returns {string[]} An array of strings representing each line in the file.
 */
function getJsonLines(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  
  return lines;
}

/**
 * Merge a line from the pokedex and a line from the abilities JSON files into a single line.
 * @param {string} pokedexLine - A line from the pokedex JSON file.
 * @param {string} abilitiesLine - A line from the abilities JSON file.
 * @returns {string} A merged line if the Pokemon name in both lines matches, otherwise an empty string.
 */
function mergeLine(pokedexLine, abilitiesLine) {
  const getPkm = l => {
    let pkm = l.match(/^\s*"[^"]+"/);
    if (pkm) {
      return pkm[0].replace(/^\s*"(.+)"$/, '$1');
    } else {
      return "";
    }
  };

  if (getPkm(pokedexLine) !== getPkm(abilitiesLine)) {
    return "";
  }

  // Add the abilities to the pokedex line.
  return pokedexLine.replace(/ \},$/, `,\t${abilitiesLine.match(/"abilities": \[.+$/)[0]}`)
}

/**
 * Append a string to the end of a file.
 * @param {string} str - The string to append to the file.
 * @param {string} filePath - The path of the file to append to.
 */
function appendStringToFile(str, filePath) {
  fs.appendFileSync(filePath, '\n' + str);
}

/**
 * Combine the data from the pokedex and abilities JSON files and write the output to a new JSON file.
 * @param {string} output - The path of the file to write the combined data to.
 */
function combineData(output) {
  const pokedex = getJsonLines("pokedex.json").filter(l => l.length > 5);
  const abilities = getJsonLines("abilities.json").map(l => l.trim()).filter(l => l.length > 5);

  // Overwrite any output file that already exists
  fs.writeFileSync(output, '{');

  // Append all other information
  for (let pkdxL of pokedex) {
    // Find the corresponding line in the abilities JSON
    for (let i = 0; i < abilities.length; i++) {
      const abtyL = abilities[i];
      const m = mergeLine(pkdxL, abtyL);

      // Only if there was a merge should the data be appended to the file
      if (m) {
        appendStringToFile(m, output);
        abilities.splice(i, 1);
        break;
      }
    }
  }

  // Append the final closing bracket
  fs.appendFileSync(output, '\n}');
}

combineData('m_pokedex.json');
