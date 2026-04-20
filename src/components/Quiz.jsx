import { useState } from 'react'

export default function Quiz({ questions }) {
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])

  const current = questions[index]
  const displaySelected = selected !== null ? selected : answers[index] ?? null

  function start() {
    setPhase('quiz')
    setIndex(0)
    setSelected(null)
    setAnswers([])
  }

  function handleAnswer(i) {
    if (selected !== null) return
    setSelected(i)
    setAnswers(a => { const next = [...a]; next[index] = i; return next })

    setTimeout(() => {
      setSelected(null)
      if (index + 1 >= questions.length) {
        setPhase('result')
      } else {
        setIndex(v => v + 1)
      }
    }, 500)
  }

  function goBack() {
    if (index === 0 || selected !== null) return
    setIndex(v => v - 1)
  }

  function restart() {
    setPhase('intro')
    setIndex(0)
    setSelected(null)
    setAnswers([])
  }

  const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].correctIndex ? 1 : 0), 0)
  const pct = Math.round((score / questions.length) * 100)

  return (
    <div className="app">
      <header className="site-header">
        <span className="site-title">Scenia</span>
      </header>

      {phase === 'intro' && (
        <div className="screen">
          <div className="card">
            <span className="label">Meditationsquiz</span>
            <h1>Hvad ved du om meditation?</h1>
            <p className="subtitle">
              {questions.length} spørgsmål · Vælg det svar, der føles rigtigt
            </p>
            <button className="btn" onClick={start}>Start quiz</button>
          </div>
        </div>
      )}

      {phase === 'quiz' && (
        <div className="screen">
          <div key={index} className="card quiz-card">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(index / questions.length) * 100}%` }}
              />
            </div>
            <div className="question-meta">
              <span className="label" style={{ margin: 0 }}>{current.section}</span>
              <span className="q-count">{index + 1} / {questions.length}</span>
            </div>
            <h2 className="question-text">{current.text}</h2>
            <div className="answers">
              {current.answers.map((answer, i) => (
                <button
                  key={i}
                  className={`answer-btn${displaySelected === i ? ' selected' : ''}`}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                >
                  {answer}
                </button>
              ))}
            </div>
            {index > 0 && (
              <button
                className="back-btn"
                onClick={goBack}
                disabled={selected !== null}
              >
                ← Forrige spørgsmål
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="screen">
          <div className="card result-card">
            <span className="label">Resultat</span>
            <div className="score-display">
              <span className="score-number">{score}</span>
              <span className="score-denom">&nbsp;/ {questions.length}</span>
            </div>
            <p className="score-pct">{pct}% korrekte svar</p>
            <p className="result-msg">{resultMessage(pct)}</p>
            <div className="result-actions">
              <button className="btn btn-ghost" onClick={() => setPhase('details')}>Detaljer</button>
              <button className="btn" onClick={restart}>Prøv igen</button>
            </div>
          </div>
        </div>
      )}

      {phase === 'details' && (
        <div className="screen screen-top">
          <div className="card details-card">
            <div className="details-header">
              <span className="label" style={{ margin: 0 }}>Gennemgang</span>
              <button className="btn-link" onClick={() => setPhase('result')}>Tilbage</button>
            </div>
            <div className="details-list">
              {questions.map((q, qi) => {
                const userAnswer = answers[qi]
                const correct = q.correctIndex
                const wasCorrect = userAnswer === correct
                return (
                  <div key={qi} className={`detail-item${wasCorrect ? ' detail-correct' : ' detail-wrong'}`}>
                    <p className="detail-section">{q.section}</p>
                    <p className="detail-question">{q.text}</p>
                    <div className="detail-answers">
                      {q.answers.map((ans, ai) => {
                        const isCorrect = ai === correct
                        const isUserWrong = ai === userAnswer && !wasCorrect
                        return (
                          <div
                            key={ai}
                            className={`detail-answer${isCorrect ? ' is-correct' : ''}${isUserWrong ? ' is-wrong' : ''}`}
                          >
                            {ans}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ textAlign: 'center', paddingTop: '1.5rem' }}>
              <button className="btn" onClick={restart}>Prøv igen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function resultMessage(pct) {
  if (pct >= 90) return 'Fremragende! Du har en dyb forståelse for meditation.'
  if (pct >= 70) return 'Godt gået! Du er godt på vej i din forståelse.'
  if (pct >= 50) return 'En god start. Der er altid mere at opdage.'
  return 'Meditation er en livslang rejse. Bliv ved med at udforske.'
}
