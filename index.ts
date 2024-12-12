/** ====================== == == == = = =  =  =
 * => Vdck
 * 
 * Vdck is a TypeScript/CJS class that providing types check validation
 * 
 * @author Frash | Francesco Ascenzi
 * @license Apache 2.0
 * ======================= == == == = = =  =  = */

// Based on RFC 5322
const EMAIL_REGEX: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// Types and interfaces
type primitiveTypes = "bigint" | "boolean" | "number" | "object" | "string" | "symbol" | "undefined";
type NestedCheck = { [key: string]: primitiveTypes | NestedCheck };
type InferNestedCheck<strObj> = {
  [K in keyof strObj]: strObj[K] extends "number"
    ? number
    : strObj[K] extends "string"
    ? string
    : strObj[K] extends "boolean"
    ? boolean
    : strObj[K] extends "object"
    ? object
    : strObj[K] extends "array"
    ? any[]
    : strObj[K] extends NestedCheck
    ? InferNestedCheck<strObj[K]>
    : never;
};

type extendedTypes = "arguments" | "array" | "arraybuffer" | "asyncfunction" | "bigint" | "bigint64array" | "biguint64array" | "boolean" | "class" | "dataView" | "date" | "error" | "float" |  "float32array" | "float64array" | "function" | "generator" | "generatorfunction" | "int" | "int8array" | "int16array" | "int32array" | "json" | "map" | "math" | "module" | "null" | "number" | "object" | "promise" | "regexp" | "set" | "string" | "symbol" | "uint8array" | "uint8clampedarray" | "uint16array" | "uint32array" | "weakmap" | "weakset" | "undefined";
type typeMap = {
  arguments: string,
  array: any[],
  arraybuffer: string,
  asyncfunction: string,
  bigint: bigint,
  bigint64array: string,
  biguint64array: string,
  boolean: boolean,
  class: object,
  dataView: string,
  date: Date,
  error: Error,
  float: number,
  float32array: string,
  float64array: string,
  function: Function,
  generator: string,
  generatorfunction: string,
  int: number,
  int8array: string,
  int16array: string,
  int32array: string,
  json: string,
  map: object,
  math: string,
  module: string
  null: null,
  number: number,
  object: object,
  promise: string,
  regexp: RegExp,
  set: Set<any>,
  string: string,
  symbol: symbol,
  uint8array: string,
  uint8clampedarray: string,
  uint16array: string,
  uint32array: string,
  weakmap: string,
  weakset: string,
  undefined: undefined
};

interface optionsInterface {
  minLength?: number,
  maxLength?: number,
  regex?: RegExp,
  trim?: boolean
};

interface optionsObj {
  min: number,
  max: number,
  minLength: number,
  maxLength: number,
  trim: boolean,
  regex: RegExp | null
};

export default class Vdck {
  private showErrors: boolean;
  private asyncr: boolean;
  private disabled: boolean;

  constructor(showErrors: boolean, asyncr: boolean = false, disabled: boolean = false) {
    this.showErrors = showErrors;
    this.asyncr = asyncr;
    this.disabled = disabled;
  }

  /** Log errors async or sync based on constructor param
   * 
   * @param {string} type Error type
   * @param {string} message Error message
   * @returns {void}
   */
  private clog(type: string, message: string): void {
    let premessage: string = "Error:";
    if (type == "type") {
      premessage = "Type error:";
    } else if (type == "params") {
      premessage = "Restriction error:";
    }

    if (this.asyncr) {
      // Async console
    } else {
      console.error(`[${new Date().toISOString()}]`, premessage, message);
    }
  }

  /** Validate optional restrictions
   * 
   * @param {any} value Main value to check
   * @param {string} type Value's type
   * @param {number} options.minLength 
   * @param {number} options.minLength 
   * @param {number} options.minLength 
   * @returns {boolean}
   */
  private getOptions(value: any, type: primitiveTypes, options?: optionsInterface): {} {
    const cleanedOptions = {};
    
    return cleanedOptions;
  }

  /** Checks if the value is a valid email address
   * 
   * @param {any} value 
   * @param {RegExp | null} regex
   * @returns {boolean}
   */
  isEmail(value: any, regex: RegExp | null = null): value is string {
    if (!(regex instanceof RegExp)) regex = EMAIL_REGEX;
    return this.type(value, "string", { minLength: 5, maxLength: 254, regex: regex });
  }

  /** Checks if the value is a valid IPv4/IPv6 address
   * 
   * @param {any} value 
   * @returns {boolean}
   */
  isIP(value: any): boolean {
    if (this.disabled) return true;

    // Type checks
    if (!this.type(value, "string", { minLength: 3, maxLength: 40 })) return false;

    // IPv4-mapped IPv6 (ex. ::ffff:192.168.1.1)
    if (value.startsWith("::ffff:")) {
      const ipv4Part: string = value.slice(7);
      return this.isIP(ipv4Part);
    } else if (["::1", "::"].includes(value)) {
      return true;
    }

    let splitType: string = ":";
    if (/\./.test(value)) {
      splitType = ".";
    }

    const splittedIp: string[] = value.split(splitType);
    // IPv4
    if (splittedIp.length == 4 && splitType == ".") {
      for (let i = 0; i < splittedIp.length; i++) {
        const triplet: string = splittedIp[i];

        const castTriplet: number = Number(triplet);
        if (isNaN(castTriplet) || !(castTriplet >= 0 && castTriplet <= 255)) {
          if (this.showErrors) this.clog("general", `Given ip was not a valid IPv4 address '${value}'`);
          return false;
        }
      }
      // IPv6
    } else if (splittedIp.length > 1 && splittedIp.length <= 8 && splitType == ":") {
      let emptySegments: number = 0;

      for (let i = 0; i < splittedIp.length; i++) {
        const part: string = splittedIp[i];

        // Handle empty segments (for "::" abbreviation)
        if (part === "") {
          emptySegments++;
          continue;
        }

        // Check if each segment is a valid hexadecimal string with up to 4 characters
        if (!/^[0-9a-fA-F]{1,4}$/.test(part)) {
          if (this.showErrors) this.clog("general", `Invalid IPv6 segment: "${part}" in "${value}"`);
          return false;
        }
      }

      if (emptySegments > 1) {
        if (this.showErrors) this.clog("general", `Invalid IPv6 address: Too many "::" in "${value}"`);
        return false;
      }
      // Invalid IP address
    } else {
      if (this.showErrors) this.clog("general", `Given ip was not a valid ip address '${value}'`);
      return false;
    }

    return true;
  }

  formatOptions(fnOptions: optionsObj, options?: optionsInterface) {
    const retObj = {
      min: 0,
      max: 1000 * 1000,
      minLength: 0,
      maxLength: 1000 * 1000,
      trim: false,
      regex: null
    };

  }

  /** Checks the value's type
   * 
   * @param {any} value 
   * @param {extendedTypes} type 
   * @param {optionsInterface} options 
   * @returns {boolean}
   */
  type<T extends extendedTypes>(value: any, type: T, options?: optionsInterface): value is typeMap[T] {
    if (this.disabled) return true;

    // Format options
    let fnOptions: optionsObj = {
      min: 0,
      max: 1000 * 1000,
      minLength: 0,
      maxLength: 1000 * 1000,
      trim: false,
      regex: null
    };
    if (this.type(options, "object", {})) {
      this.formatOptions(fnOptions, options);
    }

    // Initialize holding switch
    let switchPassed: boolean = true;

    // Type check
    const valueCheck: string = {}.toString.call(value).slice(8, -1).toLowerCase();
    switch (type) {
      case "class":

        if (valueCheck != "object") {
          switchPassed = false;
          break;
        }

        try {
          if (!(/^class/.test(value.constructor.toString()))) {
            if (this.showErrors) this.clog("type", `${value} is not a class`);
            return false;
          }
        } catch (err: unknown) {
          if (this.showErrors) this.clog("error", String(err));
          return false;
        }

        break;
      case "number":
      case "int":
      case "float":

        if (!(valueCheck == "string" || valueCheck == "number")) {
          switchPassed = false;
          break;
        }

        if (valueCheck == "string") {
          value = Number(value.trim());
          if (isNaN(value)) {
            switchPassed = false;
            break;
          }
        }

        if (type == "float" && Number.isInteger(value)) {
          switchPassed = false;
        } else if (type == "int" && !Number.isInteger(value)) {
          switchPassed = false;
        }

        break;
      case "object":

        if (!(!Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype)) switchPassed = false;

        break;
      default: 
        
        if (type == valueCheck) {
          switchPassed = false;
        }

        break;
    }

    // Type check failed
    if (!switchPassed) {
      if (this.showErrors) this.clog("type", `The value is not a ${value}`);
      return false;
    }

    return true;
  }

  /** Checks if the main object has the same structure as the struct param
   * 
   * @param {any} main Main object
   * @param {strObj} struct Struct object
   * @returns {boolean}
   */
  sameObjects<strObj extends NestedCheck>(main: any, struct: strObj): main is InferNestedCheck<strObj> {
    // Check that both "main" and "struct" objects are [key: string]: any objects
    if (!this.type(main, "object") || !this.type(struct, "object")) return false;

    // Return false if struct has 0 keys
    const mainObjectKeysLength: number = Object.keys(main).length;
    const structObjectKeysLength: number = Object.keys(struct).length;
    
    if ((mainObjectKeysLength > 0 && structObjectKeysLength == 0) || 
      (mainObjectKeysLength == 0 && structObjectKeysLength > 0)
    ) {
      return false;
    }

    try {
      for (const key in struct) {
        if (Object.prototype.hasOwnProperty.call(struct, key)) {
          const expectedType: strObj[Extract<keyof strObj, string>] = struct[key];
          const actualValue: any = main[key as keyof typeof main];

          if (!(key in main)) {
            if (this.showErrors) this.clog("general", `'${key}' key is not a "main"'s object key`);
            return false;
          }

          // Check the type based on the expected type
          if (typeof expectedType === "string") {
            if (!this.type(actualValue, expectedType.toLowerCase() as extendedTypes, undefined)) {
              return false;
            }
          } else if (typeof expectedType === "object" && !Array.isArray(actualValue) && expectedType !== null) {
            // Recursively check nested objects
            if (!this.sameObjects(actualValue, expectedType)) {
              if (this.showErrors) console.error(`Key '${key}' does not match the nested structure`);
              return false;
            }
          } else {
            if (this.showErrors) console.error(`Invalid structure definition for key '${key}'`);
            return false;
          }
        } else {
          return false;
        }
      }

      return true;
    } catch (err: unknown) {
      if (this.showErrors) console.error(`Error occurred: ${String(err)}`);
      return false;
    }
  }
}