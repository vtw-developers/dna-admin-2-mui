'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import TableContainer from '@mui/material/TableContainer';

import { ApiStatsFilter } from '../api-stats-filter';
import { useGetApiStats } from '../../../actions/api-stats';
import { DashboardContent } from '../../../layouts/dashboard';
import { defaultApiStatsFilters } from '../../../types/api-stats';
import { LoadingScreen } from '../../../components/loading-screen';
import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';

import type { ApiStats, ApiStatsFilters } from '../../../types/api-stats';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface YearMonth {
  year: number;
  month: number;
}

interface YearMonthGroup {
  year: number;
  months: number[];
}

export function ApiStatsView() {
  const [filters, setFilters] = useState<ApiStatsFilters>(defaultApiStatsFilters);
  const { data, loading, mutate } = useGetApiStats(filters);
  const [groups, setGroups] = useState<string[]>([]);
  const [yearMonths, setYearMonths] = useState<YearMonth[]>([]);
  const [yearMonthGroups, setYearMonthGroups] = useState<YearMonthGroup[]>([]);

  useEffect(() => {
    setGroups(
      data
        .map((item) => item.serviceGroup)
        .filter((value, index, self) => self.indexOf(value) === index)
    );

    const years = data
      .map((item) => item.year)
      .filter((value, index, self) => self.indexOf(value) === index);

    const localYearMonthGroups: YearMonthGroup[] = [];
    years.forEach((year) => {
      const months = data
        .filter((row) => row.year === year)
        .map((item) => item.month)
        .filter((value, index, self) => self.indexOf(value) === index);
      localYearMonthGroups.push({ year, months });
    });
    setYearMonthGroups(localYearMonthGroups);

    const localYearMonths: YearMonth[] = [];
    localYearMonthGroups.forEach((yearMonthGroup) => {
      yearMonthGroup.months.forEach((month) => {
        localYearMonths.push({ year: yearMonthGroup.year, month });
      });
    });
    setYearMonths(localYearMonths);
  }, [data]);

  function getApis(group: string) {
    return data
      .filter((row) => row.serviceGroup === group)
      .map((item) => item.api)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="API 현황"
        links={[{ name: 'API 현황' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <ApiStatsFilter
          onSearch={(f) => {
            setFilters(f);
            if (isDeepEqual(filters, f)) {
              mutate();
            }
          }}
        />
      </Card>

      <TableContainer component={Paper}>
        {loading ? (
          <LoadingScreen />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" rowSpan={2} sx={{ width: '200px' }}>
                  서비스그룹
                </TableCell>
                <TableCell align="center" rowSpan={2} sx={{ width: '200px' }}>
                  API
                </TableCell>
                {yearMonthGroups.map((year) => (
                  <TableCell key={year.year} align="center" colSpan={year.months.length}>
                    {year.year}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {yearMonthGroups.map((year) =>
                  year.months.map((month) => (
                    <TableCell key={`${year}-${month}`} align="center" width={100}>
                      {month}
                    </TableCell>
                  ))
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group, i) => (
                <React.Fragment key={`${i}`}>
                  <TableRow sx={{ backgroundColor: 'bisque' }}>
                    <TableCell
                      rowSpan={getApis(group).length + 1}
                      sx={{ width: '200px' }}
                      align="center"
                    >
                      {group}
                    </TableCell>
                  </TableRow>
                  {getApis(group).map((api, j) => (
                    <React.Fragment key={`${j}`}>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: 'beige' }} align="center">
                          {api}
                        </TableCell>
                        {yearMonths.map((ym, k) => {
                          const row = data.find(
                            (stats: ApiStats) =>
                              stats.api === api &&
                              stats.year === ym.year &&
                              stats.month === ym.month
                          );
                          return (
                            <TableCell key={`${k}`} align="center">
                              {row ? numberWithCommas(row.count) : 0}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </DashboardContent>
  );
}
