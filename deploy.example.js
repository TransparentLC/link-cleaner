import childProcess from 'child_process';
import fs from 'fs';

const CF_ACCOUNT_ID = '0123456789abcdef0123456789abcdef';
const CF_API_TOKEN = 'Y0uR_$3cR3t_4P1t0k3N';

const SSH_HOST = 'root@127.0.0.1';
const SSH_PORT = 22;
const SSH_DEPLOY_PATH = '/path/to/link-cleaner.user.js';

await Promise.all([
    fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/workers/scripts/link-cleaner`,
        {
            method: 'PUT',
            body: fs.readFileSync('dist/link-cleaner.cfworker.js', { encoding: 'utf-8' }),
            headers: {
                'Content-Type': 'application/javascript',
                'Authorization': `Bearer ${CF_API_TOKEN}`,
            },
        },
    ).then(r => r.json()).then(r => {
        r.result.script = null;
        console.log(r);
    }),
    childProcess.spawn(
        'scp',
        [
            '-P', SSH_PORT,
            'dist/link-cleaner.user.js',
            `${SSH_HOST}:${SSH_DEPLOY_PATH}`,
        ],
        {
            stdio: 'inherit',
        },
    ),
]);
