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
type jsTypes = "arguments" | "array" | "arraybuffer" | "asyncfunction" | "bigint" | "bigint64array" | "biguint64array" | "boolean" | "class" | "dataview" | "date" | "error" | "float" |  "float32array" | "float64array" | "function" | "generator" | "generatorfunction" | "int" | "int8array" | "int16array" | "int32array" | "json" | "map" | "math" | "module" | "null" | "number" | "object" | "promise" | "regexp" | "set" | "string" | "symbol" | "uint8array" | "uint8clampedarray" | "uint16array" | "uint32array" | "weakmap" | "weakset" | "undefined";
type nestedObject = { [key: string]: jsTypes | nestedObject };

type typeMap = {
  arguments: IArguments,
  array: any[],
  arraybuffer: ArrayBuffer,
  asyncfunction: (...args: unknown[]) => Promise<unknown>,
  bigint: bigint,
  bigint64array: BigInt64Array,
  biguint64array: BigUint64Array,
  boolean: boolean,
  class: object,
  dataview: DataView,
  date: Date,
  error: Error,
  float: number,
  float32array: Float32Array,
  float64array: Float64Array,
  function: Function,
  generator: Generator<unknown, unknown, unknown>,
  generatorfunction: (...args: unknown[]) => Generator<number, void, void>,
  int: number,
  int8array: Int8Array,
  int16array: Int16Array,
  int32array: Int32Array,
  json: Record<string, unknown>,
  map: Map<unknown, unknown>,
  math: Math,
  module: object,
  null: null,
  number: number,
  object: object,
  promise: Promise<unknown>,
  regexp: RegExp,
  set: Set<any>,
  string: string,
  symbol: symbol,
  uint8array: Uint8Array,
  uint8clampedarray: Uint8ClampedArray,
  uint16array: Uint16Array,
  uint32array: Uint32Array,
  weakmap: WeakMap<object, unknown>,
  weakset: WeakSet<object>,
  undefined: undefined
};

type inferObjStructure<T> = T extends { [key: string]: infer U }
  ? { [K in keyof T]:
    U extends keyof typeMap
    ? typeMap[U]
    : U extends nestedObject
    ? inferObjStructure<U>
    : never
  }
: never;

interface optionsInterface {
  min?: number | null,
  max?: number,
  trim?: boolean,
  regex?: RegExp | null
};

interface optionsObj {
  max: number | null,
  min: number,
  trim: boolean,
  regex: RegExp | null
};

export default class Vdck {
  private showErrors: boolean;
  private disabled: boolean;

  /** Vdck constructor
   * 
   * @param showErrors Show errors?
   * @param disabled Disable every method and always return true
   */
  constructor(showErrors: boolean, disabled: boolean = false) {
    this.showErrors = showErrors;
    this.disabled = disabled;
  }

  /** Log errors based on method's params
   * 
   * @param {string} message Error message
   * @param {string} type Error type
   * @returns {void}
   */
  private eLog(message: any, type?: string): void {console.error(`[${new Date().toISOString()}] ${type ? `${type} error:` : "Error:"}`, message)};

  /** Checks if the given value is a valid email address
   * 
   * @param {any} value Any value
   * @param {RegExp | null} regex Do you prefer an alternative regex pattern? Give it as RegExp
   * @returns {boolean}
   */
  isEmail(value: any, regex: RegExp | null = null): value is string {
    if (!(regex instanceof RegExp)) regex = EMAIL_REGEX;
    return this.type(value, "string", { min: 5, max: 254, regex: regex });
  }

  /** Checks if the given value is a valid IPv4/IPv6 address
   * 
   * @param {any} value 
   * @returns {boolean}
   */
  isIP(value: any): boolean {
    if (this.disabled) return true;

    // Type checks
    if (!this.type(value, "string", { min: 3, max: 40 })) return false;

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
          if (this.showErrors) this.eLog(`Given ip was not a valid IPv4 address '${value}'`, "General");
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
          if (this.showErrors) this.eLog(`Invalid IPv6 segment: "${part}" in "${value}"`, "General");
          return false;
        }
      }

      if (emptySegments > 1) {
        if (this.showErrors) this.eLog(`Invalid IPv6 address: Too many "::" in "${value}"`, "General");
        return false;
      }
      // Invalid IP address
    } else {
      if (this.showErrors) this.eLog(`Given ip was not a valid ip address '${value}'`, "General");
      return false;
    }

    return true;
  }

  /** Retrieve standard options or validate and sanitize given options
   * 
   * @param {optionsInterface} options Options object
   * @returns {optionsObj}
   */
  formatOptions(options: optionsInterface): optionsObj {
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

  /** Methods to validates values
   * 
   * @param {any} value Any input value
   * @param {jsTypes} type The type that would be value
   * @param {optionsInterface} options Validate options
   * @returns {boolean}
   */
  type<T extends jsTypes>(value: any, type: T, options?: optionsInterface): value is typeMap[T] {
    if (this.disabled) return true;

    // Initialize switch type control and retrieve the given value's type
    let correctType: boolean = false;
    const valueCheck: string = {}.toString.call(value).slice(8, -1).toLowerCase();

    switch (type) {
      case "class":
        if (valueCheck == "object") {
          try {
            if ((/^class/.test(value.constructor.toString()))) correctType = true;
          } catch (err: unknown) {
            if (this.showErrors) this.eLog(err, "Unknown");
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
      if (this.showErrors) this.eLog(`the given value is not a valid ${valueCheck}`, "Type");
      return false;
    }

    // Options checks
    if (options) {
      const fnOptions: optionsObj = this.formatOptions(options);

      // Trim and regex checks
      if (valueCheck === "string") {
        if (fnOptions.trim) value = value.trim();
        if (fnOptions.regex instanceof RegExp && !fnOptions.regex.test(value)) {
          if (this.showErrors) this.eLog("Params error", `the given string doesn't match the regex pattern`);
          return false;
        }
      }

      // Size checks
      const size = 
        valueCheck === "string" ? value.length :
        valueCheck.endsWith("array") ? value.length :
        valueCheck === "arraybuffer" ? value.byteLength :
        valueCheck === "object" ? Object.keys(value).length :
        valueCheck === "map" || valueCheck === "set" ? value.size :
        null;

      if (size !== null) {
        if (size < fnOptions.min) {
          if (this.showErrors) this.eLog("Params error", `the given value has fewer elements/characters than ${fnOptions.min}`);
          return false;
        }
        if (typeof fnOptions.max === "number" && size > fnOptions.max) {
          if (this.showErrors) this.eLog("Params error", `the given value has more elements/characters than ${fnOptions.max}`);
          return false;
        }
      }
    }

    return true;
  }

  /** Checks if the main object has the same structure as the struct param
   * 
   * @param {any} main Main object
   * @param {structObject} struct Struct object
   * @returns {boolean}
   */
  sameObjects<structObject extends nestedObject>(main: any, struct: structObject): main is inferObjStructure<structObject> {
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
          const expectedType: structObject[Extract<keyof structObject, string>] = struct[key];
          const actualValue: any = main[key as keyof typeof main];

          if (!(key in main)) {
            if (this.showErrors) this.eLog("general", `'${key}' key is not a "main"'s object key`);
            return false;
          }

          // Check the type based on the expected type
          if (typeof expectedType === "string") {
            if (!this.type(actualValue, expectedType.toLowerCase() as jsTypes, undefined)) {
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