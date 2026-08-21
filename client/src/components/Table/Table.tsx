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
                display: { xs: 'flex', md: 'grid' },
                flexDirection: 'column',
                gridTemplateColumns: 'repeat(18, 1fr)',
                alignItems: { xs: 'stretch', md: 'center' },
                cursor: onRowClick ? 'pointer' : 'default',
                borderBottom: '1px solid #f1f3f4',
                transition: 'all 0.15s ease',
                backgroundColor: '#fff',
                py: { xs: 1.5, md: 1.25 },
                px: 2,
                gap: { xs: 0.5, md: 0 },
                '&:hover': {
                  backgroundColor: '#f7f9fa !important',
                  boxShadow: '0 1px 3px 0 rgba(60,64,67,0.08), 0 1px 3px 1px rgba(60,64,67,0.04)',
                  zIndex: 1,
                  position: 'relative',
                },
                ...(getRowSx ? (getRowSx(row) as any) : {}),
              }}
            >
              {/* Mobile View */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', width: '100%', minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ minWidth: 0, flex: 1, pr: 1 }}>
                    {columns[1]?.render ? columns[1].render(row) : String(row[columns[1].id as keyof T] ?? '')}
                  </Box>
                  <Box sx={{ fontSize: '0.75rem', color: '#5f6368', flexShrink: 0, ml: 1 }}>
                    {columns[3]?.render ? columns[3].render(row) : String(row[columns[3].id as keyof T] ?? '')}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 0.5, minWidth: 0 }}>
                  <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                    {columns[2]?.render ? columns[2].render(row) : String(row[columns[2].id as keyof T] ?? '')}
                  </Box>
                  <Box sx={{ flexShrink: 0 }}>
                    {columns[0]?.render ? columns[0].render(row) : String(row[columns[0].id as keyof T] ?? '')}
                  </Box>
                </Box>
              </Box>

              {/* Desktop View */}
              {columns.map((col) => (
                <Box
                  key={String(col.id)}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    gridColumn: col.gridSpan ? `span ${col.gridSpan}` : 'auto',
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
