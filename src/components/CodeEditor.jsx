import { useState, useRef, useEffect } from 'react'
import { Code, Save, Type } from 'lucide-react'
import './CodeEditor.css'

function CodeEditor({ file, onEdit }) {
  const [content, setContent] = useState('')
  const [lineNumbers, setLineNumbers] = useState([])
  const textareaRef = useRef(null)
  const lineNumbersRef = useRef(null)

  useEffect(() => {
    if (file?.content !== undefined) {
      setContent(file.content)
    }
  }, [file?.content])

  useEffect(() => {
    const lines = content.split('\n')
    setLineNumbers(lines.map((_, index) => index + 1))
  }, [content])

  const handleContentChange = (newContent) => {
    setContent(newContent)
    if (file) {
      onEdit(newContent)
    }
  }

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const getFileLanguage = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'JavaScript'
      case 'ts':
      case 'tsx':
        return 'TypeScript'
      case 'css':
        return 'CSS'
      case 'html':
        return 'HTML'
      case 'md':
        return 'Markdown'
      case 'json':
        return 'JSON'
      case 'py':
        return 'Python'
      default:
        return 'Text'
    }
  }

  if (!file) {
    return (
      <div className="code-editor">
        <div className="code-editor-header">
          <div className="code-editor-title">
            <Code size={16} />
            Editor
          </div>
        </div>
        <div className="editor-empty-state">
          <Type size={48} />
          <h3>No file selected</h3>
          <p>Select a file from the file explorer or create a new one using the terminal</p>
          <div className="editor-commands">
            <code>create filename.js</code>
            <code>open filename.js</code>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="code-editor">
      <div className="code-editor-header">
        <div className="code-editor-title">
          <Code size={16} />
          <span className="file-name">{file.name}</span>
          <span className="file-language">{getFileLanguage(file.name)}</span>
        </div>
        <div className="editor-actions">
          <button className="editor-action" title="Save file">
            <Save size={16} />
            Saved
          </button>
        </div>
      </div>
      
      <div className="editor-content">
        <div className="line-numbers" ref={lineNumbersRef}>
          {lineNumbers.map((lineNumber) => (
            <div key={lineNumber} className="line-number">
              {lineNumber}
            </div>
          ))}
        </div>
        
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onScroll={handleScroll}
          placeholder="Start typing your code..."
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export default CodeEditor