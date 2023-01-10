import './GM_fetch.js';
import cleanLink from './link-cleaner.js';

/**
 * @param {HTMLAnchorElement} e
 */
const cleanLinkForDOM = e => e.href && cleanLink(e.href)
    .then(t => (e.href !== t.toString()) && (e.href = t.toString()))
    .catch(err => console.warn('Failed to clean:', e.href, err));

setTimeout(() => [
    ...document.querySelectorAll('[data-spm]'),
    ...document.querySelectorAll('[data-spm-anchor-id]'),
].forEach(e => {
    e.removeAttribute('data-spm');
    e.removeAttribute('data-spm-anchor-id');
}), 1000);

cleanLink(location.href).then(e => {
    if (e.toString() !== location.href) {
        document.head.innerHTML = '';
        document.body.innerHTML = `<div style="display:flex;height:100vh;flex-direction:column;justify-content:center;align-items:center"><div style="margin:.25em">链接已清洗，即将跳转到以下地址</div><small style="margin:.25em">${e}</small></div>`;
        return location.href = e.toString();
    }

    Array.from(document.querySelectorAll('a')).forEach(cleanLinkForDOM);

    // Experimental
    new MutationObserver(mutationList => {
        for (const mutation of mutationList) {
            if (mutation.target.nodeName.toLowerCase() === 'a') {
                cleanLinkForDOM(mutation.target);
            }
        }
    }).observe(document.body, {
        attributes: true,
        attributeFilter: ['href'],
        childList: true,
        subtree: true,
    });
});

GM_registerMenuCommand('手动输入链接进行清洗', async () => {
    const url = prompt('请输入需要清洗的链接：');
    if (!url) return;
    try {
        const cleaned = await cleanLink(url);
        if (cleaned !== url) {
            confirm('链接已清洗，是否需要复制？\n' + cleaned) && GM_setClipboard(cleaned);
        } else {
            alert('链接无需清洗。');
        }
    } catch (err) {
        alert('链接清洗失败。\n' + err.stack);
    }
});

GM_registerMenuCommand('重新清洗网页上的所有链接', () => Array.from(document.querySelectorAll('a')).forEach(cleanLinkForDOM));
