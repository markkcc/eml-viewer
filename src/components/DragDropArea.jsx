import { useState, useRef } from 'react';
import '../styles/DragDropArea.css';

const DragDropArea = ({ onFileLoad }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file is an .eml file
    if (!file.name.toLowerCase().endsWith('.eml')) {
      alert('Please upload an .eml file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileLoad(e.target.result);
    };
    reader.readAsText(file);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div 
      className={`drag-drop-area ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        ref={inputRef}
        type="file" 
        id="input-file-upload" 
        accept=".eml"
        onChange={handleChange} 
        className="input-file-upload"
      />
      <label className="label-file-upload" htmlFor="input-file-upload">
        <div>
          <p>Drag and drop your .eml file here or</p>
          <button className="upload-button" onClick={onButtonClick}>
            Upload an EML file
          </button>
        </div>
      </label>
    </div>
  );
};

export default DragDropArea; 