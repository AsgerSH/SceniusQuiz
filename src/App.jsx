import { useMemo, useState, useEffect } from 'react'
import quizText from './quiz.md?raw'
import Home from './components/Home'
import Quiz from './components/Quiz'

function parseMarkdown(text) {
  const sections = []
  const lines = text.split('\n')
  let current = null

  for (const line of lines) {
    const sectionMatch = line.match(/^## (\d+)\) (.+)$/)
    if (sectionMatch) {
      current = { id: parseInt(sectionMatch[1]), title: sectionMatch[2], questions: [] }
      sections.push(current)
      continue
    }

    const qMatch = line.match(/^\*\*#\d+ - (.+?)\*\*$/)
    if (qMatch && current) {
      current.questions.push({ text: qMatch[1], answers: [], correctIndex: -1 })
      continue
    }

    if (current?.questions.length > 0) {
      const q = current.questions[current.questions.length - 1]
      const aMatch = line.match(/^- \[([ x])\] (.+)$/)
      if (aMatch) {
        if (aMatch[1] === 'x') q.correctIndex = q.answers.length
        q.answers.push(aMatch[2])
      }
    }
  }
  return sections
}

export default function App() {
  const sections = useMemo(() => parseMarkdown(quizText), [])

  const [activeId, setActiveId] = useState(() => {
    const stored = localStorage.getItem('sceniaquiz_active')
    return stored !== null ? parseInt(stored) : null
  })

  useEffect(() => {
    if (activeId !== null) localStorage.setItem('sceniaquiz_active', activeId)
    else localStorage.removeItem('sceniaquiz_active')
  }, [activeId])

  const activeSection = activeId !== null ? sections.find(s => s.id === activeId) : null

  return (
    <div className="app">
      <header className="site-header">
        <span
          className="site-title"
          style={activeSection ? { cursor: 'pointer' } : {}}
          onClick={() => activeSection && setActiveId(null)}
        >
          Scenia
        </span>
        <span className="site-subtitle">Meditations quizzen</span>
      </header>
      {activeSection
        ? <Quiz section={activeSection} onHome={() => setActiveId(null)} />
        : <Home sections={sections} onSelect={id => setActiveId(id)} />
      }
    </div>
  )
}
