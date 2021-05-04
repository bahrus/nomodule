# no-module

<a href="https://nodei.co/npm/nomodule/"><img src="https://nodei.co/npm/nomodule.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/nomodule">

## Purpose

ES6 modules are a great leap forward over the legacy JavaScript browsers support.  But there are two gaps where legacy JavaScript provided some advantages.

### Referencing outside the script tag.

JS references, pre-ES6 modules, allowed for global variables / functions, which in turn saw such libraries as JQuery thrive. jQuery consumers could just assume $ was ever present and ready to serve the developer.

Over time, this aspect of JavaScript came to be viewed more as a bug than a feature, leading to such initiatives as require.js and eventually ES6 modules.

On the other hand, ES6 modules provide export capabilities, but the keyword "export" symbol becomes meaningless in the context of a script tag:

```html
<script type=module>
export const h = 'hello'; // nothing outside this module can access h, and the export keyword is meaningless.
</script>
```

### Access to the script tag instance.

Another important feature ES6 modules lost that "legacy" script tags supported was access to the script tag from which the script derived - document.currentScript.

no-module provides some support to overcome these limitations.

## Syntax

nomodule.js provides a mechanism where the exported symbols can be accessed.  Script tags must have attribute nomodule=ish:

```html
<script nomodule=ish id=myScriptTag>
export const h = 'hello';
throw 'new Error'; 
</script>

<script>
    myScriptTag.addEventListener('loaded', e =>{
        console.log(myScriptTag._modExport);
        // { h: "hello" }
    });
    myScriptTag.addEventListener('err', e => {
        console.log(e.detail.message);
        // "new Error"
    })
</script>
```

**NBs:**

1.  The "nomodule" attribute tells modern browsers to ignore the tag, so there is no wasted CPU processing something that isn't fully complete.

2.  This library, no-module.js, then, can inject some special instructions to produce the desired effects.  But the JS processor which is used after the special instructions are inserted is in fact the ES6 (module) processor.  So ES6 imports are allowed, for example (though support for import maps will require turning on the Chrome flag for import maps, or using a polyfill, like es-module-shim or es-dev-server).

3.  The pattern matching is precise / inflexible, and is limited to "export[space]const[space][symbol to export]".

no-module.js also works for script references to ES6 modules, i.e.:

```html
<script nomodule=ish src=myModule.js></script>
```

## document.currentScript replacement

To access the script tag which references or contains the script, use the magic string: "selfish":

```JavaScript
const scriptTag = selfish;
console.log(scriptTag);
//<script nomodule="ish" src="test.js" id="myScriptTag" data-found="true" data-loaded="true"></script>
```

**NB:** Greedy code will break.

Simply including a reference to no-module.js will allow any "nomodule=ish" script tags outside any shadow DOM to load as described above.

To achieve the same behavior within a shadow DOM realm, include a single no-module tag somewhere:

```html
<my-custom-element>
    #shadow
        ...
        <script nomodule=ish src=myModule.js></script>
        ...
        <script nomodule=ish src=yourModule.js></script>
        <no-module></no-module>
</my-custom-element>
```

** Working like it's '95 [TODO]

```html
<div on-click="myScript.yawnAndStretch()">Tumble out of bed</div>
...
<script nomodule=ish id=myScript>
export function yawnAndStretch(){
    event.target.textContent = 'Try to come to life';
}
</script>
```
