import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
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
      <Box display="grid" gap={2} gridTemplateRows="repeat(2, 1fr)" sx={{ p: 2, my: 2 }}>
        <Box className="item">
          <Typography variant="h6" sx={{ mt: 1 }}>
            연계상태
          </Typography>
          <Typography variant="h3" sx={{ color: 'info.main' }}>
            정상
          </Typography>
        </Box>
        <Box className="item">
          <Typography variant="h6" sx={{ mt: 1 }}>
            오류건수
          </Typography>
          <Typography variant="h3" sx={{ color: 'error.main' }}>
            0
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Typography variant="h6" sx={{ textAlign: 'center', margin: '10px 0' }}>
        {`총 누적건수 : ${count} 건`}
      </Typography>
    </Card>
  );
};
