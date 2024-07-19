'use client';

import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { _analyticPosts, _analyticOrderTimeline } from 'src/_mock';

import { AnalyticsNews } from '../analytics-news';
import { DashboardStateView } from '../dashboard-state-view';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------
const apiPieChartData = [
  {
    label: '건강보험공단',
    value: 7,
  },
  {
    label: '인터넷진흥원',
    value: 7,
  },
  {
    label: '영화진흥위원회',
    value: 7,
  },
  {
    label: '방송통신위원회',
    value: 6,
  },
  {
    label: '조달청',
    value: 5,
  },
  {
    label: '대한상공회의소',
    value: 2,
  },
  {
    label: '한국산업인력공단',
    value: 23,
  },
];

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={2}>
          <DashboardStateView totalCount={13512} />
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <AnalyticsCurrentVisits
            title="API 서비스 그룹별 연계 현황"
            chart={{
              series: apiPieChartData,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={7}>
          <AnalyticsWebsiteVisits
            title="월별 API 호출 건수"
            // subheader="(+43%) than last year"
            chart={{
              categories: [
                '2024/06/04',
                '2024/06/05',
                '2024/06/06',
                '2024/06/07',
                '2024/06/08',
                '2024/06/09',
                '2024/06/10',
              ],
              series: [{ name: 'API', data: [131, 221, 331, 114, 261, 251, 141] }],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_analyticPosts} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_analyticOrderTimeline} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
