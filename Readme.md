# 🧩 Node Arg Parser

A simple, chainable command-line argument parser for Node.js CLI tools. Supports type validation, short & long args, and automatic help display.



## 📦 Installation

Install via npm:

```bash
npm install node-arg-parser
```


## 🧠 Features

✅ Short and long flags (e.g., `-f` and `--file`)  
✅ Type validation (`String`, `Number`, `Boolean`)  
✅ Required or optional arguments  
✅ Built-in `--help` flag support  
✅ Automatically aligned usage help


## 🚀 Getting Started

### Step 1: Import the Parser

```js
import ArgParser from 'node-arg-parser';
// or for CommonJS:
// const ArgParser = require('node-arg-parser');
```

### Step 2: Define Your Arguments

```js
const parser = new ArgParser();

parser
  .add('-f', '--file')
  .acceptType(String)
  .setDescription('The path to the input file')
  .required();

parser
  .add('-v', '--verbose')
  .acceptType(Boolean)
  .setDescription('Enable verbose mode');

parser
  .add('-n', '--number')
  .acceptType(Number)
  .setDescription('A numeric input');
```

### Step 3: Parse Arguments

```js
const args = parser.parse();
console.log(args);
```

### Step 4: Run via CLI

```bash
node app.js --file input.txt --verbose true --number 123
```

✅ Output:

```json
{
  "file": "input.txt",
  "verbose": true,
  "number": 123
}
```

## 🔍 Using `--help`

You don’t need to configure this manually. Just run:

```bash
node app.js --help
```

🧾 Output:

```
Usage:

  -f  --file       The path to the input file
  -v  --verbose    Enable verbose mode
  -n  --number     A numeric input
```

## 📘 Full API Reference

### `add(short, long)`
Defines a new argument.

- `short`: e.g. `-f`
- `long`: e.g. `--file`

Returns a chainable object.

### `.acceptType(type)`
Defines expected type: `String`, `Number`, or `Boolean`

### `.setDescription(text)`
Sets a human-readable description (used in help output)

### `.required([true|false])`
Marks argument as required (default is `false`)


## 🧪 Example with Validation

```js
parser
  .add('-p', '--port')
  .acceptType(Number)
  .setDescription('Port to run the server on')
  .required();
```

```bash
# Valid
node app.js --port 3000

# Invalid
node app.js --port abc
# Error: Argument --port must be a number
```


## 🧑‍💻 Author

**Jatin Gohil**  
GitHub: [@lkjatinc669](https://github.com/lkjatinc669)


## 🐞 Issues & Contributions

Found a bug or want to contribute? Open an issue or PR at:

👉 [https://github.com/lkjatinc669/node-arg-parser/issues](https://github.com/lkjatinc669/node-arg-parser/issues)


## 📄 License

Licensed under the [ISC License](https://opensource.org/licenses/ISC)
