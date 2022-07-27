import cleanLink from './link-cleaner.js';
import index from './index-cfworker.min.html';

addEventListener('fetch', e => e.respondWith(
    (async (/** @type {Request} */ request) => {
        const requestURL = new URL(request.url);
        if (!requestURL.searchParams.has('url')) {
            return new Response(index, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
            });
        }

        try {
            const dirtyURL = new URL(requestURL.searchParams.get('url'));
            const cleanedURL = await cleanLink(dirtyURL);
            let responseText;
            if (requestURL.searchParams.has('title')) {
                const body = await fetch(cleanedURL).then(r => r.text());
                try {
                    responseText = body.match(/<title(?: .+?)?>(.+?)<\/title>/)[1].trim()
                    for (const [entity, decoded] of [
                        ['&#96;', '`'],
                        ['&#39;', '\''],
                        ['&amp;', '&'],
                        ['&gt;', '>'],
                        ['&lt;', '<'],
                        ['&nbsp;', ' '],
                        ['&quot;', '"'],
                        ['&yen;', '¥'],
                    ]) {
                        responseText = responseText.replaceAll(entity, decoded);
                    }
                    responseText += '\n' + cleanedURL;
                } catch (err) {
                    console.log(err);
                    responseText = '[Failed to extract title]\n' + cleanedURL;
                }
            } else {
                responseText = cleanedURL;
            }
            return new Response(responseText, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                },
            });
        } catch (err) {
            /** @type {Error} */
            const e = err;
            return new Response(`${e.name}: ${e.message}`, {
                status: 500,
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                },
            });
        }
    })(e.request)
));
