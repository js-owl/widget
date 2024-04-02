// Self invoking function
;(function (w, d, link, script, p) {
  // window.onload = function () {
  // ============= 1.widget iframe ==================

  const me = document.querySelector(
    'script[src*="https://v2.elis.uaz.ru/widgetbooking/widget-loader.js"]'
  )
  const param_id = me.src.split('?')[1]
  const id = param_id.split('=')[1].split('&')[0]
  const param_step = me.src.split('&')[1]
  const step = param_step.split('=')[1]
  const iframe = d.createElement('iframe')
  iframe.setAttribute('class', 'elis_iframe')

  iframe.src = `https://v2.elis.uaz.ru/widgetbooking/index.html?id=${id}&step=${step}`
  iframe.style = 'display: none;'

  const elis_widget_iframe = d.querySelector('#elis_widget_iframe')
  elis_widget_iframe.addEventListener('click', toggleOpen)

  console.log('widget-loader onload', elis_widget_iframe)

  function toggleOpen() {
    if (iframe.style.display == 'none') {
      iframe.style = 'display:block;'
      iframe.style = `position:fixed; top:0;right:0; height:100%; width:35%; border: none; background-color: transparent; box-shadow: 0px 0px 6px 0px grey; transition: all 0.5s; z-index:1000; `
      if (w.matchMedia('(min-width: 1600px)').matches) {
        iframe.style.width = '35%'
      } else if (w.matchMedia('(min-width: 1070px)').matches) {
        iframe.style.width = '50%'
      } else {
        iframe.style.width = '100%'
      }
    } else {
      iframe.style = 'display: none'
    }
  }

  d.getElementsByTagName('body')[0].appendChild(iframe)
  w.onmessage = function (event) {
    if (event.data == 'closeDrawer') {
      iframe.style = 'display: none'
    }
  }

  // ============= 2.widget mounted ==================
  // var css = 'https://v2.elis.uaz.ru/widgetbooking/assets/index.css'

  // var js = 'https://v2.elis.uaz.ru/widgetbooking/assets/index.js'

  // link = d.createElement('link')
  // link.rel = 'stylesheet'
  // link.href = css
  // // Appending stylesheet in the head tag
  // d.getElementsByTagName('head')[0].appendChild(link)

  // script = d.createElement('script')
  // script.async = 1
  // script.src = js
  // script.type = 'module'
  // // Adding the script in the script tag
  // p = d.getElementsByTagName('script')[0]
  // p.parentNode.insertBefore(script, p)
  // }
})(window, document)
