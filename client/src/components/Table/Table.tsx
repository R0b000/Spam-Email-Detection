import React from 'react';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableRow, Paper, SxProps } from '@mui/material';

interface Column<T> {
  id: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  getRowSx?: (row: T) => SxProps;
}

function Table<T>({ columns, rows, keyExtractor, onRowClick, getRowSx }: TableProps<T>) {
  const safeRows = Array.isArray(rows) ? rows.filter(Boolean) : [];
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
      <MuiTable size="small" sx={{ borderCollapse: 'collapse' }}>
        <TableBody>
          {safeRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ border: 'none', textAlign: 'center', py: 12, color: '#5f6368' }}>
                No data available
              </TableCell>
            </TableRow>
          ) : (
            safeRows.map((row) => {
              const key = keyExtractor(row) ?? Math.random();
              return (
                <TableRow
                  key={key}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    borderBottom: '1px solid #f1f3f4',
                    transition: 'all 0.15s ease',
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#f7f9fa !important',
                      boxShadow: '0 1px 3px 0 rgba(60,64,67,0.08), 0 1px 3px 1px rgba(60,64,67,0.04)',
                      zIndex: 1,
                      position: 'relative',
                    },
                    ...(getRowSx ? (getRowSx(row) as any) : {}),
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.id)}
                      align={col.align || 'left'}
                      sx={{
                        borderBottom: 'none',
                        padding: '10px 16px',
                        fontSize: '0.875rem',
                        color: '#444746',
                      }}
                    >
                      {col.render ? col.render(row) : String(row[col.id as keyof T] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default Table;
