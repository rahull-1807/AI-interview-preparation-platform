export async function validatePdfBlob(blob) {
    if (!blob.size) throw new Error('The server returned an empty PDF. Please download again.')
    const header = await blob.slice(0, 5).text()
    const trailer = await blob.slice(-1024).text()
    if (header !== '%PDF-' || !trailer.includes('%%EOF')) {
        throw new Error('The PDF download was incomplete or invalid. Please try again.')
    }
}

export function savePdfBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.hidden = true
    document.body.appendChild(link)
    try {
        link.click()
    } catch (error) {
        URL.revokeObjectURL(url)
        throw error
    } finally {
        link.remove()
    }
    // There is no browser event for completion of an anchor download. A timeout
    // can revoke the PDF while Save As is still open, leaving an empty file.
    // Keep it alive for this document's lifetime; the browser releases it on unload.
}
