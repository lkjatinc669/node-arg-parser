export default class ArgParser {
    // Setup internal structures
    constructor() {
        this.definitions = {};                  // Stores the definitions for each arg (like type, short name, etc.)
        this.parsedData = {};                   // Stores the final result (user input)
        this.rawData = process.argv.slice(2);   // Get actual user input (skip 'node' and filename)
    }

    // Define a flag
    add(shortArg, longArg) {
        if (!shortArg.startsWith('-') || shortArg.startsWith('--')) {
            throw new Error("Short argument must start with a single '-'");
        }
        if (!longArg.startsWith('--')) {
            throw new Error("Long argument must start with '--'");
        }

        const key = longArg.slice(2); // Remove the '--' prefix to get the internal name (e.g., "aa")

        this.definitions[key] = {
            short: shortArg,      // e.g., "-a"
            long: longArg,        // e.g., "--aa"
            type: String,         // default type if not set
            description: '',      // default description
            required: false       // default required status
        };

        const self = this;

        // Return chainable methods so you can do .acceptType().required().setDescription()
        return {
            acceptType(type = String) {
                self.definitions[key].type = type;
                return this;
            },
            setDescription(desc) {
                self.definitions[key].description = desc;
                return this;
            },
            required(val = true) {
                self.definitions[key].required = val;
                return this;
            }
        };
    }

    // Actually read the command-line args
    parse() {
        const args = this.rawData;

        // Handle help logic
        if (args.includes('--help')) {
            if (args.length > 1) {
                throw new Error(`--help cannot be used with other arguments`);
            }
            console.log("Usage:\n");
            // Calculate max lengths for clean alignment
            const maxShort = Math.max(...Object.values(this.definitions).map(def => def.short.length));
            const maxLong = Math.max(...Object.values(this.definitions).map(def => def.long.length));

            for (const def of Object.values(this.definitions)) {
                const paddedShort = def.short.padEnd(maxShort + 2); // +2 for spacing
                const paddedLong = def.long.padEnd(maxLong + 2);
                console.log(`  ${paddedShort} ${paddedLong} ${def.description}`);
            }
            process.exit(0);
        }

        const usedShorts = new Set();
        const usedLongs = new Set();

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];

            let key = null;
            let def = null;

            // Match short
            for (const [k, d] of Object.entries(this.definitions)) {
                if (arg === d.short) {
                    if (usedShorts.has(d.short)) throw new Error(`Duplicate usage of ${d.short}`);
                    usedShorts.add(d.short);
                    key = k;
                    def = d;
                    break;
                }
            }

            // Match long
            for (const [k, d] of Object.entries(this.definitions)) {
                if (arg === d.long) {
                    if (usedLongs.has(d.long)) throw new Error(`Duplicate usage of ${d.long}`);
                    usedLongs.add(d.long);
                    key = k;
                    def = d;
                    break;
                }
            }

            if (!def) {
                throw new Error(`Unknown argument: ${arg}`);
            }

            const nextVal = args[i + 1];
            if (!nextVal || nextVal.startsWith('-')) {
                this.parsedData[key] = true; // A flag with no value, like --verbose
            } else {
                this.parsedData[key] = def.type(nextVal); // Convert value
                i++; // Skip next argument
            }
        }

        // Validate required
        for (const [key, def] of Object.entries(this.definitions)) {
            if (def.required && !(key in this.parsedData)) {
                throw new Error(`Missing required argument: ${def.long}`);
            }
        }

        // Validate datatype
        for (const [key, def] of Object.entries(this.definitions)) {
            if (key in this.parsedData) {
                const value = this.parsedData[key];

                // Check if expected type is Boolean and value is not a boolean
                if (def.type === Boolean && typeof value !== "boolean") {
                    throw new Error(`Argument ${def.long} must be a boolean`);
                }

                // Check if expected type is Number and value is not a number
                if (def.type === Number && (typeof value !== "number" || isNaN(value))) {
                    throw new Error(`Argument ${def.long} must be a number`);
                }

                // Check if expected type is String and value is not a string
                if (def.type === String && typeof value !== "string") {
                    throw new Error(`Argument ${def.long} must be a string`);
                }
            }
        }

        return this.parsedData;
    }
}
