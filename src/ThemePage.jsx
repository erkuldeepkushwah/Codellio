import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

// The main navigation, rendered with react-router-dom <Link> so clicking a
// menu item changes the route client-side (no full page reload).
const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about-us', label: 'About us' },
  { to: '/services', label: 'Services' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

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

// Normalise a theme href ("/Codellio/about-us/") into a router path ("/about-us").
function toRouterPath(href) {
  if (!href) return null
  if (href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return null
  if (/^https?:\/\//i.test(href)) return null
  let p = href.split('#')[0]
  if (p.startsWith('/Codellio')) p = p.slice('/Codellio'.length)
  if (p === '') p = '/'
  if (!p.startsWith('/')) p = '/' + p
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p
}

// Rendered *inside* the theme's existing <ul id="menu-main-menu"> so the
// theme's menu styling keeps working, but the links are real <Link>s.
function NavItems() {
  return (
    <>
      {NAV.map((n) => (
        <li key={n.to} className="menu-item">
          <Link to={n.to}>
            <span>{n.label}</span>
          </Link>
        </li>
      ))}
    </>
  )
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

    // Mount the main menu as react-router <Link>s, reusing the theme's <ul>.
    const roots = []
    const mainUl = el.querySelector('#menu-main-menu')
    if (mainUl) {
      mainUl.innerHTML = ''
      const root = createRoot(mainUl)
      root.render(<NavItems />)
      roots.push(root)
    }

    // Fallback for every other internal link (buttons like "Read More"):
    // intercept the click and navigate through the router instead of reloading.
    const onClick = (event) => {
      const anchor = event.target.closest ? event.target.closest('a') : null
      if (!anchor) return
      if (anchor.target === '_blank') return
      const path = toRouterPath(anchor.getAttribute('href'))
      if (!path) return
      event.preventDefault()
      navigate(path)
    }

    el.addEventListener('click', onClick)
    return () => {
      el.removeEventListener('click', onClick)
      roots.forEach((r) => r.unmount())
    }
  }, [html, navigate])

  return <div ref={ref} />
}
