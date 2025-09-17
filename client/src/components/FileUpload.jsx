import React, { useState } from 'react'
import axios from 'axios'
import MenuDisplay from './MenuDisplay'

const API_URL = import.meta.env.VITE_API_URL;

export default function FileUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [menuData, setMenuData] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError(null)
    setMenuData(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return setError('Please select a .txt file.')

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)
      setError(null)

      const resp = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (resp.data && resp.data.data) {
        setMenuData(resp.data.data.extracted)
      } else {
        setError('Unexpected response from server')
      }
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="file-upload">
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Upload & Extract'}</button>
      </form>

      {error && <div className="error">{error}</div>}

      {menuData && (
        <div className="result">
          <h2>Extracted Menu</h2>
          <MenuDisplay data={menuData} />
        </div>
      )}
    </div>
  )
}
