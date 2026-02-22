import { useState } from 'react'
import Terminal from './components/Terminal'
import FileExplorer from './components/FileExplorer'
import CodeEditor from './components/CodeEditor'
import { Terminal as TerminalIcon, Folder, Code, Bot } from 'lucide-react'
import './App.css'

function App() {
  const [activePanel, setActivePanel] = useState('terminal')
  const [files, setFiles] = useState([
    {
      id: '1',
      name: 'example.js',
      type: 'file',
      content: '// Welcome to AI Code Assistant\n// Type "help" in terminal to see available commands\n\nconsole.log("Hello, World!");',
    },
    {
      id: '2',
      name: 'README.md',
      type: 'file',
      content: '# AI Code Assistant\n\nA CLI-style coding environment with AI assistance.\n\n## Commands:\n- `help` - Show available commands\n- `create <filename>` - Create a new file\n- `open <filename>` - Open a file in editor\n- `list` - List all files\n- `ai <question>` - Ask AI for coding help\n- `clear` - Clear terminal',
    },
  ])
  const [currentFile, setCurrentFile] = useState(files[0])
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'system',
      content: 'AI Code Assistant v1.0.0 initialized.\nType "help" for available commands.',
      timestamp: new Date(),
    },
  ])

  const handleCommand = (command) => {
    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: `$ ${command}`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])

    const [cmd, ...args] = command.trim().split(' ')
    const arg = args.join(' ')

    switch (cmd.toLowerCase()) {
      case 'help':
        addSystemMessage(
          'Available commands:\n' +
          '  help                 - Show this help message\n' +
          '  create <filename>    - Create a new file\n' +
          '  open <filename>      - Open a file in editor\n' +
          '  list                 - List all files\n' +
          '  ai <question>        - Ask AI for coding help\n' +
          '  run <filename>       - Simulate running a file\n' +
          '  delete <filename>    - Delete a file\n' +
          '  clear                - Clear terminal'
        )
        break

      case 'list':
        const fileList = files.map(f => `  ${f.name}`).join('\n')
        addSystemMessage(`Files:\n${fileList || '  (no files)'}`)
        break

      case 'create':
        if (!arg) {
          addSystemMessage('Usage: create <filename>')
          break
        }
        if (files.find(f => f.name === arg)) {
          addSystemMessage(`Error: File "${arg}" already exists`)
          break
        }
        const newFile = {
          id: Date.now().toString(),
          name: arg,
          type: 'file',
          content: '// New file\n',
        }
        setFiles(prev => [...prev, newFile])
        addSystemMessage(`Created file: ${arg}`)
        break

      case 'open':
        if (!arg) {
          addSystemMessage('Usage: open <filename>')
          break
        }
        const fileToOpen = files.find(f => f.name === arg)
        if (!fileToOpen) {
          addSystemMessage(`Error: File "${arg}" not found`)
          break
        }
        setCurrentFile(fileToOpen)
        setActivePanel('editor')
        addSystemMessage(`Opened file: ${arg}`)
        break

      case 'delete':
        if (!arg) {
          addSystemMessage('Usage: delete <filename>')
          break
        }
        const fileToDelete = files.find(f => f.name === arg)
        if (!fileToDelete) {
          addSystemMessage(`Error: File "${arg}" not found`)
          break
        }
        setFiles(prev => prev.filter(f => f.id !== fileToDelete.id))
        if (currentFile?.id === fileToDelete.id) {
          setCurrentFile(files.find(f => f.id !== fileToDelete.id) || null)
        }
        addSystemMessage(`Deleted file: ${arg}`)
        break

      case 'run':
        if (!arg) {
          addSystemMessage('Usage: run <filename>')
          break
        }
        const fileToRun = files.find(f => f.name === arg)
        if (!fileToRun) {
          addSystemMessage(`Error: File "${arg}" not found`)
          break
        }
        addSystemMessage(`Running ${arg}...\n[Simulated output]\nProcess completed successfully.`)
        break

      case 'ai':
        if (!arg) {
          addSystemMessage('Usage: ai <your question>')
          break
        }
        handleAIQuery(arg)
        break

      case 'clear':
        setMessages([])
        return

      default:
        addSystemMessage(`Unknown command: ${cmd}. Type "help" for available commands.`)
    }
  }

  const addSystemMessage = (content) => {
    const systemMessage = {
      id: Date.now().toString(),
      type: 'system',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, systemMessage])
  }

  const handleAIQuery = (query) => {
    setTimeout(() => {
      let response = ''
      const lowerQuery = query.toLowerCase()
      
      if (lowerQuery.includes('function')) {
        response = 'Here\'s a basic function template:\n\nfunction myFunction(param) {\n  // Your code here\n  return param;\n}\n\nOr using arrow function:\nconst myFunction = (param) => {\n  return param;\n};'
      } else if (lowerQuery.includes('loop')) {
        response = 'Common loop patterns:\n\n// For loop\nfor (let i = 0; i < array.length; i++) {\n  console.log(array[i]);\n}\n\n// For...of loop\nfor (const item of array) {\n  console.log(item);\n}\n\n// While loop\nwhile (condition) {\n  // code\n}'
      } else if (lowerQuery.includes('async')) {
        response = 'Async/await example:\n\nasync function fetchData() {\n  try {\n    const response = await fetch(\'https://api.example.com\');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(\'Error:\', error);\n  }\n}'
      } else if (lowerQuery.includes('react')) {
        response = 'React component template:\n\nimport React, { useState } from \'react\';\n\nfunction MyComponent() {\n  const [state, setState] = useState(\'\'');\n\n  return (\n    <div>\n      <h1>My Component</h1>\n      <input\n        value={state}\n        onChange={(e) => setState(e.target.value)}\n      />\n    </div>\n  );\n}\n\nexport default MyComponent;'
      } else if (lowerQuery.includes('help')) {
        response = 'I\'m your AI coding assistant! I can help with:\n\n• JavaScript/TypeScript syntax and best practices\n• React components and hooks\n• Async programming patterns\n• Debugging common issues\n• Code optimization suggestions\n• Algorithm explanations\n\nJust describe what you need help with!'
      } else {
        response = `I understand you're asking about: "${query}"\n\nHere are some general suggestions:\n• Break down complex problems into smaller parts\n• Use console.log() for debugging\n• Check the browser console for errors\n• Consider using modern JavaScript features\n\nFor more specific help, try asking about functions, loops, async code, or React components!`
      }
      
      const aiMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const handleFileEdit = (content) => {
    if (currentFile) {
      const updatedFile = { ...currentFile, content }
      setCurrentFile(updatedFile)
      setFiles(prev => prev.map(f => f.id === currentFile.id ? updatedFile : f))
    }
  }

  const handleFileSelect = (file) => {
    setCurrentFile(file)
    setActivePanel('editor')
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-title">
          <Bot className="title-icon" size={20} />
          <span>AI Code Assistant</span>
        </div>
        <div className="panel-tabs">
          <button
            className={`tab ${activePanel === 'terminal' ? 'active' : ''}`}
            onClick={() => setActivePanel('terminal')}
          >
            <TerminalIcon size={16} />
            Terminal
          </button>
          <button
            className={`tab ${activePanel === 'files' ? 'active' : ''}`}
            onClick={() => setActivePanel('files')}
          >
            <Folder size={16} />
            Files
          </button>
          <button
            className={`tab ${activePanel === 'editor' ? 'active' : ''}`}
            onClick={() => setActivePanel('editor')}
          >
            <Code size={16} />
            Editor
          </button>
        </div>
      </div>

      <div className="app-content">
        {activePanel === 'terminal' && (
          <Terminal messages={messages} onCommand={handleCommand} />
        )}
        {activePanel === 'files' && (
          <FileExplorer files={files} onFileSelect={handleFileSelect} />
        )}
        {activePanel === 'editor' && (
          <CodeEditor
            file={currentFile}
            onEdit={handleFileEdit}
          />
        )}
      </div>
    </div>
  )
}

export default App