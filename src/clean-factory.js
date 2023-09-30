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
     */
    bv2av: url => new URL(url.toString().replace(/[Bb][Vv]([A-HJ-NP-Za-km-z1-9]{10})/g, (_, bv) => {
        const s = [9, 8, 1, 6, 2, 4, 0, 7, 3, 5];
        const xor = 177451812n;
        const add = 100618342136696320n;
        let r = 0n;
        let b = 1n;
        for (let i = 0; i < 10; i++) {
            const c = bv[s[i]].charCodeAt();
            let d = 0n;
            if (48 <= c && c <= 57) {
                d = [
                    0n,  13n, 12n, 46n, 31n, 43n, 18n, 40n, 28n, 5n,
                ][c - 48];
            } else if (65 <= c && c <= 90) {
                d = [
                    54n, 20n, 15n, 8n,  39n, 57n, 45n, 36n, 0n,  38n,
                    51n, 42n, 49n, 52n, 0n,  53n, 7n,  4n,  9n,  50n,
                    10n, 44n, 34n, 6n,  25n, 1n,
                ][c - 65];
            } else if (97 <= c && c <= 122) {
                d = [
                    26n, 29n, 56n, 3n,  24n, 0n,  47n, 27n, 22n, 41n,
                    16n, 0n,  11n, 37n, 2n,  35n, 21n, 17n, 33n, 30n,
                    48n, 23n, 55n, 32n, 14n, 19n,
                ][c - 97];
            }
            r += d * b;
            b *= 58n;
        }
        return `av${(r - add) ^ xor}`;
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
