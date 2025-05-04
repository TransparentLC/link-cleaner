import './GM_fetch.js';
import cleanLink from './link-cleaner.js';

// 处理<a>标签

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

// 处理fetch和XMLHttpRequest（使用xhook）
(async () => {

if (await GM.getValue('xhookEnabled')) {
    (async () => {
        /** @type {String} */
        let xhookScript;
        if (await GM.getValue('xhookCacheBefore', 0) < Date.now() || !(xhookScript = await GM.getValue('xhookCached'))) {
            console.log('Link cleaner:', 'Fetching xhook from jsdelivr ...');
            await GM.setValue('xhookCached', (xhookScript = await fetch('https://cdn.jsdelivr.net/npm/xhook@1/dist/xhook.min.js').then(r => r.text())));
            await GM.setValue('xhookCacheBefore', Date.now() + 6048e5); // 86400 * 7 * 1000
        } else {
            console.log('Link cleaner:', 'Loading xhook from cache ...', 'Expire:', new Date(await GM.getValue('xhookCacheBefore')));
        }
        // Shamefully use eval to run code from string
        (0, unsafeWindow.eval)(xhookScript);
        console.log('Link cleaner:', 'xhook is loaded!');
        unsafeWindow.xhook.before(async (request, callback) => {
            let u = request.url;
            if (typeof u === 'string' && !URL.canParse(u)) {
                u = location.origin + (u.startsWith('/') ? '' : '/') + u;
                console.log(u);
            }
            const r = (await cleanLink(u)).toString();
            if (u.toString() !== r) {
                console.log('Link cleaner:', 'xhook', u.toString(), '->', (request.url = r));
            }
            callback();
        });
    })();
}

// 添加右键菜单

GM.registerMenuCommand('手动输入链接进行清洗', async () => {
    if (window.top !== window.self) return;
    const url = prompt('请输入需要清洗的链接：');
    if (!url) return;
    try {
        const cleaned = await cleanLink(url);
        if (cleaned !== url) {
            confirm('链接已清洗，是否需要复制？\n' + cleaned) && GM.setClipboard(cleaned);
        } else {
            alert('链接无需清洗。');
        }
    } catch (err) {
        alert('链接清洗失败。\n' + err.stack);
    }
});

GM.registerMenuCommand('重新清洗网页上的所有链接', () => Array.from(document.querySelectorAll('a')).forEach(cleanLinkForDOM));
GM.registerMenuCommand('复制标题和网址', () => {
    if (window.top !== window.self) return;
    const text = `${document.title.trim()}\n${location.href}`;
    GM.setClipboard(text);
    alert(`已复制：\n${text}`);
});
GM.registerMenuCommand('复制标题和网址（Markdown）', () => {
    if (window.top !== window.self) return;
    const text = `[${document.title.trim()}](${location.href})`;
    GM.setClipboard(text);
    alert(`已复制：\n${text}`);
});
GM.registerMenuCommand('增强清洗模式（xhr/fetch请求，切换后刷新生效）' + (await GM.getValue('xhookEnabled') ? '✅' : '❌'), async () => GM.setValue('xhookEnabled', !(await GM.getValue('xhookEnabled'))));

})()
