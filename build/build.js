const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const uglify = require('uglify-js')
const buble = require('rollup-plugin-buble')

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist')
}

const builds = [
    {
        entry: path.resolve(__dirname, '../src/index.js'),
        dest: path.resolve(__dirname, '../dist/main.js'),
        format: 'iife',
        moduleName: '',
        plugins: [buble()]
    },
    {
        entry: path.resolve(__dirname, '../src/index.js'),
        dest: path.resolve(__dirname, '../dist/main.min.js'),
        format: 'iife',
        moduleName: '',
        plugins: [buble()]
    }
]

function blue(str) {
    return `\x1b[1m\x1b[34m${str}\x1b[39m\x1b[22m`
}

function getSize(code) {
    return `${(code.length / 1024).toFixed(2)}kb`
}

function write(dest, code) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dest, code, err => {
            if (err) return reject(err)
            console.log(
                `${blue(path.relative(process.cwd(), dest))} ${getSize(code)}`
            )
            return resolve()
        })
    })
}

function buildEntry(config) {
    const isProd = /min\.js$/.test(config.dest)
    return rollup.rollup(config).then(bundle => {
        const code = bundle.generate(config).code
        if (isProd) {
            const minified = uglify.minify(code, {
                fromString: true,
                output: {
                    screw_ie8: true,
                    ascii_only: true
                },
                compress: {
                    pure_funcs: ['makeMap']
                }
            }).code
            return write(config.dest, minified)
        }
        return write(config.dest, code)
    })
}

function build(options) {
    let built = 0
    const total = options.length
    const next = () => {
        buildEntry(options[built])
            .then(() => {
                built += 1
                if (built < total) {
                    next()
                }
            })
            .catch(e => {
                console.log(e)
            })
    }
    next()
}

build(builds)
