export function isObject(data) {
    return Object.prototype.toString.call(data) == '[object Object]'
}