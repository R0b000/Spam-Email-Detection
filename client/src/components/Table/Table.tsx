import React from 'react';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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
}

function Table<T>({ columns, rows, keyExtractor, onRowClick }: TableProps<T>) {
  return (
    <TableContainer component={Paper} className="border border-gborder">
      <MuiTable size="small">
        <TableHead>
          <TableRow className="bg-gray-50">
            {columns.map((col) => (
              <TableCell key={String(col.id)} align={col.align || 'left'} className="font-semibold text-gtext">
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-gsubtext py-8">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={keyExtractor(row)}
                hover
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {columns.map((col) => (
                  <TableCell key={String(col.id)} align={col.align || 'left'}>
                    {col.render ? col.render(row) : String(row[col.id as keyof T] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default Table;
