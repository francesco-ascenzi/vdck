/** ====================== == == == = = =  =  =
 * => VDCK
 * 
 * Vdck is a TypeScript/CJS library providing validation functions for various primitive data types
 * 
 * @function isArray - Check if the given input is a valid array based on function's parameters
 * @function isKeyInObject - Check if the given key exists within the given object and its value's type based on function's parameters
 * @function isNotUndefinedNull - Check if the given input is not undefined nor null
 * @function isNumber - Check if the given input is a valid number based on function's parameters
 * @function isObject - Check if the given input is a valid object based on function's parameters
 * @function isString - Check if the given input is a valid string based on function's parameters
 * 
 * @author Frash | Francesco Ascenzi
 * @license Apache 2.0
 * ======================= == == == = = =  =  = */

// Interfaces
interface KeyOptions {
  maxLength?: number;
  minLength?: number;
  numberType?: string;
  regx?: RegExp | null;
  type?: number;
  trim?: boolean;
}

/** Check if the given input is a valid array based on function's parameters
 * 
 * @param {any} value - Any value to check
 * @param {number} [minLength=0] - Minimum array length
 * @param {number} [maxLength=5000] - Maximum array length
 * @param {boolean} [showErrors=false] - Should it prints error message on the CLI?
 * @return {boolean}
 */
export function isArray(
  value: any,
  minLength?: number,
  maxLength?: number,
  showErrors?: boolean
): boolean;

/** Check if the given input is a valid string based on function's parameters
 * 
 * @param {any} value - Any value to check
 * @param {boolean} [trim=true] - Should it trims the given value before checking it?
 * @param {number} [minLength=0] - Minimum string length
 * @param {number} [maxLength=5000] - Maximum string length
 * @param {RegExp | null} [regex=null] - Check regular expression to validate the string
 * @param {boolean} [showErrors=false] - Should it prints error message on the CLI?
 * @return {boolean}
 */
export function isString(
  value: any,
  trim?: boolean,
  minLength?: number,
  maxLength?: number,
  regex?: RegExp | null,
  showErrors?: boolean
): boolean;

/** Check if the given key exists within the given object and its value's type based on function's parameters
 * 
 * @param {Obj} value - Any value to check
 * @param {string} key - Given object's key
 * @param {string} keyValueType - Given object's key value
 * @param {object} options - Value's key options for every type
 * 
 * @param {undefined | number} options.maxLength - Value's key options for maximum length types
 * @param {undefined | number} options.minLength - Value's key options for minimum length
 * @param {undefined | string} options.numberType - Value's key options for number's type types
 * @param {undefined | RegExp | null} options.regx - Value's key options for regexp types
 * @param {undefined | number} options.type - Value's key options for type's types
 * @param {undefined | boolean} options.trim - Value's key options for trim types
 * 
 * @param {boolean} [showErrors=false] - Should it prints error message on the CLI?
 * @return {boolean}
 */
export function isKeyInObject(
  value: object,
  key: string,
  keyValueType: string,
  options?: KeyOptions | null,
  showErrors?: boolean
): boolean;

/** Check if the given input is not undefined nor null
 * 
 * @param {any} value - Any value to check
 * @return {boolean}
 */
export function isNotUndefinedNull(value: any): boolean;

/** Check if the given input is a valid number based on function's parameters
 * 
 * @param {any} value - Any value to check
 * @param {number} [numberType='i'] - Should it be an int or a float? 'i' -> int | 'f' -> float
 * @param {number} [type=0] - Should it be a real number, a positive number, or a negative number?
 * @param {boolean} [showErrors=false] - Should it prints error message on the console?
 * @return {boolean}
 */
export function isNumber(
  value: any,
  numberType?: 'i' | 'f',
  type?: number,
  showErrors?: boolean
): boolean;

/** Check if the given input is a valid object based on function's parameters
 * 
 * @param {any} value - Any value to check
 * @param {number} [minLength=0] - Minimum keys length
 * @param {number} [maxLength=5000] - Maximum keys length
 * @param {boolean} [showErrors=false] - Should it prints error message on the console?
 * @return {boolean}
 */
export function isObject(
  value: any,
  minLength?: number,
  maxLength?: number,
  showErrors?: boolean
): boolean;

export const Vdck: {
  isArray: typeof isArray;
  isKeyInObject: typeof isKeyInObject;
  isNotUndefinedNull: typeof isNotUndefinedNull;
  isNumber: typeof isNumber;
  isObject: typeof isObject;
  isString: typeof isString;
};