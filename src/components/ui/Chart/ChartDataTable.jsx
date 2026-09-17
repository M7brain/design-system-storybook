import React from 'react';

// Visually-hidden data-table mirror — WCAG dataviz guidance: a hover/tap
// readout is never sufficient alone. sr-only (Tailwind, used identically for
// every hidden-label case elsewhere in this system — Badge/Alert/Toggle/
// Input/Checkbox/FileUpload) keeps it out of the visual layout entirely
// while remaining in the accessibility tree. Rendered as a SIBLING of the
// role="img" chart wrapper, never nested inside it — role="img" prunes its
// own descendants from the accessibility tree, so a table nested inside it
// would be invisible to the very screen readers this exists for.
export function ChartDataTable({ caption, columns, rows }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} scope="col">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
