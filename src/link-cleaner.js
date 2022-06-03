import cleanRules from './clean-rules.js'

/**
 * @param {URL | String} url
 * @param {Boolean} [verbose]
 * @returns {Promise<URL>}
 */
export default async (url, verbose = false) => {
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
