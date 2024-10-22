# VDCK
Vdck is a TypeScript/CJS package that providing primitive data validation functions. Its key features includes:
- **Comprehensive Validation**: Check arrays, strings, numbers, objects, keys' values, and handle null/undefined values.
- **Time-Saving**: Simplifies type checking in TypeScript, reducing development time.
- **Efficient**: Lightweight utility with a minimal footprint of just 26.0 KB.
- **Compatibility**: Fully compatible with Node.js versions >= 6.0.0.

## Summary
- [Updates](#updates)  
- [Install](#install)  
- [Import](#import)  
- [Functions](#functions)  
- [Funding](#funding)  
- [Author](#author)  
- [License](#license)  

## Updates
**v 1.3**: 
- ```isKeyInObject``` function's parameters fixed, null/undefined/empty values are now excluded

**v 1.2**: 
- ```isObject``` type check error fixed, null is now excluded

**v 1.1**:  
- Added the ```isEmail``` function to validate email addresses
- Delete unnecessary arrays check on ```isKeyInObject```  
- Added another param to to ```isNumber``` => ```'a'``` => it checks that is a number without a specific tag (int or float)  
- Edit/delete comments and README.md  
  
## Install
To get started with vdck, simply install the npm package:
```
npm i vdck
```

## Import
It can be imported both as ES6 or as CommonJS module
```
// Node > ES6
import vdck from 'vdck';

// Node > CommonJS
const vdck = require('vdck');
```

## Functions
The following is a brief description of which functions vdck contains:

### isArray
Check if the given input is a valid array based on function's parameters:
- value **{any}** - Any value to check.
- minLength **{number}** - (default: 0) - Minimum array length.
- maxLength **{number}** - (default: 5000) - Maximum array length.
- showErrors **{boolean}** - (default: false) - Should it prints error message on the CLI?    
  
```
// Node > CommonJS
vdck.isArray(["Hello", " world", "!"]);

// Node > ES6
isArray(["Hello", " world", "!"]);
```

### isString
Check if the given input is a valid string based on function's parameters:
- value **{any}** - Any value to check.
- trim **{boolean}** - (default: true) - Should it trims the given value before checking it?
- minLength **{number}** - (default: 0) - Minimum string length.
- maxLength **{number}** - (default: 5000) - Maximum string length.
- regex **{RegExp | null}** - (default: null) - Check regular expression to validate the string.
- showErrors **{boolean}** - (default: false) - Should it prints error message on the CLI?  
  
```
// Node > CommonJS
vdck.isString("Ciao!", true, 0, 100, /^[a-zA-Z0-9]+$/gm);

// Node > ES6
isString("Ciao!", true, 0, 100, /^[a-zA-Z0-9]+$/gm);
```
  
### isEmail
Check if the given input is a valid email address based on function's parameters:
- value **{any}** - Any value to check.
- trim **{boolean}** - (default: true) - Should it trims the given value before checking it?
- regex **{RegExp | null}** - (default: null) - Check regular expression to validate the email address.
- showErrors **{boolean}** - (default: false) - Should it prints error message on the CLI?  
  
```
// Node > CommonJS
vdck.isEmail("helloWorld@gmail.com");

// Node > ES6
isEmail("helloWorld@gmail.com");
```
  
### isKeyInObject  
> isKeyInObject function has default values for its options' parameters:  
> **maxLength**: number = 40000;  
> **minLength**: number = 0;  
> **regx**: RegExp | null = null;  
> **type**: -1 | 0 | 1 = 0;  
> **trim**: boolean = true;  
  
Check if the given key exists within the given object and its value's type based on function's parameters:
- value **{Obj extends Record<string, any>}** - Any value to check.
- key **{string}** - Given object's key.
- keyValueType **{string}** - Given object's key value.
- options **{object | null}** - (default: null) - Value's key options for every type.
- options.maxLength **{undefined | number}** - Value's key options for maximum length types.
- options.minLength **{undefined | number}** - Value's key options for minimum length.
- options.numberType **{undefined | string}** - Value's key options for number's type types.
- options.regx **{undefined | RegExp | null}** - Value's key options for regexp types.
- options.type **{undefined | number}** - Value's key options for type's types.
- options.trim **{undefined | boolean}** - Value's key options for trim types.
- showErrors **{boolean}** - (default: false) - Should it prints error message on the CLI?  
  
```
// Node > CommonJS
vdck.isKeyInObject({ "Hi": 2 }, 'Hi', 'n');

// Node > ES6
isKeyInObject({ "Hi": 2 }, 'Hi', 'n');
```  

### isNotUndefinedNull
Check if the given input is not undefined nor null based on function's parameter:
- value **{any}** - Any value to check.  

```
// Node > CommonJS
vdck.isNotUndefinedNull(false);

// Node > ES6
isNotUndefinedNull(false);
```

### isNumber
Check if the given input is a valid number based on function's parameters:
- value **{any}** - Any value to check.
- numberType **{number}** - (default: 'i') - Should it be an int or a float? 'a' -> all | 'i' -> int | 'f' -> float.
- type **{number}** - (default: 0) - Should it be a real number, a positive number, or a negative number?
- showErrors **{boolean}** - (default: false) - Should it prints error message on the console?
  
```
// Node > CommonJS
vdck.isNumber(21, 'i', 1);

// Node > ES6
isNumber(21, 'i', 1);

```

### isObject
Check if the given input is a valid object based on function's parameters:
- value **{any}** - Any value to check.
- minLength **{number}** - (default: 0) - Minimum keys length.
- maxLength **{number}** - (default: 5000) - Maximum keys length.
- showErrors **{boolean}** - (default: false) - Should it prints error message on the console?  
  
```
// Node > CommonJS
vdck.isObject({}, 0, 1, true);

// Node > ES6
isObject({}, 0, 1, true);
```
  
## Funding
If you liked this package, consider funding it at [@PayPal](https://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A) (the link is within package.json too)

## Author
Frash | Francesco Ascenzi ([@fra.ascenzi](https://www.instagram.com/fra.ascenzi) on IG)

## License
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.