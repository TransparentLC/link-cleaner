import cleanRules from './clean-rules.js'

/**
 * @param {URL | String} url
 * @returns {Promise<URL>}
 */
export default async url => {
    let urlProcess = new URL(url);
    /** @type {import('./clean-rules.js').cleanRule} */
    let rule;
    while (rule = cleanRules.find(e => e.match(urlProcess))) {
        const urlBefore = urlProcess.toString();
        urlProcess = (await rule.clean(urlProcess)) || urlProcess;
        if (urlBefore === urlProcess.toString()) break;
    }
    return urlProcess;
};
