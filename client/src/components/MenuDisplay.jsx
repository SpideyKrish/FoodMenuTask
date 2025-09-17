import React from 'react'

export default function MenuDisplay({ data }) {
  const title = data?.title || 'Home Chef Menu'
  const day = data?.day_of_week || 'Unknown'
  const items = Array.isArray(data?.menu_items) ? data.menu_items : []
  const notes = data?.special_notes || null

  return (
    <div className="menu-display">
      <h3>{title} — {day}</h3>

      {items.length === 0 ? (
        <p>No menu items extracted.</p>
      ) : (
        <ul>
          {items.map((it, idx) => (
            <li key={idx} className="menu-item">
              <strong>{it.name}</strong>
              {it.price && <span className="price"> — {it.price}</span>}
              {it.category && <div className="category">{it.category}</div>}
              {it.description && <p className="desc">{it.description}</p>}
            </li>
          ))}
        </ul>
      )}

      {notes && (
        <div className="notes">
          <h4>Special Notes</h4>
          <p>{notes}</p>
        </div>
      )}

      <details>
        <summary>Raw JSON</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  )
}
