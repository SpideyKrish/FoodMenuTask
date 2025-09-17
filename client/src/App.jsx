import React from 'react'
import FileUpload from './components/FileUpload'

export default function App() {
  return (
    <div className="container">
      <h1>Home Chef — Menu Extractor</h1>
      <p>Upload a <code>.txt</code> file and we'll extract the Home Chef menu.</p>
      <FileUpload />
    </div>
  )
}
