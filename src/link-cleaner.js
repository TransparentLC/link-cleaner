import cleanRules from './clean-rules.js';

/**
 * @param {URL | String} url
 * @param {Boolean} [verbose]
 * @returns {Promise<URL>}
 */
export const cleanLink = async (url, verbose = false) => {
    let urlProcess = new URL(url);
    /** @type {import('./clean-rules.js').cleanRule} */
    let rule;
    while (rule = cleanRules.find(e => e.match(urlProcess))) {
        const urlBefore = urlProcess.toString();
        urlProcess = (await rule.clean(urlProcess)) || urlProcess;
        if (verbose) console.log(urlProcess.toString(), `(Clean rule: ${rule.name})`);
        if (urlBefore === urlProcess.toString()) break;
    }
    return urlProcess;
};

/**
 * @param {URL | String} url
 * @returns {Promise<String>}
 */
export const getTitle = async url => {
    const body = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
        },
    }).then(r => {
        if (r.status >= 400) throw new Error(`${r.status} ${r.statusText}`);
        return r.text();
    });
    let title = body.match(/<title(?: .+?)?>(.+?)<\/title>/)[1].trim()
    for (const [entity, decoded] of [
        ['&amp;', '&'],
        ['&gt;', '>'],
        ['&lt;', '<'],
        ['&nbsp;', ' '],
        ['&quot;', '"'],
        ['&yen;', '¥'],
    ]) {
        title = title.replaceAll(entity, decoded);
    }
    title = title.replace(/&#(\d+);/g, (_, m) => String.fromCharCode(parseInt(m)));
    title = title.replace(/&#x([\da-f]+);/g, (_, m) => String.fromCharCode(parseInt(m, 16)));
    return title;
};

export default cleanLink;
