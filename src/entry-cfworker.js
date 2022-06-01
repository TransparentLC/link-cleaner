import cleanLink from './link-cleaner.js';

addEventListener('fetch', e => e.respondWith(
    (async (/** @type {Request} */ request) => {
        const requestURL = new URL(request.url);
        if (!requestURL.searchParams.has('url')) {
            const endpoint = `${requestURL.protocol}//${requestURL.host}${requestURL.pathname}`;
            return new Response(`Usage:\n  Without title:\n    ${endpoint}?url=...\n  With title:\n    ${endpoint}?title&url=...`, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
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
                    responseText = body.match(/<title(?: .+?)>(.+?)<\/title>/)[1].trim() + '\n' + cleanedURL;
                } catch (err) {
                    console.log(err);
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
