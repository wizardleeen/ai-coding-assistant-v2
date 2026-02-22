import { useState, useEffect, useRef } from 'react'
import { Send, User, Bot, Monitor } from 'lucide-react'
import './Terminal.css'

function Terminal({ messages, onCommand }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onCommand(input.trim())
      setInput('')
    }
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case 'user':
        return <User size={16} />
      case 'ai':
        return <Bot size={16} />
      default:
        return <Monitor size={16} />
    }
  }

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-title">
          <Monitor size={16} />
          Terminal
        </div>
      </div>
      
      <div className="terminal-content">
        <div className="terminal-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message message-${message.type}`}>
              <div className="message-header">
                <div className="message-icon">
                  {getMessageIcon(message.type)}
                </div>
                <span className="message-timestamp">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">
                <pre>{message.content}</pre>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="terminal-input-form">
          <div className="terminal-input-container">
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="terminal-input"
              placeholder="Type a command..."
              autoComplete="off"
            />
            <button type="submit" className="terminal-submit">
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Terminal