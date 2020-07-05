import('css-observe/css-observe.js');


export class NoModule extends HTMLElement{
    static cache : {[key: string]: string} = {};
    connectedCallback(){
        addListener(this.getRootNode());
    }
}

customElements.define('no-module', NoModule);

Array.from(document.querySelectorAll('script[nomodule][type="module ish"]')).forEach((scriptTag) => {
    const st = scriptTag as HTMLScriptElement;
    st.dataset.found = 'true';
    loadScript(st);
})

function addListener(node: Node){
    const cssObserve = document.createElement('css-observe') as any;
    cssObserve.observe = true;
    cssObserve.selector = 'script[nomodule][type="module ish"]';
    cssObserve.addEventListener('latest-match-changed', e => {
        const st = e.detail.value as HTMLScriptElement;
        if(st.dataset.found === 'true') return;
        st.dataset.found = 'true';
        loadScript(st);
    });
    cssObserve.customStyles = /* css */`
        script[nomodule][type="module ish"]{
            display:block;
        }
        script[nomodule][type="module ish"][data-found]{
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
        if(NoModule.cache[scriptElement.src] === undefined){
            const resp = await fetch(scriptElement.src);
            const text = await resp.text();
            NoModule.cache[scriptElement.src] = text;
        }
        innerText = NoModule.cache[scriptElement.src];
    }else{
        innerText = scriptElement.innerText;
    }
    innerText = innerText.replace(/2071aa02-e277-47f7-882a-a5a7c6218d4d/g, key);
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




