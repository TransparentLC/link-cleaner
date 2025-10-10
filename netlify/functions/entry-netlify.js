import { cleanLink, getTitle } from '../../src/link-cleaner.js';

export const handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers,
            body: '',
        };
    }

    try {
        switch (event.httpMethod) {
            case 'GET':
                const queryParams = event.queryStringParameters || {};
                
                if (!queryParams.url) {
                    return {
                        statusCode: 400,
                        headers: {
                            ...headers,
                            'Content-Type': 'text/plain; charset=utf-8',
                        },
                        body: 'Missing url parameter',
                    };
                }

                try {
                    const dirtyURL = new URL(queryParams.url);
                    const cleanedURL = await cleanLink(dirtyURL);
                    let responseText;
                    
                    if (queryParams.hasOwnProperty('title')) {
                        try {
                            responseText = await getTitle(cleanedURL);
                        } catch (err) {
                            console.log(err);
                            responseText = `[Failed to extract title: ${err}]`;
                        }
                        responseText += '\n' + cleanedURL;
                    } else {
                        responseText = cleanedURL.toString();
                    }
                    
                    return {
                        statusCode: 200,
                        headers: {
                            ...headers,
                            'Content-Type': 'text/plain; charset=utf-8',
                        },
                        body: responseText,
                    };
                } catch (err) {
                    return {
                        statusCode: 500,
                        headers: {
                            ...headers,
                            'Content-Type': 'text/plain; charset=utf-8',
                        },
                        body: `${err.name}: ${err.message}`,
                    };
                }

            case 'POST':
                const body = event.body;
                if (!body) {
                    return {
                        statusCode: 400,
                        headers,
                        body: 'Empty request body',
                    };
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

                return {
                    statusCode: 200,
                    headers: {
                        ...headers,
                        'Content-Type': 'text/plain; charset=utf-8',
                    },
                    body: Array.from(replaceMap.entries()).reduce((pre, [k, v]) => pre.replaceAll(k, v), body),
                };

            default:
                return {
                    statusCode: 405,
                    headers,
                    body: 'Method Not Allowed',
                };
        }
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers: {
                ...headers,
                'Content-Type': 'text/plain; charset=utf-8',
            },
            body: `Internal Server Error: ${error.message}`,
        };
    }
};