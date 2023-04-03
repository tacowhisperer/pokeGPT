const fs = require('fs');
const readline = require('readline');

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

// function csvToJson(inputFile, outputFile, primaryKey) {
//   // Create a readable stream to read from the input file
//   const inputStream = fs.createReadStream(inputFile, 'utf-8');

//   // Create a writable stream to write to the output file
//   const outputStream = fs.createWriteStream(outputFile);

//   // Create an interface for reading lines from the input stream
//   const reader = readline.createInterface({ input: inputStream });

//   // Initialize the header to null
//   let header = null;

//   // Initialize the data object to an empty object
//   const data = {};

//   // Listen for the 'line' event emitted by the reader for each line in the input stream
//   reader.on('line', (line) => {
//     // Split the line into an array of columns using a comma delimiter
//     const row = line.split(',').map((col) => {
//       // Handle quoted columns by removing the quotes
//       if (col.startsWith('"') && col.endsWith('"')) {
//         return col.slice(1, -1);
//       }
//       return col;
//     });

//     // If the header has not yet been initialized, set it to the current row
//     if (header === null) {
//       header = row;
//       return;
//     }

//     // Initialize an entry object for the current row
//     const entry = {};

//     // Iterate through each column in the row
//     for (let i = 0; i < header.length; i++) {
//       // If the column name matches the primary key, use the column value as the key in the data object
//       if (header[i] === primaryKey) {
//         data[row[i]] = entry;
//       } else {
//         // Otherwise, add the column name and value as a property in the entry object
//         entry[header[i]] = row[i];
//       }
//     }
//   });

//   // Listen for the 'close' event emitted by the reader when it has finished reading all lines
//   reader.on('close', () => {
//     // Write the data object to the output stream as a string with pretty formatting
//     outputStream.write(JSON.stringify(data, null, 2));

//     // End the output stream to signal that no more data will be written
//     outputStream.end();
//   });
// }

function csvToJson(inputFile, outputFile, primaryKey) {
  const inputStream = fs.createReadStream(inputFile, 'utf-8');
  const outputStream = fs.createWriteStream(outputFile);

  const reader = readline.createInterface({ input: inputStream });
  let header = null;
  const data = {};

  reader.on('line', (line) => {
    const row = [];
    let currentCol = '';
    let insideQuotes = false;

    // Split the line into columns, handling quotes
    for (let i = 0; i < line.length; i++) {
      if (line[i] === ',' && !insideQuotes) {
        row.push(currentCol);
        currentCol = '';
      } else {
        if (line[i] === '"') {
          insideQuotes = !insideQuotes;
        }
        currentCol += line[i];
      }
    }
    row.push(currentCol);

    // Remove quotes from each column
    const rowWithoutQuotes = row.map((col) => {
      if (col.startsWith('"') && col.endsWith('"')) {
        return col.slice(1, -1);
      }
      return col;
    });

    if (header === null) {
      header = rowWithoutQuotes;
      return;
    }

    const entry = {};
    for (let i = 0; i < header.length; i++) {
      if (header[i] === primaryKey) {
        data[rowWithoutQuotes[i]] = entry;
      } else {
        entry[header[i]] = rowWithoutQuotes[i];
      }
    }
  });

  reader.on('close', () => {
    outputStream.write(JSON.stringify(data, null, 2));
    outputStream.end();
  });
}

// combineData('m_pokedex.json');
csvToJson('moves.csv', 'moves.json', 'name');
