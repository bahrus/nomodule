import 'css-observe/css-observe.js';

const cssObserve = document.createElement('css-observe') as any;
cssObserve.observe = true;
cssObserve.selector = 'script[nomodule]';
cssObserve.addEventListener('latest-match-changed', e => {
    e.detail.value.dataset.found = 'true';
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