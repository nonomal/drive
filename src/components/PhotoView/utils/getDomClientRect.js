export default function getDomClientRect(dom) {
    if (!dom) return Error(`${dom} is not DOM`)
    return dom.getBoundingClientRect()
}