import './GM_fetch.js';
import cleanLink from './link-cleaner.js';

/**
 * @param {HTMLAnchorElement} e
 */
const cleanLinkForDOM = e => e.href && cleanLink(e.href)
    .then(t => {
        const r = t.toString()
        if (e.href === r) return;
        console.log('Link cleaner:', e, e.href, '->', (e.href = t.toString()));
    })
    .catch(err => console.warn('Link cleaner:', e, e.href, 'Failed to clean', err));

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
            if (mutation.target.nodeName === 'A') {
                // console.log('Link Cleaner', mutation.target, mutation.oldValue, mutation.target.href);
                cleanLinkForDOM(mutation.target);
            }
        }
    }).observe(document.body, {
        attributes: true,
        attributeFilter: ['href'],
        // attributeOldValue: true,
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
GM_registerMenuCommand('复制标题和网址', () => GM_setClipboard(`${document.title.trim()}\n${location.href}`));
GM_registerMenuCommand('复制标题和网址（Markdown）', () => GM_setClipboard(`![${document.title.trim()}](${location.href})`));
