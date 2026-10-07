import { Routes, Route, Navigate } from 'react-router-dom'
import ThemePage from './ThemePage.jsx'

import homeHtml from './content/bodies/home.html?raw'
import aboutHtml from './content/bodies/about.html?raw'
import servicesHtml from './content/bodies/services.html?raw'
import faqHtml from './content/bodies/faq.html?raw'
import contactHtml from './content/bodies/contact.html?raw'

import titles from './content/titles.json'
import bodyClass from './content/bodyclass.json'
import pageCss from './content/pagecss.json'

const pages = [
  { path: '/', key: 'home', html: homeHtml },
  { path: '/about-us', key: 'about', html: aboutHtml },
  { path: '/services', key: 'services', html: servicesHtml },
  { path: '/faq', key: 'faq', html: faqHtml },
  { path: '/contact', key: 'contact', html: contactHtml },
]

export default function App() {
  return (
    <Routes>
      {pages.map((p) => (
        <Route
          key={p.key}
          path={p.path}
          element={
            <ThemePage
              html={p.html}
              title={titles[p.key]}
              bodyClass={bodyClass[p.key]}
              pageCss={pageCss[p.key]}
            />
          }
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
