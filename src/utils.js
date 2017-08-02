export function getDpr(scale) {
    let dpr

    // 是否有默认值
    if (scale) {
        dpr = parseInt(1 / scale, 10)
    } else {
        dpr = window.devicePixelRatio
    }

    if (window.navigator.appVersion.match(/iphone/gi)) {
        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
        if (dpr >= 3) {
            return 3
        } else if (dpr >= 2) {
            return 2
        }
    }
    // 其他设备下，仍旧使用1倍的方案
    return 1
}

export function getRootFontSize(pageWidth, dpr) {
    if (pageWidth / dpr > 540) {
        pageWidth = 540 * dpr
    }
    return `${pageWidth / 10}px`
}

export function getBodyFontSize(dpr) {
    return `${12 * dpr}px`
}
