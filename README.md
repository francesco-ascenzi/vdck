# VDCK
Vdck is a lightweight, fast, and robust class designed for type-checking and data validation.

## Summary
- [Overview](#overview)  
- [Updates](#updates)  
- [Import](#import)  
- [Constructor](#constructor)  
- [Methods](#methods)  
- [Options](#options)  
- [Stats](#stats)  
- [Funding](#funding)  
- [Author](#author)  
- [License](#license)  

## Overview
Here is a simple overview of Vdck methods and their returns:
```
import Vdck from "vdck"; || const Vdck = require("vdck");
const vdck = new Vdck(false);

vdck.isEmail("test.email@emailaddress.com") // returns true

// vdck.isEmail("test.emailaddress.com") // returns false
// vdck.isEmail("TEST.email@emailaddress.com") // returns false because there are some uppercase letters

vdck.isIP("192.168.0.1") // returns true

// vdck.isIP("256.256.256.256") // returns false
// vdck.isIP(null) // returns false

let type;
vdck.type(data, "undefined") // returns true

// vdck.type(data, "string") // returns false
// vdck.type(data, "number") // returns false

let sampleObj = { first: 1, second: 2 };
vdck.sameObjects(sampleObj, { first: "number" }) // returns true

// vdck.sameObjects(sampleObj, { first: "number", second: "number" }) // returns true
// vdck.sameObjects(sampleObj, { second: "string" }) // returns false

/* Best feature */
if (vdck.sameObjects(sampleObj, { third: "number", fourth: { fifth: "number" } })) {
  // TypeScript will not report fourth or fifth keys as an error because you've already checked their properties!
  console.log(sampleObj.fourth.fifth) <-- TypeScript will understand that fifth is a number and it'll provide every prototype methods for the right type!
}
```

## Updates
**v 2.0.2-4**
- There was an error with the global types definitions, now fixed.

**v 2.0.1**
- There was an error ```vdck.type``` during the object type-checking, now fixed.

**v 2.0**
- Vdck is now a ***class***.
- **Type-checking has been improved** thanks to ```{}.prototype.toString.call(value)``` function's return.
- ```vdck.type``` method has replaced every type-checking function (e.g. ```isString``` has become ```vdck.type(data, "string")```).
- Now you can validate multiple keys/values starting from a structured object (e.g. ```vdck.sameObjects(data, { firstKey: "string" })``` ), with a nested validation checking! (e.g. ```{ firstKey: { secondKey: "string" }}```).
- ```isEmail``` has been converted into a method.
- Added the ```isIP``` method to validate IP addresses.

**v 1.4**: 
- ```isNumber``` function's parameters fixed, empty string values are now excluded

**v 1.3**: 
- ```isKeyInObject``` function's parameters fixed, null/undefined/empty values are now excluded
  
## Import
It can be imported both as an ES6 module:
```
import Vdck from 'vdck';
```
or as a CommonJS module:
```
const Vdck = require('vdck');
```
Then you can initialize it as a constant, or a variable:
```
const vdck = new Vdck.default([boolean value]);
```

## Constructor
From the JS doc:
```
/** Vdck constructor
 * 
 * @param printError - Should it print errors?
 * @param disabled [optional] - Disable every methods and always return true
 */
constructor(printError: boolean, disabled: boolean = false) {}
```
To instantiate it, for example:
```
const vdck = new Vdck.default(false, false [optional]);
```

## Methods
The following is a brief description of which methods vdck contains:

#### isEmail
Validates whether the given input is a valid email address::
```
/** Validates whether the given value is a valid email address
 * 
 * By default, it uses a regex based on a simplified subset of the RFC 5322 standard
 * 
 * @param {any} value - The value to validate
 * @param {RegExp | null} regex - Optional custom regex pattern for email validation
 * @returns {boolean}
 */
isEmail(value: any, regex: RegExp | null = null): boolean {}
```
*Example usage*:
```
if (vdck.isEmail("test.email@emailaddress.com")) {}
```

#### isIP
Check if the given input is a valid IPv4/IPv6 address:
```
/** Validates whether the given value is a valid IPv4 or IPv6 address
 *
 * @param {any} value - The value to validate
 * @returns {boolean}
 */
isIP(value: any): boolean {}
```
*Example usage*:
```
if (vdck.isIP("192.168.0.1")) {}
```
  
#### type
Checks whether the given input matches the method's expected parameter type:
```
/** Validates the type and structure of a given value
 *
 * @param {any} value - The value to validate
 * @param {jsTypes} type - The expected type to validate against
 * @param {optionsInterface} options - Optional validation parameters
 * @returns {boolean}
 */
type<T extends jsTypes>(value: any, type: T, options?: optionsInterface): value is typeMap[T] {}
```
*Example usage*:
```
if (vdck.isIP(anyData, "string")) {}
```
  
#### sameObjects  
```
/** Checks if the main object has the same structure as the struct param
 * 
 * @param {any} main - The main object to validate
 * @param {structObject} struct - The expected object to compare
 * @returns {boolean}
 */
sameObjects<structObject extends nestedObject>(main: any, struct: structObject): main is inferObjStructure<structObject> {}
```
*Example usage*:
```
if (vdck.sameObjects(data, { firstKey: { secondKey: "string" } })) {}
```

## Options
The ```type``` method in Vdck includes an optional parameter (*options*), which allows for additional validations and constraints.

Properties:
- trim (boolean) [default = false]: Specifies whether string inputs should be trimmed (leading and trailing whitespace removed) before validation.
```
vdck.type("   test   ", "string", { trim: true });
```
- regex (RegExp) [default = null]: Provides a custom regular expression for additional string validation. If the string does not match the regex pattern, the method returns false.
```
vdck.type("abc123", "string", { regex: /^[a-z]+$/ }); // Returns false due to numbers
```
- min (number) [default = 0]: Sets the minimum size or length for the input. This applies to strings, arrays, ArrayBuffers, objects, maps, and sets.
```
vdck.type([1, 2, 3], "array", { min: 5 }); // Returns false due to fewer elements
```
- max (number) [default = 1000 * 1000]: Sets the maximum size or length for the input. This applies to strings, arrays, ArrayBuffers, objects, maps, and sets.
```
vdck.type("Hello", "string", { max: 3 }); // Returns false because the string is too long
```

## Stats
The ```type``` method has been tested with 39 different data types:
```
time          |  type-checking cycles
--------------|-----------------------
~ 268.683 ms  |  50.000
~ 547.582 ms  |  100.000
~ 2.50 s      |  500.000
~ 4.66 s      |  1.000.000
~ 47.66 s     |  10.000.000
```
  
## Funding
If you liked this package, consider funding it at [@PayPal](https://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A) (the link is within package.json too)

## Author
Frash | Francesco Ascenzi ([@furanji](https://www.instagram.com/furanji) on IG)

## License
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.