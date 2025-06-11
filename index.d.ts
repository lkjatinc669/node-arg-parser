declare module "node-arg-parser" {
  // Adjust the declaration to match the actual API of node-arg-parser
  export default class ArgParser {
    constructor();
    /**
     * Defines a new argument.
     * @param shortArg - e.g., "-f"
     * @param longArg - e.g., "--file"
     */
    add(shortArg: string, longArg: string): {
      /**
       * Set the expected type: String, Number, or Boolean.
       */
      acceptType(type: any): {
        /**
         * Set the description for the argument.
         */
        setDescription(description: string): {
          /**
           * Specify if the argument is required.
           */
          required(isRequired?: boolean): void;
        };
      };
    };

    /**
     * Parses the command line arguments.
     */
    parse(): any;
  }
}
