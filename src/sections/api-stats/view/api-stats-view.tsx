'use client';

import * as React from 'react';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

const TAX_RATE = 0.07;

function ccyFormat(num: number) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty: number, unit: number) {
  return qty * unit;
}

function createRow(desc: string, qty: number, unit: number) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

const data = [
  {
    year: 2023,
    month: 1,
    group: '산업인력공단',
    object: '산인공API1',
    value: 123,
  },
  {
    year: 2023,
    month: 2,
    group: '산업인력공단',
    object: '산인공API2',
    value: 4241223,
  },
  {
    year: 2024,
    month: 2,
    group: '산업인력공단',
    object: '산인공API2',
    value: 4241223,
  },
];

// const years = data
//   .filter((thing, i, arr) => arr.findIndex((t) => t.year === thing.year) === i)
//   .map((t) => t.year);
//
// const test = data.filter((thing, i, arr) => arr.findIndex((t) => t.year === 2023) === i);
//
// const numbers: number[] = data
//   .filter((thing, i, arr) => arr.findIndex((t) => t.year === thing.year) === i)
//   .map((t) => t.month);
// console.log(numbers);
// const min = Math.min(...numbers);
// console.log(min);

const years = [2023, 2024];
const months = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const yearMonths = [
  { year: 2023, months: [10, 11, 12] },
  { year: 2024, months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
];

const sample = [
  {
    group: '산업인력공단',
    objects: [
      {
        name: '산인공API1',
        values: [numberWithCommas(123), numberWithCommas(123), numberWithCommas(121223)],
      },
      {
        name: '산인공API1',
        values: [numberWithCommas(56645665), numberWithCommas(66666), numberWithCommas(12223233)],
      },
    ],
  },
  {
    group: '산업인력공단',
    objects: [
      {
        name: '산인공API1',
        values: [numberWithCommas(123), numberWithCommas(123), numberWithCommas(123)],
      },
      {
        name: '산인공API1',
        values: [numberWithCommas(123), numberWithCommas(23232323), numberWithCommas(123)],
      },
    ],
  },
];

interface Row {
  desc: string;
  qty: number;
  unit: number;
  price: number;
}

function subtotal(items: readonly Row[]) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [createRow('a', 100, 1.15), createRow('b', 10, 45.99), createRow('c', 2, 17.99)];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function ApiStatsView() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '1000px' }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" rowSpan={2} width="500px" sx={{ width: '200px' }}>
              서비스그룹
            </TableCell>
            <TableCell align="center" rowSpan={2} width="500px" sx={{ width: '200px' }}>
              API
            </TableCell>
            {yearMonths.map((year) => (
              <TableCell key={year.year} align="center" colSpan={year.months.length}>
                {year.year}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {yearMonths.map((year) =>
              year.months.map((month) => (
                <TableCell key={`${year}-${month}`} align="center" width={100}>
                  {month}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {sample.map((item, i) => (
            <React.Fragment key={`${i}`}>
              <TableRow sx={{ backgroundColor: 'bisque' }}>
                <TableCell rowSpan={item.objects.length + 1}>{item.group}</TableCell>
              </TableRow>
              {item.objects.map((object, j) => (
                <React.Fragment key={`${j}`}>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: 'beige' }}>{object.name}</TableCell>
                    {object.values.map((value, k) => (
                      <TableCell key={`${k}`}>{value}</TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
