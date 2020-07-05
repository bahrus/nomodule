# no-module

## Purpose

JS references, pre-ES6 modules, allowed for global variables / functions, which in turn saw such libraries as JQuery thrive. jQuery consumers could just assume $ was ever present and ready to serve the developer.

Over time, this aspect of JavaScript came to be viewed more as a bug than a feature, leading to such initiatives as require.js and eventually ES6 modules.

ES6 modules provide export capabilities, but the keyword "export" symbol becomes meaningless in the context of a script tag:

```html
<script type=module>
export const h = 'hello'; // nothing outside this module can access h, and the export keyword is meaningless.
</script>
```

nomodule.js provides a mechanism where the exported symbols can be accessed.  Script tags must have attribute nomodule, and type="module ish":

```html
<script nomodule type="module ish" id=myScriptTag>
export const h = 'hello';
</script>

<script>
    myScriptTag.addEventListener('loaded', e =>{
        console.log(myScriptTag._modExport);
        // { h: "hello" }
    })
</script>
```

**NBs:**:

1.  The "nomodule" attribute tells modern browsers to ignore the tag, so there is no wasted CPU processing something that isn't fully complete.

2.  This library, no-module.js, then, can inject some special instructions to produce the desired effects.  But in fact the JS processor which is used after the special instructions are inserted is in fact the ES6 processor.  So ES6 imports are allowed, for example (though support for import maps will require turning on the Chrome flag for import maps, or using a polyfill, like es-module-shim)

no-module.js also works for script references to ES6 modules, i.e.:

```html
<script nomodule type="module ish" src=myModule.js></script>
```

Another important feature ES6 modules lost that "legacy" script tags supported was access to the script tag from which the script derived - document.currentScript

Access to the script tag which references or contains the module-ish code can access the script tag via window['2071aa02-e277-47f7-882a-a5a7c6218d4d']:

```JavaScript
const scriptTag = window['2071aa02-e277-47f7-882a-a5a7c6218d4d'];
console.log(scriptTag);
//<script nomodule="" type="module ish" src="test.js" id="myScriptTag" data-found="true" data-loaded="true"></script>
```
