function loadProgress(sectionId, questions) {
  try {
    const stored = JSON.parse(localStorage.getItem(`sceniaquiz_section_${sectionId}`))
    if (!stored) return null
    if (stored.phase === 'result') {
      const score = stored.answers.reduce(
        (acc, ans, i) => acc + (ans === questions[i]?.correctIndex ? 1 : 0), 0
      )
      return { status: 'done', score, total: questions.length }
    }
    return { status: 'inprogress', answered: stored.answers.length, total: questions.length }
  } catch {
    return null
  }
}

export default function Home({ sections, onSelect }) {
  return (
    <div className="screen screen-top">
      <div className="home-wrap">
        <p className="home-intro">Vælg et afsnit for at starte</p>
        <div className="section-list">
          {sections.map(section => {
            const progress = loadProgress(section.id, section.questions)
            return (
              <button
                key={section.id}
                className="section-card"
                onClick={() => onSelect(section.id)}
              >
                <div className="section-card-top">
                  <span className="label" style={{ margin: 0 }}>Afsnit {section.id}</span>
                  {progress && (
                    <span className={`section-badge ${progress.status}`}>
                      {progress.status === 'done'
                        ? `${progress.score} / ${progress.total}`
                        : `${progress.answered} / ${progress.total}`}
                    </span>
                  )}
                </div>
                <p className="section-title">{section.title}</p>
                <p className="section-meta">
                  {section.questions.length} spørgsmål
                  {progress?.status === 'inprogress' && ' · I gang'}
                  {progress?.status === 'done' && ' · Gennemført'}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
