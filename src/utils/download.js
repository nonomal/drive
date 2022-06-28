function download_file(download_url, fileName) {
    const link = document.createElement('a')
    link.href = download_url
    link.download = fileName || Date.now()
    link.click()
    link.remove()
}
export default download_file