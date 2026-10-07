const fs = require('node:fs/promises')
const { existsSync } = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')

const run = promisify(execFile)

function compilerPath() {
    if (process.env.TECTONIC_PATH) return process.env.TECTONIC_PATH
    const bundled = path.join(__dirname, '../../tools/tectonic', process.platform === 'win32' ? 'tectonic.exe' : 'tectonic')
    return existsSync(bundled) ? bundled : 'tectonic'
}

async function compileResumePdf(latex) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'interview-resume-'))
    try {
        const source = path.join(directory, 'resume.tex')
        await fs.writeFile(source, latex, 'utf8')
        await run(compilerPath(), ['-X', 'compile', '--untrusted', '--outdir', directory, source], {
            cwd: directory,
            timeout: 120000,
            maxBuffer: 2 * 1024 * 1024,
            windowsHide: true
        })
        const pdf = await fs.readFile(path.join(directory, 'resume.pdf'))
        if (pdf.subarray(0, 5).toString() !== '%PDF-') throw new Error('Compiler did not produce a PDF')
        return pdf
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('LaTeX compiler unavailable. Install Tectonic or set TECTONIC_PATH.')
        }
        throw error
    } finally {
        // Only remove the unique temporary directory created for this request.
        await fs.rm(directory, { recursive: true, force: true })
    }
}

module.exports = { compileResumePdf }
