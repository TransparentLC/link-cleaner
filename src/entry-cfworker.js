import { cleanLink, getTitle } from './link-cleaner.js';
import index from './index-cfworker.min.html';

addEventListener('fetch', e => e.respondWith(
    (async (/** @type {Request} */ request) => {
        switch (request.method) {
            case 'GET':
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
                        try {
                            responseText = await getTitle(cleanedURL);
                        } catch (err) {
                            console.log(err);
                            responseText = '[Failed to extract title]';
                        }
                        responseText += '\n' + cleanedURL;
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
            case 'POST':
                const body = await request.text();
                if (!body) {
                    return new Response(null, {
                        status: 400,
                    });
                }
                const replaceMap = new Map(
                    Array.from(
                        body.matchAll(
                            // regex - Regular expression to find URLs within a string - Stack Overflow
                            // https://stackoverflow.com/questions/6038061#answer-29288898
                            /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm
                        )
                    ).map(e => [e[0], null])
                );
                await Promise.all(
                    Array
                        .from(replaceMap.keys())
                        .map(async e => replaceMap.set(e, await cleanLink(e)))
                );
                return new Response(
                    Array.from(replaceMap.entries()).reduce((pre, [k, v]) => pre.replaceAll(k, v), body),
                    {
                        headers: {
                            'Content-Type': 'text/plain; charset=utf-8',
                        },
                    },
                );
            case 'OPTION':
                return new Response(null, {
                    status: 204,
                    headers: {
                        'Access-Control-Allow-Origin': request.headers.get('Origin'),
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Max-Age': 86400,
                    },
                });
            default:
                return new Response(null, {
                    status: 405,
                });
            }
    })(e.request)
));
