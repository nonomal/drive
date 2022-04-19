function download_file(file,name){
    let blob = new Blob([file])
    let fileName = name
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a') 
    link.href = url
    link.download = fileName
    link.click()
}
module.exports = download_file