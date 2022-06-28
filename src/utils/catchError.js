export default function catchError(promise) {
    return new Promise(resolve => {
        promise.then(data => {
            resolve([undefined, data])
        }).catch(err => {
            resolve([err, undefined])
        })
    })
}