import { File, Folder as FolderIcon } from 'lucide-react'
import './FileExplorer.css'

function FileExplorer({ files, onFileSelect }) {
  const getFileIcon = (file) => {
    if (file.type === 'folder') {
      return <FolderIcon size={16} />
    }
    return <File size={16} />
  }

  const getFileExtensionClass = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'file-js'
      case 'ts':
      case 'tsx':
        return 'file-ts'
      case 'css':
        return 'file-css'
      case 'html':
        return 'file-html'
      case 'md':
        return 'file-md'
      case 'json':
        return 'file-json'
      case 'py':
        return 'file-py'
      default:
        return 'file-default'
    }
  }

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <div className="file-explorer-title">
          <FolderIcon size={16} />
          Files
        </div>
      </div>
      
      <div className="file-list">
        {files.length === 0 ? (
          <div className="empty-state">
            <p>No files yet</p>
            <p className="empty-hint">Use the terminal to create files with:</p>
            <code>create filename.js</code>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className={`file-item ${getFileExtensionClass(file.name)}`}
              onClick={() => onFileSelect(file)}
            >
              <div className="file-icon">
                {getFileIcon(file)}
              </div>
              <span className="file-name">{file.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FileExplorer