export type jsTypes = "arguments" | "array" | "arraybuffer" | "asyncfunction" | "bigint" | "bigint64array" | "biguint64array" | "boolean" | "class" | "dataview" | "date" | "error" | "float" | "float32array" | "float64array" | "function" | "generator" | "generatorfunction" | "int" | "int8array" | "int16array" | "int32array" | "json" | "map" | "math" | "module" | "null" | "number" | "object" | "promise" | "regexp" | "set" | "string" | "symbol" | "uint8array" | "uint8clampedarray" | "uint16array" | "uint32array" | "weakmap" | "weakset" | "undefined";

export type nestedObject = { [key: string]: jsTypes | nestedObject };

export type typeMap = {
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

export type inferObjStructure<T> = T extends { [key: string]: infer U }
  ? { [K in keyof T]:
    U extends keyof typeMap
    ? typeMap[U]
    : U extends nestedObject
    ? inferObjStructure<U>
    : never
  }
: never;

export interface optionsInterface {
  min?: number | null,
  max?: number,
  trim?: boolean,
  regex?: RegExp | null
}

export interface optionsObj {
  max: number | null,
  min: number,
  trim: boolean,
  regex: RegExp | null
}

/** Vdck constructor
 * 
 * @param printError - It should prints errors?
 * @param disabled - Disable every methods and always return true
 */
export default class Vdck {
  private printError: boolean;
  private disabled: boolean;
  
  constructor(printError: boolean, disabled?: boolean);

  /** Logs errors with a given message and type
   * 
   * @param {string} message - Error's message to log
   * @param {string} type - Error's type
   * @returns {void}
   */
  private eLog(message: any, type?: string): void;

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
  private formatOptions(options: optionsInterface): optionsObj;

  /** Validates whether the given value is a valid email address
   * 
   * By default, it uses a regex based on a simplified subset of the RFC 5322 standard
   * 
   * @param {any} value - The value to validate
   * @param {RegExp | null} regex - Optional custom regex pattern for email validation
   * @returns {boolean}
   */
  isEmail(value: any, regex?: RegExp | null): value is string;

  /** Validates whether the given value is a valid IPv4 or IPv6 address
   *
   * @param {any} value - The value to validate
   * @returns {boolean}
   */
  isIP(value: any): boolean;

  /** Validates the type and structure of a given value
   *
   * @param {any} value - The value to validate
   * @param {jsTypes} type - The expected type to validate against
   * @param {optionsInterface} options - Optional validation parameters
   * @returns {boolean}
   */
  type<T extends jsTypes>(value: any, type: T, options?: optionsInterface): value is typeMap[T];

  /** Checks if the main object has the same structure as the struct param
   * 
   * @param {any} main - The main object to validate
   * @param {structObject} struct - The expected object to compare
   * @returns {boolean}
   */
  sameObjects<structObject extends nestedObject>(main: any, struct: structObject): main is inferObjStructure<structObject>;
}