import React, { useMemo } from 'react';
import { AgGridReact, AgGridProvider } from 'ag-grid-react';
import { AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const defaultGridOptions = {
  animateRows: true,

  pagination: true,
  paginationPageSize: 10,

  suppressRowClickSelection: false,

  rowHeight: 55,
  headerHeight: 55,

  rowSelection: {
    type: 'single',
  },

  defaultColDef: {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    minWidth: 140,
  },
};

function AgGridTable({
  rowData = [],
  columnDefs = [],
  height = 520,
  className = '',
  gridOptions = {},
  components = {},
  frameworkComponents = {},
  onGridReady,
  style = {},
  ...rest
}) {
  const mergedGridOptions = useMemo(() => ({
    ...defaultGridOptions,
    ...gridOptions,
    defaultColDef: {
      ...defaultGridOptions.defaultColDef,
      ...gridOptions.defaultColDef,
    },
  }), [gridOptions]);

  const containerStyle = useMemo(
    () => ({ width: '100%', height, ...style }),
    [height, style]
  );

  return (
    <div className={`ag-theme-alpine ${className}`} style={containerStyle}>
      <AgGridProvider modules={[AllCommunityModule]}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          components={components}
          frameworkComponents={frameworkComponents}
          {...mergedGridOptions}
          {...rest}
        />
      </AgGridProvider>
    </div>
  );
}

export default AgGridTable;
