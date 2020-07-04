import 'css-observe/css-observe.js';

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
document.head.appendChild(cssObserve);

async function loadScript(scriptElement: HTMLScriptElement){
    const key = (new Date()).valueOf().toString();
    (<any>window)[key] = scriptElement;
    let innerText: string | undefined;
    if(scriptElement.src){
        console.log(scriptElement.src);
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
        splitText[i] = `const ${lhs}  = ${winKey}.${lhs} = ${token.substr(iPosOfEq + 1)};`
    }
    const modifiedText = splitText.join('');
    const scriptTag = document.createElement('script');
    scriptTag.type = 'module';
    scriptTag.innerText = modifiedText;
    document.head.appendChild(scriptTag);
}
