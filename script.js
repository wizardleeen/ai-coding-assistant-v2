class AICodeAssistant {
    constructor() {
        this.activePanel = 'terminal';
        this.files = new Map([
            ['example.js', {
                name: 'example.js',
                content: '// Welcome to AI Code Assistant\n// Type "help" in terminal to see available commands\n\nconsole.log("Hello, World!");'
            }],
            ['README.md', {
                name: 'README.md',
                content: '# AI Code Assistant\n\nA CLI-style coding environment with AI assistance.\n\n## Commands:\n- `help` - Show available commands\n- `create <filename>` - Create a new file\n- `open <filename>` - Open a file in editor\n- `list` - List all files\n- `ai <question>` - Ask AI for coding help\n- `clear` - Clear terminal'
            }]
        ]);
        this.currentFile = 'example.js';
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupTerminal();
        this.setupFileExplorer();
        this.setupEditor();
        this.updateTimestamp();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const panel = tab.dataset.panel;
                this.switchPanel(panel);
            });
        });
    }

    switchPanel(panel) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-panel="${panel}"]`).classList.add('active');

        // Update active panel
        document.querySelectorAll('.panel').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(panel).classList.add('active');

        this.activePanel = panel;
    }

    setupTerminal() {
        const form = document.getElementById('terminal-form');
        const input = document.getElementById('terminal-input');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const command = input.value.trim();
            if (command) {
                this.executeCommand(command);
                input.value = '';
            }
        });

        // Focus input
        input.focus();
    }

    executeCommand(command) {
        this.addMessage('user', `$ ${command}`);

        const [cmd, ...args] = command.split(' ');
        const arg = args.join(' ');

        switch (cmd.toLowerCase()) {
            case 'help':
                this.addMessage('system', 
                    'Available commands:\n' +
                    '  help                 - Show this help message\n' +
                    '  create <filename>    - Create a new file\n' +
                    '  open <filename>      - Open a file in editor\n' +
                    '  list                 - List all files\n' +
                    '  ai <question>        - Ask AI for coding help\n' +
                    '  run <filename>       - Simulate running a file\n' +
                    '  delete <filename>    - Delete a file\n' +
                    '  clear                - Clear terminal'
                );
                break;

            case 'list':
                const fileList = Array.from(this.files.keys()).map(name => `  ${name}`).join('\n');
                this.addMessage('system', `Files:\n${fileList || '  (no files)'}`);
                break;

            case 'create':
                if (!arg) {
                    this.addMessage('system', 'Usage: create <filename>');
                    break;
                }
                if (this.files.has(arg)) {
                    this.addMessage('system', `Error: File "${arg}" already exists`);
                    break;
                }
                this.files.set(arg, { name: arg, content: '// New file\n' });
                this.updateFileList();
                this.addMessage('system', `Created file: ${arg}`);
                break;

            case 'open':
                if (!arg) {
                    this.addMessage('system', 'Usage: open <filename>');
                    break;
                }
                if (!this.files.has(arg)) {
                    this.addMessage('system', `Error: File "${arg}" not found`);
                    break;
                }
                this.currentFile = arg;
                this.updateEditor();
                this.switchPanel('editor');
                this.addMessage('system', `Opened file: ${arg}`);
                break;

            case 'delete':
                if (!arg) {
                    this.addMessage('system', 'Usage: delete <filename>');
                    break;
                }
                if (!this.files.has(arg)) {
                    this.addMessage('system', `Error: File "${arg}" not found`);
                    break;
                }
                this.files.delete(arg);
                if (this.currentFile === arg) {
                    this.currentFile = this.files.keys().next().value || null;
                }
                this.updateFileList();
                this.updateEditor();
                this.addMessage('system', `Deleted file: ${arg}`);
                break;

            case 'run':
                if (!arg) {
                    this.addMessage('system', 'Usage: run <filename>');
                    break;
                }
                if (!this.files.has(arg)) {
                    this.addMessage('system', `Error: File "${arg}" not found`);
                    break;
                }
                this.addMessage('system', `Running ${arg}...\n[Simulated output]\nProcess completed successfully.`);
                break;

            case 'ai':
                if (!arg) {
                    this.addMessage('system', 'Usage: ai <your question>');
                    break;
                }
                this.handleAIQuery(arg);
                break;

            case 'clear':
                document.getElementById('messages').innerHTML = '';
                return;

            default:
                this.addMessage('system', `Unknown command: ${cmd}. Type "help" for available commands.`);
        }
    }

    handleAIQuery(query) {
        setTimeout(() => {
            let response = '';
            const lowerQuery = query.toLowerCase();
            
            if (lowerQuery.includes('function')) {
                response = 'Here\'s a basic function template:\n\nfunction myFunction(param) {\n  // Your code here\n  return param;\n}\n\nOr using arrow function:\nconst myFunction = (param) => {\n  return param;\n};';
            } else if (lowerQuery.includes('loop')) {
                response = 'Common loop patterns:\n\n// For loop\nfor (let i = 0; i < array.length; i++) {\n  console.log(array[i]);\n}\n\n// For...of loop\nfor (const item of array) {\n  console.log(item);\n}\n\n// While loop\nwhile (condition) {\n  // code\n}';
            } else if (lowerQuery.includes('async')) {
                response = 'Async/await example:\n\nasync function fetchData() {\n  try {\n    const response = await fetch(\'https://api.example.com\');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(\'Error:\', error);\n  }\n}';
            } else if (lowerQuery.includes('react')) {
                response = 'React component template:\n\nimport React, { useState } from \'react\';\n\nfunction MyComponent() {\n  const [state, setState] = useState(\'\'');\n\n  return (\n    <div>\n      <h1>My Component</h1>\n      <input\n        value={state}\n        onChange={(e) => setState(e.target.value)}\n      />\n    </div>\n  );\n}\n\nexport default MyComponent;';
            } else if (lowerQuery.includes('help')) {
                response = 'I\'m your AI coding assistant! I can help with:\n\n• JavaScript/TypeScript syntax and best practices\n• React components and hooks\n• Async programming patterns\n• Debugging common issues\n• Code optimization suggestions\n• Algorithm explanations\n\nJust describe what you need help with!';
            } else {
                response = `I understand you're asking about: "${query}"\n\nHere are some general suggestions:\n• Break down complex problems into smaller parts\n• Use console.log() for debugging\n• Check the browser console for errors\n• Consider using modern JavaScript features\n\nFor more specific help, try asking about functions, loops, async code, or React components!`;
            }
            
            this.addMessage('ai', response);
        }, 1000);
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        
        const icon = type === 'user' ? '👤' : type === 'ai' ? '🤖' : '💻';
        const timestamp = new Date().toLocaleTimeString();
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-icon">${icon}</span>
                <span class="message-timestamp">${timestamp}</span>
            </div>
            <div class="message-content">
                <pre>${content}</pre>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    setupFileExplorer() {
        const fileList = document.getElementById('file-list');
        fileList.addEventListener('click', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                const fileName = fileItem.dataset.file;
                this.currentFile = fileName;
                this.updateEditor();
                this.switchPanel('editor');
                
                // Update selected state
                document.querySelectorAll('.file-item').forEach(item => {
                    item.classList.remove('selected');
                });
                fileItem.classList.add('selected');
            }
        });
    }

    updateFileList() {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';
        
        for (const [fileName, file] of this.files) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.file = fileName;
            
            const extension = fileName.split('.').pop()?.toLowerCase();
            if (extension) {
                fileItem.classList.add(`file-${extension}`);
            }
            
            fileItem.innerHTML = `
                <div class="file-icon">📄</div>
                <span class="file-name">${fileName}</span>
            `;
            
            fileList.appendChild(fileItem);
        }
    }

    setupEditor() {
        const textarea = document.getElementById('code-textarea');
        textarea.addEventListener('input', () => {
            this.updateLineNumbers();
            if (this.currentFile && this.files.has(this.currentFile)) {
                this.files.get(this.currentFile).content = textarea.value;
            }
        });

        textarea.addEventListener('scroll', () => {
            const lineNumbers = document.getElementById('line-numbers');
            lineNumbers.scrollTop = textarea.scrollTop;
        });

        this.updateEditor();
    }

    updateEditor() {
        const textarea = document.getElementById('code-textarea');
        const fileNameEl = document.getElementById('current-file-name');
        const languageEl = document.getElementById('file-language');
        
        if (this.currentFile && this.files.has(this.currentFile)) {
            const file = this.files.get(this.currentFile);
            textarea.value = file.content;
            fileNameEl.textContent = file.name;
            languageEl.textContent = this.getFileLanguage(file.name);
        } else {
            textarea.value = '';
            fileNameEl.textContent = 'No file';
            languageEl.textContent = 'Text';
        }
        
        this.updateLineNumbers();
    }

    getFileLanguage(fileName) {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'js':
            case 'jsx':
                return 'JavaScript';
            case 'ts':
            case 'tsx':
                return 'TypeScript';
            case 'css':
                return 'CSS';
            case 'html':
                return 'HTML';
            case 'md':
                return 'Markdown';
            case 'json':
                return 'JSON';
            case 'py':
                return 'Python';
            default:
                return 'Text';
        }
    }

    updateLineNumbers() {
        const textarea = document.getElementById('code-textarea');
        const lineNumbers = document.getElementById('line-numbers');
        const lines = textarea.value.split('\n').length;
        
        lineNumbers.innerHTML = '';
        for (let i = 1; i <= lines; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line-number';
            lineDiv.textContent = i;
            lineNumbers.appendChild(lineDiv);
        }
    }

    updateTimestamp() {
        const timestamp = document.querySelector('.message-timestamp');
        if (timestamp) {
            timestamp.textContent = new Date().toLocaleTimeString();
        }
    }
}

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
    new AICodeAssistant();
});