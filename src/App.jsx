import { useState } from 'react'
import './App.css'
import DragDropArea from './components/DragDropArea'
import EmailViewer from './components/EmailViewer'

function App() {
  const [emailData, setEmailData] = useState(null);

  const handleFileLoad = (data) => {
    setEmailData(data);
  };

  return (
    <div className="app-container">
      <header>
        <h1>EML Viewer</h1>
        <p style={{ color: 'red' }}>⚠️ Warning -- Do not open .eml files from untrusted sources!</p>
        <p>This apps renders the content of .eml files as HTML.</p>
        <p>All processing is done client-side, in your browser, so no data is sent to any servers.</p>
        <p>Content rendered here is not guaranteed to look the same within different email clients.</p>
      </header>
      
      {!emailData ? (
        <DragDropArea onFileLoad={handleFileLoad} />
      ) : (
        <div className="viewer-container">
          <EmailViewer emailData={emailData} />
          <button 
            className="reset-button" 
            onClick={() => setEmailData(null)}
          >
            Upload another file
          </button>
        </div>
      )}
    </div>
  )
}

export default App
