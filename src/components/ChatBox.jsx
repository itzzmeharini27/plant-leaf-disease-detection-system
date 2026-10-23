import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'

export default function ChatBox({ messages, onSend, isSending }) {
  const [draft, setDraft] = useState('')
  const logRef = useRef(null)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages, isSending])

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed || isSending) return
    onSend(trimmed)
    setDraft('')
  }

  return (
    <div className="chat-panel">
      <div className="chat-log" ref={logRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble chat-bubble--${message.role === 'user' ? 'user' : 'assistant'}`}>
            <span className="chat-bubble__label">{message.role === 'user' ? 'You' : 'AI Expert'}</span>
            {message.content}
          </div>
        ))}
        {isSending && (
          <div className="chat-typing" aria-label="AI Expert is typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
      <form className="chat-composer" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask about your plant..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          aria-label="Message the expert AI assistant"
        />
        <button type="submit" className="btn btn--primary" aria-label="Send message" disabled={isSending}>
          <Send size={17} />
        </button>
      </form>
    </div>
  )
}
