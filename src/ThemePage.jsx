import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Scripts that arrive via innerHTML never execute. Re-create each <script>
// node so the theme's JS runs. async=false keeps them in source order, which
// matters because the theme's scripts depend on jQuery being loaded first.
function runScripts(container) {
  const scripts = Array.from(container.querySelectorAll('script'))
  for (const old of scripts) {
    const s = document.createElement('script')
    for (const attr of Array.from(old.attributes)) {
      s.setAttribute(attr.name, attr.value)
    }
    s.async = false
    if (old.src) {
      s.src = old.src
    } else {
      s.text = old.textContent
    }
    old.parentNode.replaceChild(s, old)
  }
}

export default function ThemePage({ html, title, bodyClass, pageCss }) {
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (title) document.title = title
    if (bodyClass != null) document.body.className = bodyClass
  }, [title, bodyClass])

  // The Betheme theme ships one extra stylesheet per page (post-N.css).
  useEffect(() => {
    if (!pageCss) return
    let link = document.getElementById('mfn-page-css')
    if (!link) {
      link = document.createElement('link')
      link.id = 'mfn-page-css'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = pageCss
  }, [pageCss])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.innerHTML = html
    runScripts(el)

    // Turn internal links into client-side navigation instead of full reloads.
    const onClick = (event) => {
      const anchor = event.target.closest ? event.target.closest('a') : null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || anchor.target === '_blank') return
      if (!href.startsWith('/')) return

      let path = href
      if (path.startsWith('/Codellio')) path = path.slice('/Codellio'.length)
      if (path === '') path = '/'
      if (!path.startsWith('/')) path = '/' + path

      event.preventDefault()
      navigate(path)
    }

    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [html, navigate])

  return <div ref={ref} />
}
