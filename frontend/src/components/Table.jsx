import React from 'react';

export default function Table({ columns = [], data = [] }){
  return (
    <div className="card">
      <div className="table-container">
        <table className="table" role="table">
          <thead>
            <tr>
              {columns.map((c, i) => <th key={i}>{c.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && <tr><td colSpan={columns.length} className="small">Aucune donnée</td></tr>}
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((c, i) => <td key={i}>{row[c.accessor]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
