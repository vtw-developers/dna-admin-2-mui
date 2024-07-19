import { useState } from 'react';

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

type Props = {
  totalCount: number;
};
export const DashboardStateView = ({ totalCount }: Props) => {
  const [count, setCount] = useState<number>(totalCount);
  return (
    <Card className="dashboard-state">
      <CardHeader title="API 현황" />
      <Grid container spacing={1} className="item" sx={{ margin: '65px 58px' }}>
        <Grid xs={6} md={6} lg={6}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            연계상태
          </Typography>
        </Grid>
        <Grid xs={6} md={6} lg={6}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            오류건수
          </Typography>
        </Grid>
        <Grid xs={6} md={6} lg={6}>
          <Avatar sx={{ width: 100, height: 100, fontSize: '30px' }} color="info">
            정상
          </Avatar>
        </Grid>
        <Grid xs={6} md={6} lg={6}>
          <Avatar sx={{ width: 100, height: 100, fontSize: '30px' }} color="error">
            0
          </Avatar>
        </Grid>
      </Grid>
      <Divider />
      <Typography variant="h6" sx={{ textAlign: 'center', margin: '10px 0' }}>
        {`총 누적건수 : ${count} 건`}
      </Typography>
    </Card>
  );
};
