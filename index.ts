/// <reference path="./types/vdck.d.ts" />


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


export function isArray(
  value: any,
  minLength: number = 0,
  maxLength: number = 5000,
  showErrors: boolean = false
): boolean {
  if (!Array.isArray(value)) {
    if (showErrors) console.error(`\x1b[31mGiven value is not an 'array', it is ${typeof value}\x1b[0m`);
    return false;
  }

  if (value.length < minLength) {
    if (showErrors) console.error(`\x1b[31mGiven array length is ${value.length}, less than the minimum required length of ${minLength}\x1b[0m`);
    return false;
  }
  
  if (value.length > maxLength) {
    if (showErrors) console.error(`\x1b[31mGiven array length is ${value.length}, too much than the maximum required length of ${maxLength}\x1b[0m`);
    return false;
  }

  return true;
}


export function isString(
  value: any, 
  trim: boolean = true, 
  minLength: number = 0, 
  maxLength: number = 5000, 
  regex: RegExp | null = null,
  showErrors: boolean = false
): boolean {
  if (typeof value != 'string') {
    if (showErrors) console.error(`\x1b[31mGiven value is not a 'string', it is ${typeof value}\x1b[0m`);
    return false;
  }

  if (trim) value = value.trim();

  if (value.length < minLength) {
    if (showErrors) console.error(`\x1b[Given string has ${value.length} characters, less than the minimum required length of ${minLength}\x1b[0m`);
    return false;
  }

  if (value.length > maxLength) {
    if (showErrors) console.error(`\x1b[31mGiven string has ${value.length} characters, too much than the maximum required length of ${maxLength}\x1b[0m`);
    return false;
  }

  if (regex && !regex.test(value)) {
    if (showErrors) console.error('\x1b[31mString does not match the regular expression\x1b[0m');
    return false;
  }

  return true;
}


export function isEmail(value: any, trim: boolean = false, regex: RegExp | null = null, showErrors: boolean = false): boolean {
  if (!regex) regex = EMAIL_REGEX;
  if (!isString(value, trim, 5, 254, regex, showErrors)) return false;
  return true;
}


export function isKeyInObject<Obj extends Record<string, any>>(value: Obj, key: string, keyValueType: string, options: {
  maxLength?: number,
  minLength?: number,
  regx?: RegExp | null,
  type?: number,
  trim?: boolean
} | null = null, showErrors: boolean = false): boolean {
  if (!(key in value)) {
    if (showErrors) console.error(`\x1b[31mGiven key '${key}' is not a key in ${value}\x1b[0m`);
    return false;
  }

  // Initialize and checking options
  let maxLength: number = 40000;
  let minLength: number = 0;
  let regx: RegExp | null = null;
  let type: -1 | 0 | 1 = 0;
  let trim: boolean = true;

  if (options && typeof options == 'object') {
    if (('maxLength' in options) && typeof options.maxLength == 'number' && options.maxLength >= 0) {
      maxLength = options.maxLength;
    }

    if (('minLength' in options) && typeof options.minLength == 'number' && options.minLength >= 0) {
      minLength = options.minLength;
    }

    if (('regx' in options) && options.regx instanceof RegExp) {
      regx = options.regx;
    }

    if (('maxLength' in options) && typeof options.maxLength == 'number' && 
      (options.type == -1 || options.type == 0 || options.type == 1)
    ) {
      type = options.type;
    }

    if (('trim' in options) && typeof options.trim == 'boolean') {
      trim = options.trim;
    }
  }

  // Check value type
  switch (keyValueType.toLowerCase()) {
    case 'a': // Array
      if (!isArray(value[key], minLength, maxLength, showErrors)) {
        return false;
      }
      break;
    case 'b': // Boolean
      if (typeof value[key] != 'boolean') {
        if (showErrors) console.error(`\x1b[31mValue of '${key}' key is not boolean\x1b[0m`);
        return false;
      }
      break;
    case 'bi': // BigInt
      if (typeof value[key] != 'bigint') {
        if (showErrors) console.error(`\x1b[31mValue of '${key}' key is not a bigint\x1b[0m`);
        return false;
      }
      break;
    case 'd': // Date
      if (!(value[key] instanceof Date)) {
        if (showErrors) console.error(`\x1b[31mValue of '${key}' key is not a date\x1b[0m`);
        return false;
      }
      break;
    case 'f': // Function
      if (typeof value[key] != 'function') {
        if (showErrors) console.error(`\x1b[31mValue of '${key}' key is not a function\x1b[0m`);
        return false;
      }
      break;
    case 'n': // Number
      if (!isNumber(value[key], 'a', type, showErrors)) return false;
      break;
    case 'nf': // Float number
      if (!isNumber(value[key], 'f', type, showErrors)) return false;
      break;
    case 'ni': // Integer number
      if (!isNumber(value[key], 'i', type, showErrors)) return false;
      break;
    case 'o': // Object
      if (!isObject(value[key], minLength, maxLength, showErrors)) return false;
      break;
    case 'r': // RegExp
      if (!(value[key] instanceof RegExp)) {
        if (showErrors) console.error(`\x1b[31mValue of '${key}' key is not a RegExp\x1b[0m`);
        return false;
      }
      break;
    case 's': // String
      if (!isString(value[key], trim, minLength, maxLength, regx, showErrors)) return false;
      break;
    case 'sy': // Symbol
      if (typeof value[key] != 'symbol') {
        if (showErrors) console.error(`\x1b[31mValue of '${key}' key is not a symbol\x1b[0m`);
        return false;
      }
      break;
    default:
      if (showErrors) console.error(`\x1b[31mInvalid keyValueType parameter provided '${keyValueType}'\x1b[0m`);
      return false;
  }

  return true;
}


export function isNotUndefinedNull(value: any): boolean {
  if (value !== undefined && value !== null) return true;
  return false;
}


export function isNumber(value: any, numberType: 'a' | 'i' | 'f' = 'i', type: -1 | 0 | 1 = 0, showErrors: boolean = false): boolean {
  if (typeof value == 'string') {
    if (isNaN(Number(value))) {
      if (showErrors) console.error(`\x1b[31mGiven value is not a valid 'number', it is ${typeof value}\x1b[0m`);
      return false;
    }

    value = Number(value);
  } else if (typeof value != 'number') {
    if (showErrors) console.error(`\x1b[31mGiven value is not a valid 'number', it is ${typeof value}\x1b[0m`);
    return false;
  }

  // Check number type -> integer or float
  if (numberType) {
    if (numberType == 'i' && !Number.isInteger(value)) {
      if (showErrors) console.error(`\x1b[31mGiven number is not an integer\x1b[0m`);
      return false;
    } else if (numberType == 'f' && Number.isInteger(value)) {
      if (showErrors) console.error(`\x1b[31mGiven number is not a float\x1b[0m`);
      return false;
    }
  }

  if (isNotUndefinedNull(type)) {
    if (type == -1 && value > 0) {
      if (showErrors) console.error(`\x1b[31mGiven number is more than 0, it should be a negative number\x1b[0m`);
      return false;
    } else if (type == 1 && value < 0) {
      if (showErrors) console.error(`\x1b[31mGiven number is less than 0, it should be a positive number\x1b[0m`);
      return false;
    }
  }

  return true;
}


export function isObject(
  value: any, 
  minLength: number = 0, 
  maxLength: number = 5000,
  showErrors: boolean = false
): boolean {
  if (!(typeof value == 'object' && !Array.isArray(value)) || !value) {
    if (showErrors) console.error(`\x1b[31mGiven value is not an 'object', it is ${typeof value} or null\x1b[0m`);
    return false;
  }

  if (Object.keys(value).length < minLength) {
    if (showErrors) console.error(`\x1b[31mGiven object has ${Object.keys(value).length} keys, less than the minimum required length of ${minLength}\x1b[0m`);
    return false;
  }

  if (Object.keys(value).length > maxLength) {
    if (showErrors) console.error(`\x1b[31mGiven object has ${Object.keys(value).length} keys, too much than the minimum required length of ${maxLength}\x1b[0m`);
    return false;
  }

  return true;
}