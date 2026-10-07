import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generateResumePdf } from '../src/features/interview/services/interview.api.js'
import { savePdfBlob } from '../src/features/interview/services/pdf-download.js'

const pdf = '%PDF-1.7\nTest PDF bytes\n%%EOF\n'

test('both PDF variants preserve the response bytes', async t => {
    const requests = []
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        requests.push({ url, options })
        return new Response(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Length': String(pdf.length) } })
    })
    for (const highlighted of [false, true]) {
        const blob = await generateResumePdf('report', highlighted)
        assert.equal(await blob.text(), pdf)
    }
    assert.match(requests[0].url, /highlighted=false$/)
    assert.match(requests[1].url, /highlighted=true$/)
    assert.equal(requests[0].options.method, 'POST')
})

test('rejects empty, HTML, truncated, and mismatched-length responses instead of saving PDFs', async t => {
    const responses = [
        new Response('', { headers: { 'Content-Type': 'application/pdf' } }),
        new Response('<html>Login</html>', { headers: { 'Content-Type': 'text/html' } }),
        new Response('%PDF-1.7\ntruncated', { headers: { 'Content-Type': 'application/pdf' } }),
        new Response(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Length': '9999' } }),
        new Response(JSON.stringify({ message: 'Please log in again.' }), { status: 401 }),
    ]
    t.mock.method(globalThis, 'fetch', async () => responses.shift())
    for (const message of [/empty PDF/, /did not return a PDF/, /incomplete or invalid/, /interrupted/, /Please log in again/]) {
        await assert.rejects(generateResumePdf('report'), message)
    }
})

test('a pending Save As retains readable PDF bytes beyond the previous 60-second expiry', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] })
    let downloadUrl
    let filename
    const originalDocument = globalThis.document
    globalThis.document = {
        body: { appendChild() {} },
        createElement: () => ({
            click() { downloadUrl = this.href; filename = this.download },
            remove() {},
        }),
    }
    t.after(() => {
        if (originalDocument === undefined) delete globalThis.document
        else globalThis.document = originalDocument
        if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    })
    savePdfBlob(new Blob([pdf], { type: 'application/pdf' }), 'resume.pdf')
    t.mock.timers.tick(10 * 60 * 1000)
    assert.equal(filename, 'resume.pdf')
    assert.equal(await (await fetch(downloadUrl)).text(), pdf)
})
