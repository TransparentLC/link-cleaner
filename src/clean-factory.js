/** @type {(input: RequestInfo, init?: RequestInit) => Promise<Response>} */
const fetch = globalThis.ENV === 'userscript' ? globalThis.GM_fetch : globalThis.fetch;

/** @typedef {(url: URL) => (URL | void | Promise<URL|void>)} cleanFunction */

export default {
    /**
     * @param  {...cleanFunction} fn
     * @returns {cleanFunction}
     */
    chain: (...fn) => async url => {
        for (let i = 0; i < fn.length; i++) {
            url = (await fn[i](url)) || url;
        }
        return url;
    },
    /**
     * @param {String} p
     * @returns {cleanFunction}
     */
    urlDecodeSearchParam: p => url => url.searchParams.has(p) ? new URL(decodeURIComponent(url.searchParams.get(p))) : url,
    /**
     * @param {String} p
     * @returns {cleanFunction}
     */
    base64DecodeSearchParam: p => url => url.searchParams.has(p) ? new URL(atob(url.searchParams.get(p))) : url,
    /**
     * @param {Set<String>} p
     * @returns {cleanFunction}
     */
    blacklist: p => url => p.forEach(k => url.searchParams.delete(k)),
    /**
     * @param {Set<String>} p
     * @returns {cleanFunction}
     */
    whitelist: p => url => {
        /** @type {Set<String>} */
        const remove = new Set;
        for (const k of url.searchParams.keys()) {
            if (!p.has(k)) remove.add(k);
        }
        remove.forEach(k => url.searchParams.delete(k));
    },
    /**
     * @param {URL} url
     * @returns {URL}
     */
    getSearch: url => new URL(decodeURIComponent(url.search.replace(/^\?/, ''))),
    /**
     * @param {URL} url
     * @returns {URL}
     */
    getRedirect: async url => {
        const resp = await fetch(url, {
            redirect: 'manual',
            credentials: globalThis.ENV === 'cfworker' ? undefined : 'omit',
        });
        return globalThis.ENV === 'userscript' ? new URL(resp.url) : (resp.headers.has('location') ? new URL(resp.headers.get('location')) : url);
    },
    /**
     * @param {(s: String) => String} fn
     * @returns {cleanFunction}
     */
    getRedirectFromBody: fn => async url => {
        const resp = await fetch(url, {
            redirect: 'manual',
            credentials: globalThis.ENV === 'cfworker' ? undefined : 'omit',
        }).then(r => r.text());
        return new URL(fn(resp));
    },
    /**
     * @param {URL} url
     * @returns {URL}
     * @link https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/bvid_desc.html#%E7%AE%97%E6%B3%95%E6%A6%82%E8%BF%B0
     */
    bv2av: url => new URL(url.toString().replace(/[Bb][Vv]1([1-9A-HJ-NP-Za-km-z]{9})/g, (_, bv) => {
        const bvChars = bv.split('');
        [bvChars[0], bvChars[6]] = [bvChars[6], bvChars[0]];
        [bvChars[1], bvChars[4]] = [bvChars[4], bvChars[1]];
        let r = 0n;
        for (let i = 0; i < 9; i++) {
            r *= 58n;
            const c = bvChars[i].charCodeAt();
            // r += BigInt('FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf'.indexOf(c));
            if (48 <= c && c <= 57) {
                r += [
                    -1n, 44n, 45n, 11n, 26n, 14n, 39n, 17n, 29n, 52n,
                ][c - 48];
            } else if (65 <= c && c <= 90) {
                r += [
                     3n, 37n, 42n, 49n, 18n,  0n, 12n, 21n, -1n, 19n,
                     6n, 15n,  8n,  5n, -1n,  4n, 50n, 53n, 48n,  7n,
                    47n, 13n, 23n, 51n, 32n, 56n,
                ][c - 65];
            } else if (97 <= c && c <= 122) {
                r += [
                    31n, 28n,  1n, 54n, 33n, 57n, 10n, 30n, 35n, 16n,
                    41n, -1n, 46n, 20n, 55n, 22n, 36n, 40n, 24n, 27n,
                     9n, 34n,  2n, 25n, 43n, 38n,
                ][c - 97];
            }
        }
        return `av${(r & 2251799813685247n) ^ 23442827791579n}`;
    })),
    /**
     * @param {URL} url
     * @returns {URL}
     */
    useHttps: url => {
        if (url.protocol === 'https:') return url;
        const cleaned = new URL(url);
        cleaned.protocol = 'https:';
        return cleaned;
    },
};
