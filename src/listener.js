let tid
export default updateRootFontSize => {
    const callback = () => {
        clearTimeout(tid)
        tid = setTimeout(updateRootFontSize, 300)
    }

    window.addEventListener('resize', callback, false)
    window.addEventListener(
        'pageshow',
        e => {
            e.persisted && callback()
        },
        false
    )
}
