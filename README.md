# VDCK
Vdck is a lightweight, fast, and robust class designed for type-checking and data validation.

## Summary
- [Updates](#updates)  
- [Import](#import)  
- [Constructor](#constructor)  
- [Methods](#methods)  
- [Options](#options)  
- [Stats](#stats)  
- [Funding](#funding)  
- [Author](#author)  
- [License](#license)  

## Updates
**v 2.0**
- Vdck is now a class
- Type-checking improved thanks to ```{}.prototype.toString.call(value)``` function's return
- ```vdck.type``` method replaced every type-checking function (e.g. ```isString``` become ```vdck.type(data, "string")```)
- Now you can validate multiple keys/values starting from a structured object (e.g. ```vdck.sameObjects(data, { firstKey: "string" })``` ), with a nested validation checking!
- ```isEmail``` was converted as a method
- Added ```isIP``` method to validate IP addresses

**v 1.4**: 
- ```isNumber``` function's parameters fixed, empty strings values are now excluded

**v 1.3**: 
- ```isKeyInObject``` function's parameters fixed, null/undefined/empty values are now excluded
  
## Import
It can be imported both as an ES6 module:
```
import Vdck from 'vdck';
```
or as a CommonJS module with:
```
const Vdck = require('vdck');
```
Then you can initialize it as a constant, or a variable:
```
const vdck = new Vdck([boolean value]);
```

## Constructor
From the JS doc:
```
/** Vdck constructor
 * 
 * @param printError - It should prints errors?
 * @param disabled [optional] - Disable every methods and always return true
 */
constructor(printError: boolean, disabled: boolean = false) {
  this.printError = printError;
  this.disabled = disabled;
}
```
To instantiate it, e.g.:
```
const vdck = new Vdck(false, false);
```

## Methods
The following is a brief description of which methods vdck contains:

#### isEmail
Check if the given input is a valid email address:
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
An e.g.:
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
An e.g.:
```
if (vdck.isIP("192.168.0.1")) {}
```
  
#### type
Check if the given input is the same type of method's param:
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
An e.g.:
```
if (vdck.isIP(anyData, "string")) {}
```
  
#### sameObjects  
```

```
An e.g.:
```

```

## Options

## Stats
I tested the ```type``` method with 39 different data types:
```
time          |  type-checking cycles
--------------|-----------------------
~ 268.683 ms  |  50.000 => 50k
~ 547.582 ms  |  100.000 => 100k
~ 2.50 s      |  500.000 => 500k
~ 4.66 s      |  1.000.000 => 1kk
~ 47.66 s     |  10.000.000 => 10kk
```
  
## Funding
If you liked this package, consider funding it at [@PayPal](https://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A) (the link is within package.json too)

## Author
Frash | Francesco Ascenzi ([@furanji](https://www.instagram.com/furanji) on IG)

## License
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.