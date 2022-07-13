import esbuild from 'esbuild';

esbuild.buildSync({
    entryPoints: ['src/entry-cfworker.js'],
    outfile: 'dist/link-cleaner.cfworker.js',
    charset: 'utf8',
    bundle: true,
    minify: true,
    define: {
        'globalThis.ENV': '"cfworker"',
    },
    loader: {
        '.html': 'text',
    },
});