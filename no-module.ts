import 'css-observe/css-observe.js';


function addListener(node: Node){
    const cssObserve = document.createElement('css-observe') as any;
    cssObserve.observe = true;
    cssObserve.selector = 'script[nomodule]';
    cssObserve.addEventListener('latest-match-changed', e => {
        e.detail.value.dataset.found = 'true';
        loadScript(e.detail.value);
    });
    cssObserve.customStyles = /* css */`
        script[nomodule]{
            display:block;
        }
        script[nomodule][data-found]{
            display:none;
        }
    `;
    node.appendChild(cssObserve);
}

addListener(document.head);

async function loadScript(scriptElement: HTMLScriptElement){
    const key = (new Date()).valueOf().toString() + Math.random();
    (<any>window)[key] = scriptElement;
    (<any>scriptElement)._modExport = {};
    let innerText: string | undefined;
    if(scriptElement.src){
        const resp = await fetch(scriptElement.src);
        const text = await resp.text();
        innerText = text;
    }else{
        innerText = scriptElement.innerText;
    }
    const splitText = innerText.split('export const ');
    let iPos = 0;
    const winKey = `window['${key}']`;
    for(let i = 1, ii = splitText.length; i < ii; i++){
        const token = splitText[i];
        const iPosOfEq = token.indexOf('=');
        const lhs = token.substr(0, iPosOfEq).trim();
        splitText[i] = `const ${lhs}  = ${winKey}._modExport.${lhs} = ${token.substr(iPosOfEq + 1)};`
    }
    let modifiedText = splitText.join('');
    modifiedText += `
window['${key}'].dispatchEvent(new Event('loaded'));
window['${key}'].dataset.loaded = 'true';
`;
    const scriptTag = document.createElement('script');
    scriptTag.type = 'module';
    scriptTag.innerText = modifiedText;
    document.head.appendChild(scriptTag);
}
