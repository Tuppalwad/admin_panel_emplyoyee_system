import React from 'react';

/* Read-only rendering of an asset's most recently recorded componentChecks. */
function ComponentChecksTable({ checks = [], emptyMessage = 'No component checks recorded.' }) {
  if (!checks?.length) {
    return <p className="text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b">
            <th className="py-3 pr-4">Component</th>
            <th className="py-3 pr-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {checks.map((check, index) => (
            <tr key={check._id || `${check.component}-${index}`} className="border-b last:border-0">
              <td className="py-3 pr-4 font-medium text-slate-800">
                {check.component}
              </td>

              <td className="py-3 pr-4 text-slate-600">
                {check.status || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComponentChecksTable;
