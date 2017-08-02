import listener from './listener'
import { getDpr, getRootFontSize, getBodyFontSize } from './utils'

let dpr = 0 // devicePixelRatio
const docEl = document.documentElement

const updateRootFontSize = () => {
    const width = docEl.getBoundingClientRect().width
    docEl.style.fontSize = getRootFontSize(width, dpr)
}

// 计算 dpr
const metaEl = document.querySelector('meta[name="viewport"]')
if (metaEl) {
    const match = metaEl.getAttribute('content').match(/initial-scale=([\d.]+)/)
    dpr = getDpr(match && parseFloat(match[1]))
} else {
    dpr = getDpr()

    // 创建新的 meta 标签并设置 viewport 属性
    const scale = 1 / dpr
    const el = document.createElement('meta')
    el.setAttribute('name', 'viewport')
    el.setAttribute(
        'content',
        `initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale},user-scalable=no`
    )
    if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(el)
    } else {
        const wrap = document.createElement('div')
        wrap.appendChild(el)
        document.write(wrap.innerHTML)
    }
}

// 给 body 设置 font-size
if (document.readyState === 'complete') {
    document.body.style.fontSize = getBodyFontSize(dpr)
} else {
    document.addEventListener(
        'DOMContentLoaded',
        () => {
            document.body.style.fontSize = getBodyFontSize(dpr)
        },
        false
    )
}

// 给 html 添加 data-dpr 属性
docEl.setAttribute('data-dpr', dpr)

// 监听页面变化 resize pageshow
listener(updateRootFontSize)

// 初始化 html 字体
updateRootFontSize()
