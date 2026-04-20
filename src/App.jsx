import { useMemo } from 'react'
import quizText from './quiz.md?raw'
import Quiz from './components/Quiz'

function parseMarkdown(text) {
  const questions = []
  const lines = text.split('\n')
  let currentSection = ''
  let currentQuestion = null

  for (const line of lines) {
    const sectionMatch = line.match(/^## \d+\) (.+)$/)
    if (sectionMatch) {
      currentSection = sectionMatch[1]
      continue
    }

    const qMatch = line.match(/^\*\*#\d+ - (.+?)\*\*$/)
    if (qMatch) {
      if (currentQuestion) questions.push(currentQuestion)
      currentQuestion = { section: currentSection, text: qMatch[1], answers: [], correctIndex: -1 }
      continue
    }

    if (currentQuestion) {
      const aMatch = line.match(/^- \[([ x])\] (.+)$/)
      if (aMatch) {
        if (aMatch[1] === 'x') currentQuestion.correctIndex = currentQuestion.answers.length
        currentQuestion.answers.push(aMatch[2])
      }
    }
  }
  if (currentQuestion) questions.push(currentQuestion)
  return questions
}

export default function App() {
  const questions = useMemo(() => parseMarkdown(quizText), [])
  return <Quiz questions={questions} />
}
