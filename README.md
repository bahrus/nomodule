# no-module

JS references, pre-ES6 modules, allowed for global variables / functions, which in turn saw such libraries as JQuery thrive, where jQuery consumers could just assume $ was ever present.

Of course, over time, this aspect of JavaScript came to be viewed more as a bug than a feature, leading to such initiatives as require.js and eventually ES6.

ES6 modules provide export capabilities, but the keyword "export" symbol becomes meaningless in the context of a script tag:

```html
<script type=module>
export const h = 'hello'; // nothing outside this module can access h, and the export keyword is meaningless.
</script>
```

nomodule.js provides a mechanism where the exported symbols can be accessed:

```html
<script nomodule just-kidding-yes-module id=myScriptTag>
export const h = 'hello';
</script>

<script>
    myScriptTag.addEventListener('loaded', e =>{
        console.log(myScriptTag._modExport);
        // { h: "hello" }
    })
</script>
```

This also works for script references to ES6 modules.
