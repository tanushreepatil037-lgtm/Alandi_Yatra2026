/**
 * Utility function to export array of objects as a downloadable CSV file
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const columnHeaders = headers || (Object.keys(data[0]) as (keyof T)[]).map((key) => ({
    key,
    label: String(key).toUpperCase(),
  }));

  const csvRows: string[] = [];

  // Header row
  csvRows.push(columnHeaders.map((h) => `"${h.label}"`).join(','));

  // Data rows
  data.forEach((item) => {
    const row = columnHeaders.map((col) => {
      let val: unknown = item[col.key];
      if (val === null || val === undefined) val = '';
      if (typeof val === 'object') val = JSON.stringify(val);
      // Escape double quotes
      const cleanVal = String(val).replace(/"/g, '""');
      return `"${cleanVal}"`;
    });
    csvRows.push(row.join(','));
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
