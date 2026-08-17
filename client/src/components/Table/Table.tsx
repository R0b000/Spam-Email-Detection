import React from 'react';
import { Box, SxProps } from '@mui/material';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
  gridSpan?: number;
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
    <Box sx={{ width: '100%' }}>
      {safeRows.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 12, color: '#5f6368', fontSize: '0.875rem' }}>
          No data available
        </Box>
      ) : (
        safeRows.map((row) => {
          const key = keyExtractor(row) ?? Math.random();
          return (
            <Box
              key={key}
              onClick={() => onRowClick?.(row)}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(18, 1fr)',
                alignItems: 'center',
                cursor: onRowClick ? 'pointer' : 'default',
                borderBottom: '1px solid #f1f3f4',
                transition: 'all 0.15s ease',
                backgroundColor: '#fff',
                py: 1.25,
                px: 2,
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
                <Box
                  key={String(col.id)}
                  sx={{
                    gridColumn: col.gridSpan ? `span ${col.gridSpan}` : 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start',
                    fontSize: '0.875rem',
                    color: '#444746',
                    minWidth: 0,
                    overflow: 'hidden',
                  }}
                >
                  {col.render ? col.render(row) : String(row[col.id as keyof T] ?? '')}
                </Box>
              ))}
            </Box>
          );
        })
      )}
    </Box>
  );
}

export default Table;
