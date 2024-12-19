/// <reference path="./types/vdck.d.ts" />

/** ====================== == == == = = =  =  =
 * => Vdck
 * ======================= == == == = = =  =  =
 * @author Frash | Francesco Ascenzi
 * @license Apache 2.0
 * ======================= == == == = = =  =  = */

// Types and interfaces
import { inferObjStructure, jsTypes, nestedObject, optionsInterface, optionsObj, typeMap } from "./types/vdck";

/** Vdck constructor
 * 
 * @param printError - Should it print errors?
 * @param disabled - Disable every methods and always return true
 */
export default class Vdck {
  private printError: boolean;
  private disabled: boolean;
  
  constructor(printError: boolean, disabled: boolean = false) {
    this.printError = printError;
    this.disabled = disabled;
  }

  /** Logs errors with a given message and type
   * 
   * @param {string} message - Error's message to log
   * @param {string} type - Error's type
   * @returns {void}
   */
  private eLog(message: any, type?: string): void {console.error(`[${new Date().toISOString()}] ${type ? `${type} error:` : "Error:"}`, message)};

  /** Validates and sanitizes the given options object
   * 
   * Properties:
   * - `min` (number): Minimum acceptable size (default: 0, must be a non-negative integer)
   * - `max` (number | null): Maximum acceptable size (default: null, must be >= `min` if provided)
   * - `trim` (boolean): Whether to trim strings during validation
   * - `regex` (RegExp | null): A regular expression to validate values
   * 
   * @param {optionsInterface} options - An object containing validation options
   * @returns {optionsObj}
   */
  private formatOptions(options: optionsInterface): optionsObj {
    const fnObj: optionsObj = {
      min: 0,
      max: null,
      trim: false,
      regex: null
    };

    if (("min" in options) && typeof options.min == "number" && Number.isInteger(options.min) && options.min >= 0) fnObj.min = options.min;
    if (("max" in options) && typeof options.max == "number" && Number.isInteger(options.max) && options.max >= fnObj.min) fnObj.max = options.max;

    if (("trim" in options) && typeof options.trim == "boolean") fnObj.trim = options.trim;
    if (("regex" in options) && options.regex instanceof RegExp) fnObj.regex = options.regex;

    return fnObj;
  }

  /** Validates whether the given value is a valid email address
   * 
   * By default, it uses a regex based on a simplified subset of the RFC 5322 standard
   * 
   * @param {any} value - The value to validate
   * @param {RegExp | null} regex - Optional custom regex pattern for email validation
   * @returns {boolean}
   */
  isEmail(value: any, regex: RegExp | null = null): value is string {
    if (this.disabled) return true;

    // Based on RFC 5322
    const EMAIL_REGEX: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (!(regex instanceof RegExp)) regex = EMAIL_REGEX;
    return this.type(value, "string", { min: 5, max: 254, regex: regex });
  }

  /** Validates whether the given value is a valid IPv4 or IPv6 address
   *
   * @param {any} value - The value to validate
   * @returns {boolean}
   */
  isIP(value: any): boolean {
    if (this.disabled) return true;

    // Type checks
    if (!this.type(value, "string", { min: 3, max: 40 })) return false;

    // IPv4-mapped IPv6
    if (value.startsWith("::ffff:")) {
      const ipv4Part: string = value.slice(7);
      return this.isIP(ipv4Part);
    } else if (["::1", "::"].includes(value)) {
      return true;
    }

    let splitType: string = ":";
    if (/\./.test(value)) splitType = ".";

    const splittedIp: string[] = value.split(splitType);
    // IPv4
    if (splittedIp.length == 4 && splitType == ".") {
      for (let i = 0; i < splittedIp.length; i++) {
        const triplet: string = splittedIp[i];

        const castTriplet: number = Number(triplet);
        if (isNaN(castTriplet) || !(castTriplet >= 0 && castTriplet <= 255)) {
          if (this.printError) this.eLog(`the given ip was not a valid IPv4 address`, "General");
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
          if (this.printError) this.eLog(`this "${part}" is an invalid IPv6 segment`, "General");
          return false;
        }
      }

      if (emptySegments > 1) {
        if (this.printError) this.eLog(`invalid IPv6 address, too many "::"`, "General");
        return false;
      }
    // Invalid IP address
    } else {
      if (this.printError) this.eLog(`the given ip was not a valid ip address`, "General");
      return false;
    }

    return true;
  }

  /** Validates the type and structure of a given value
   *
   * @param {any} value - The value to validate
   * @param {jsTypes} type - The expected type to validate against
   * @param {optionsInterface} options - Optional validation parameters
   * @returns {boolean}
   */
  type<T extends jsTypes>(value: any, type: T, options?: optionsInterface): value is typeMap[T] {
    if (this.disabled) return true;

    // Retrieve value's type
    let correctType: boolean = false;
    const valueCheck: string = {}.toString.call(value).slice(8, -1).toLowerCase();

    // Validate type
    switch (type) {
      case "class":
        if (valueCheck == "object") {
          try {
            if ((/^class/.test(value.constructor.toString()))) correctType = true;
          } catch (err: unknown) {
            if (this.printError) this.eLog(err, "Unknown");
            return false;
          }
        }
        break;
      case "number":
      case "int":
      case "float":
        if (valueCheck == "string" || valueCheck == "number") {
          if (valueCheck == "string") {
            value = Number(value.trim());
            if (isNaN(value)) break;
          }
  
          if (type == "float" && Number.isInteger(value)) break;
          if (type == "int" && !Number.isInteger(value)) break;

          correctType = true;
        }
        break;
      case "object":
        if (!(type == valueCheck && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype)) {
          break;
        }
        break;
      default: 
        if (type == valueCheck) correctType = true;
        break;
    }

    // Type checks failed
    if (!correctType) {
      if (this.printError) this.eLog(`the given value is not a valid ${valueCheck}`, "Type");
      return false;
    }

    // Options checks
    if (options) {
      const fnOptions: optionsObj = this.formatOptions(options);

      // Trim and regex checks
      if (valueCheck === "string") {
        if (fnOptions.trim) value = value.trim();
        if (fnOptions.regex instanceof RegExp && !fnOptions.regex.test(value)) {
          if (this.printError) this.eLog("Params error", `the given string doesn't match the regex pattern`);
          return false;
        }
      }

      // Size checks
      const size = valueCheck === "string" ? value.length :
        valueCheck.endsWith("array") ? value.length :
        valueCheck === "arraybuffer" ? value.byteLength :
        valueCheck === "object" ? Object.keys(value).length :
        valueCheck === "map" || valueCheck === "set" ? value.size : null;

      if (size !== null) {
        if (size < fnOptions.min) {
          if (this.printError) this.eLog("Params error", `the given value has fewer elements/characters than ${fnOptions.min}`);
          return false;
        }
        if (typeof fnOptions.max === "number" && size > fnOptions.max) {
          if (this.printError) this.eLog("Params error", `the given value has more elements/characters than ${fnOptions.max}`);
          return false;
        }
      }
    }

    return true;
  }

  /** Checks if the main object has the same structure as the struct param
   * 
   * @param {any} main - The main object to validate
   * @param {structObject} struct - The expected object to compare
   * @returns {boolean}
   */
  sameObjects<structObject extends nestedObject>(main: any, struct: structObject): main is inferObjStructure<structObject> {
    if (this.disabled) return true;

    // Check that both "main" and "struct" objects are [key: string]: any objects
    if (!this.type(main, "object") || !this.type(struct, "object")) return false;

    // Return false if 'struct' has no keys but 'main' does, or vice versa
    const mainObjectKeysLength: number = Object.keys(main).length;
    const structObjectKeysLength: number = Object.keys(struct).length;
    
    if ((mainObjectKeysLength > 0 && structObjectKeysLength == 0) || 
      (mainObjectKeysLength == 0 && structObjectKeysLength > 0)
    ) {
      return false;
    }

    try {
      for (const key in struct) {
        // Check if the property is a direct property of the struct object
        if (Object.prototype.hasOwnProperty.call(struct, key)) {
          const expectedType: structObject[Extract<keyof structObject, string>] = struct[key];
          const actualValue: any = main[key as keyof typeof main];

          if (!(key in main)) {
            if (this.printError) this.eLog(`'${key}' key is not a main's object key`, "Invalid key");
            return false;
          }

          // Type checks based on the key's value
          if (typeof expectedType === "string") {
            if (!this.type(actualValue, expectedType.toLowerCase() as jsTypes, undefined)) {
              return false;
            }
          // Recursively check nested keys/values
          } else if (typeof expectedType === "object" && !Array.isArray(actualValue) && expectedType !== null) {
            if (!this.sameObjects(actualValue, expectedType)) {
              if (this.printError) this.eLog(`key '${key}' does not match the nested structure`, "Mismatched structure");
              return false;
            }
          } else {
            if (this.printError) this.eLog(`invalid structure definition for key '${key}'`, "Unknown key's type");
            return false;
          }
        } else {
          if (this.printError) this.eLog(`invalid property in object`, "Invalid property");
          return false;
        }
      }
    } catch (err: unknown) {
      if (this.printError) this.eLog(`${String(err)}`, "General");
      return false;
    }

    return true;
  }
}