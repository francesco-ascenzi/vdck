/** ====================== == == == = = =  =  =
 * => Vdck
 * 
 * Vdck is a TypeScript/CJS library providing validation functions for various primitive data types
 * 
 * @author Frash | Francesco Ascenzi
 * @license Apache 2.0
 * ======================= == == == = = =  =  = */


// Based on RFC 5322
const EMAIL_REGEX: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// Types and interfaces
type NestedCheck = { [key: string]: "number" | "string" | "boolean" | "object" | "array" | "function" | NestedCheck };
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

interface optionsInterface {
  minLength?: number,
  maxLength?: number,
  regex?: RegExp,
  trim?: boolean
};

type availTypes = "boolean" | "object" | "symbol" | "undefined" | "string" | "number" | "bigint" | "class" | "function" | "array";

// function isEmail(value: any, trim: boolean = false, regex: RegExp | null = null, showErrors: boolean = false): value is string {
//   if (!regex) regex = EMAIL_REGEX;
//   if (!isString(value, trim, 5, 254, regex, showErrors)) return false;
//   return true;
// }

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
  private optionsCheck(value: any, options?: optionsInterface): boolean {
    
    switch (typeof value) {
      case "bigint":
      break;
      case "boolean":
      break;
      case "function":
      break;
      case "number":
      break;
      case "object":
      break;
      case "string":
      break;
      case "symbol":
      break;
      case "undefined":
      break;
      default: 
        return false;
    }

    return true;

    // if (typeof options.minLength === "number") {
    //   if (options.minLength < 0) {
    //   }

    //   let confrontation: any = value;
    //   if (typeof value === "bigint")
    //   if (this.showErrors) this.clog("params", "The minKeysLength param is not a positive number");
    //   return false;
    // }

    // // Check method's restrictions
    // if (Object.keys(value).length <= minKeysLength) { // Minimum keys length
    //   if (this.showErrors) this.clog("params", `The value has ${Object.keys(value).length} ${Object.keys(value).length <= 1 ? "key" : "keys"}, less than the minimum required length of ${minKeysLength}`);
    //   return false;
    // }

    // if (typeof maxKeysLength === "number") { // Maximum keys length
    //   if (maxKeysLength >= (minKeysLength + 1) && Object.keys(value).length >= maxKeysLength) {
    //     if (this.showErrors) this.clog("params", `The value has ${Object.keys(value).length} ${Object.keys(value).length <= 1 ? "key" : "keys"}, too much than the maximum required length of ${maxKeysLength}`);
    //     return false;
    //   }
    // }
  }

  /** Checks the value's type
   * 
   * @param {any} value 
   * @param {availTypes} type 
   * @param {optionsInterface} options 
   * @returns {boolean}
   */
  type(value: any, type: availTypes, options?: optionsInterface): value is typeof type {
    if (this.disabled) return true;

    // Type check
    let switchPassed: boolean = true;
    switch (type) {
      case "bigint":
      break;
      case "boolean":
        if (typeof value !== "boolean") switchPassed = false;
      break;
      case "function":
      break;
      case "number":
      break;
      case "object":
      break;
      case "string":
      break;
      case "symbol":
      break;
      case "undefined":
      break;
      default: 
        return false;
    }

    // Type check failed
    if (!switchPassed) {
      if (this.showErrors) this.clog("type", `The value is not a ${value}`);
      return false;
    }

    // Checks method's params
    return this.optionsCheck(value, options);
  }

  /** Checks if the value is an array
   * 
   * @param {any} value Any value
   * @returns {boolean}
   */
  array<arr>(value: any, options?: optionsInterface): value is arr[] {
    if (this.disabled) return true;

    // Checks method's value type
    if (!Array.isArray(value)) {
      if (this.showErrors) this.clog("type", "The value is not an array");
      return false;
    }

    // Checks method's params
    return this.optionsCheck(value, options);
  }

  /** Checks if the value is a number
   * 
   * @param {any} value Any value
   * @returns {boolean}
   */
  number(value: any, options?: optionsInterface): value is number {
    if (this.disabled) return true;

    // Checks method's value type
    if (typeof value == 'string' && value.trim() != "") {
      if (isNaN(Number(value.trim()))) {
        if (showErrors) console.error(`\x1b[31mGiven value is not a valid 'number', it is ${typeof value}\x1b[0m`);
        return false;
      }

      value = Number(value.trim());
    } else if (typeof value != 'number') {
      if (showErrors) console.error(`\x1b[31mGiven value is not a valid 'number', it is ${typeof value}\x1b[0m`);
      return false;
    }

    // Checks method's params
    return this.optionsCheck(value, options);
  }

  /** Checks if the value is an object
   * 
   * @param {any} value Any value
   * @returns {boolean}
   */
  object(value: any, options?: optionsInterface): value is Record<string, any> {
    if (this.disabled) return true;

    // Checks method's value type
    if (!(typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Function) && Object.getPrototypeOf(value) === Object.prototype)) {
      if (this.showErrors) this.clog("type", "The value is not an object");
      return false;
    }

    // Checks method's params
    return this.optionsCheck(value, options);
  }

  /** Checks if the main object has the same structure as the struct param
   * 
   * @param {any} main Main object
   * @param {strObj} struct Struct object
   * @returns {boolean}
   */
  sameObjects<strObj extends NestedCheck>(main: any, struct: strObj, options?: optionsInterface): main is InferNestedCheck<strObj> {
    // Check that both "main" and "struct" objects are [key: string]: any objects
    if (!this.object(main) || !this.object(struct)) return false;

    try {
      for (const key in struct) {
        if (Object.prototype.hasOwnProperty.call(struct, key)) {
          const expectedType: strObj[Extract<keyof strObj, string>] = struct[key];
          const actualValue: any = main[key];

          if (!(key in main)) {
            if (this.showErrors) this.clog("general", `'${key}' key is not a "main"'s object key`);
            return false;
          }

          // Check the type based on the expected type
          if (typeof expectedType === "string") {
            switch (expectedType.toLowerCase()) {
              case "number":
                if (typeof actualValue !== "number") {
                  if (this.showErrors) console.error(`Key '${key}' is not of type 'number'`);
                  return false;
                }
                break;
              case "string":
                if (typeof actualValue !== "string") {
                  if (this.showErrors) console.error(`Key '${key}' is not of type 'string'`);
                  return false;
                }
                break;
              case "boolean":
                if (typeof actualValue !== "boolean") {
                  if (this.showErrors) console.error(`Key '${key}' is not of type 'boolean'`);
                  return false;
                }
                break;
              case "object":
                if (actualValue === null || Array.isArray(actualValue) || typeof actualValue !== "object") {
                  if (this.showErrors) console.error(`Key '${key}' is not a plain object`);
                  return false;
                }
                break;
              case "array":
                if (!Array.isArray(actualValue)) {
                  if (this.showErrors) console.error(`Key '${key}' is not an array`);
                  return false;
                }
                break;
              case "function":
                if (typeof actualValue !== "function") {
                  if (this.showErrors) console.error(`Key '${key}' is not a function`);
                  return false;
                }
                break;
              default:
                if (this.showErrors) console.error(`Unsupported type '${expectedType}' for key '${key}'`);
                return false;
            }
          } else if (typeof expectedType === "object" && expectedType !== null) {
            // Recursively check nested objects
            if (!this.sameObjects(actualValue, expectedType, options)) {
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

  /** Checks if the value is a string
   * 
   * @param {any} value Main object
   * @param {optionsInterface} options Struct object
   * @returns {boolean}
   */
  string(value: any, options?: optionsInterface): value is string {
    if (this.disabled) return true;

    // Checks method's value type
    if (typeof value !== "string") {
      if (this.showErrors) this.clog("type", "The value is not a string");
      return false;
    }

    // Checks method's params
    return this.optionsCheck(value, options);
  }
}

// function isIP(
//   value: any,
//   showErrors: boolean = false
// ): boolean {
//   if (!isString(value, false, 3, 40, null, showErrors)) return false;

//   // IPv4-mapped IPv6 (ex. ::ffff:192.168.1.1)
//   if (value.startsWith("::ffff:")) {
//     const ipv4Part: string = value.slice(7);
//     return isIP(ipv4Part, showErrors);
//   } else if (["::1", "::"].includes(value)) {
//     return true;
//   }

//   let splitType: string = ":";
//   if (/\./.test(value)) {
//     splitType = ".";
//   }

//   const splittedIp: string[] = value.split(splitType);
//   // IPv4
//   if (splittedIp.length == 4 && splitType == ".") {
//     for (let i = 0; i < splittedIp.length; i++) {
//       const triplet: string = splittedIp[i];

//       const castTriplet: number = Number(triplet);
//       if (isNaN(castTriplet) || !(castTriplet >= 0 && castTriplet <= 255)) {
//         if (showErrors) console.error(`\x1b[31mGiven ip was not a valid IPv4 address '${value}'\x1b[0m`);
//         return false;
//       }
//     }
//   // IPv6
//   } else if (splittedIp.length > 1 && splittedIp.length <= 8 && splitType == ":") {
//     let emptySegments: number = 0;

//     for (let i = 0; i < splittedIp.length; i++) {
//       const part: string = splittedIp[i];
  
//       // Handle empty segments (for "::" abbreviation)
//       if (part === "") {
//         emptySegments++;
//         continue;
//       }
  
//       // Check if each segment is a valid hexadecimal string with up to 4 characters
//       if (!/^[0-9a-fA-F]{1,4}$/.test(part)) {
//         if (showErrors) console.error(`\x1b[31mInvalid IPv6 segment: "${part}" in "${value}"\x1b[0m`);
//         return false;
//       }
//     }

//     if (emptySegments > 1) {
//       if (showErrors) console.error(`\x1b[31mInvalid IPv6 address: Too many "::" in "${value}"\x1b[0m`);
//       return false;
//     }
//   // Invalid IP address
//   } else {
//     if (showErrors) console.error(`\x1b[31mGiven ip was not a valid ip address '${value}'\x1b[0m`);
//     return false;
//   }

//   return true;
// }