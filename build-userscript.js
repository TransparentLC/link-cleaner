import esbuild from 'esbuild';

esbuild.buildSync({
    entryPoints: ['src/entry-userscript.js'],
    outfile: 'dist/link-cleaner.user.js',
    charset: 'utf8',
    bundle: true,
    minify: true,
    define: {
        'globalThis.ENV': '"userscript"',
    },
    banner: {
        js: `
            // ==UserScript==
            // @name        Link Cleaner
            // @version     ${Date.now()}
            // @author      TransparentLC
            // @description 清洗网页上带有各种跟踪参数的链接
            // @source      https://github.com/TransparentLC/link-cleaner
            // @downloadURL https://i.akarin.dev/link-cleaner.user.js
            // @match       *://*/*
            // @connect     *
            // @grant       GM_registerMenuCommand
            // @grant       GM_setClipboard
            // @grant       GM_xmlhttpRequest
            // ==/UserScript==
            /* eslint-disable */
        `.trim().split('\n').map(e => e.trim()).join('\n'),
    },
});