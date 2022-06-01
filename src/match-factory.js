/** @typedef {(url: URL) => Boolean} matchFunction */

export default {
    /**
     * @param  {...matchFunction} fn
     * @returns {matchFunction}
     */
    chain: (...fn) => url => {
        for (let i = 0; i < fn.length; i++) {
            if (!fn[i](url)) return false;
        }
        return true;
    },
    /**
     * @param {String | Set<String>} [hostname]
     * @param {String | Set<String>} [pathname]
     * @returns {matchFunction}
     */
    hostpath: (hostname, pathname) => url => (
        (!hostname || (hostname instanceof Set ? hostname.has(url.hostname) : hostname === url.hostname)) &&
        (!pathname || (pathname instanceof Set ? pathname.has(url.pathname) : pathname === url.pathname))
    ),
    /**
     * @param {String} hostname
     * @param {RegExp} pathnameRegex
     * @returns {matchFunction}
     */
    hostpathRegex: (hostname, pathnameRegex) => url => hostname === url.hostname && pathnameRegex.test(url.pathname),
    /**
     * @param {String | Set<String>} p
     * @returns {matchFunction}
     */
    hasSearchParam: p => url => {
        if (p instanceof Set) {
            for (const k of url.searchParams.keys()) {
                if (p.has(k)) return true;
            }
            return false;
        } else {
            return url.searchParams.has(p);
        }
    },
};