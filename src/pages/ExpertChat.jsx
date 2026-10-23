import { useState } from 'react'
import ChatBox from '../components/ChatBox.jsx'
import { sendExpertMessage } from '../services/api.js'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hello! I'm your plant health expert assistant. Ask me about symptoms you're seeing, treatment options, or how to prevent disease from spreading.",
}

export default function ExpertChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [isSending, setIsSending] = useState(false)

  async function handleSend(text) {
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setIsSending(true)
    try {
      const reply = await sendExpertMessage(text, nextMessages)
      setMessages((prev) => [...prev, reply])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I couldn't reach the expert service. Please try again in a moment." },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Expert Chat</h1>
        <p className="page__subtitle">Get guidance for plant disease interpretation, treatment, and prevention.</p>
      </div>

      <ChatBox messages={messages} onSend={handleSend} isSending={isSending} />
    </div>
  )
}
