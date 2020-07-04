import 'css-observe/css-observe.js';
const cssObserve = document.createElement('css-observe');
cssObserve.observe = true;
cssObserve.selector = 'script[nomodule]';
cssObserve.addEventListener('latest-match-changed', e => {
    e.detail.value.dataset.found = 'true';
    loadScript(e.detail.value);
});
cssObserve.customStyles = /* css */ `
    script[nomodule]{
        display:block;
    }
    script[nomodule][data-found]{
        display:none;
    }
`;
document.head.appendChild(cssObserve);
function loadScript(scriptElement) {
    const key = (new Date()).valueOf().toString();
    window[key] = scriptElement;
    const innerText = scriptElement.innerText;
    const splitText = innerText.split('export const ');
    let iPos = 0;
    const winKey = `window['${key}']`;
    for (let i = 1, ii = splitText.length; i < ii; i++) {
        const token = splitText[i];
        const iPosOfEq = token.indexOf('=');
        const lhs = token.substr(0, iPosOfEq).trim();
        splitText[i] = `const ${lhs}  = ${winKey}.${lhs} = ${token.substr(iPosOfEq + 1)};`;
    }
    const modifiedText = splitText.join('');
    eval(modifiedText);
    delete window[key];
}
