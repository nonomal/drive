function download_file(download_url, fileName) {
    const link = document.createElement('a')
    link.href = download_url
    link.download = fileName
    link.click()
    link.remove()
}
module.exports = download_file