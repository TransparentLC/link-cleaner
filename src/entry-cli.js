import readline from 'node:readline/promises';
import { cleanLink, getTitle } from './link-cleaner.js';

const args = process.argv.slice(2);
const useTitle = args.includes('--title');
if (useTitle) {
    args.splice(args.indexOf('--title'), 1);
}
if (args.includes('-')) {
    args.length = 0;
    const rl = readline.createInterface({ input: process.stdin });
    for await (const line of rl) {
        args.push(line);
    }
}
if (!args.length) {
    console.log(`Usage: ${process.argv[0]} ${process.argv[1]} [--title] [link] ...\nUse "-" to read links from stdin.`);
    process.exit(1);
}
console.log(
    (await Promise.all(
        args.map(async url => {
            url = await cleanLink(url);
            let title = null;
            if (useTitle) {
                try {
                    title = await getTitle(url);
                } catch (err) {}
            }
            return { url, title };
        })
    ))
        .map(e => useTitle ? ((e.title || '[Failed to extract title]') + '\n' + e.url) : e.url.toString())
        .join('\n')
);
