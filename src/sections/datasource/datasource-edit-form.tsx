import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import { ConfirmDialog } from '../../components/custom-dialog';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import { createDatasource, deleteDatasource, updateDatasource } from '../../actions/datasource';

import type { Datasource } from '../../types/datasource';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.number().optional(),
  name: zod
    .string()
    .min(1, { message: '데이터소스 이름을 입력하세요.' })
    .max(100, { message: '100자 이내로 입력하세요.' }),
  database: zod.string(),
  url: zod.string(),
  username: zod.string(),
  password: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: Datasource;
};

export const databases = [
  {
    id: 'PostgreSQL',
    icon: '/icons/database/postgresql.svg',
  },
  {
    id: 'Oracle',
    icon: '/icons/database/oracle.svg',
  },
  {
    id: 'MySQL',
    icon: '/icons/database/mysql.svg',
  },
  {
    id: 'Tibero',
    icon: '/icons/database/tibero.svg',
  },
];

export function DatasourceEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.manage.datasource.root;
  const editPath = paths.manage.datasource.edit(entity?.id);
  const detailsPath = paths.manage.datasource.details(entity?.id);

  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      name: entity?.name || '',
      database: entity?.database || '',
      url: entity?.url || '',
      username: entity?.username || '',
      password: entity?.password || '',
    }),
    [entity]
  );

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (entity) {
      reset(defaultValues);
    }
  }, [entity, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editMode === 'create') {
        await createDatasource(data).then(() => toast.success('저장되었습니다.'));
        router.push(listPath);
      } else if (editMode === 'update') {
        await updateDatasource(data).then(() => toast.success('수정되었습니다.'));
        router.push(detailsPath);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  });
  const cancelEdit = () => {
    if (editMode === 'create') {
      router.push(listPath);
    } else if (editMode === 'update') {
      router.push(detailsPath);
    }
  };

  const confirmDelete = handleSubmit(async (data) => {
    await deleteDatasource(data);
    toast.success('삭제되었습니다.');
    router.push(listPath);
  });

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />

      <Divider />

      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="name"
            label="이름"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Select
            variant="outlined"
            name="database"
            label="Database"
            inputProps={{ readOnly: editMode === 'details' }}
          >
            {databases.map((option) => (
              <MenuItem key={option.id} value={option.id} sx={{ textTransform: 'capitalize' }}>
                {option.id}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="url"
            label="URL"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="username"
            label="Username"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="password"
            label="Password"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
        {renderDetails}
        <DnaBottomButtons
          editing={editing}
          listPath={listPath}
          editPath={editPath}
          confirm={confirm}
          isSubmitting={isSubmitting}
          cancelEdit={cancelEdit}
        />
      </Stack>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="삭제"
        content={<>선택한 항목을 삭제하시겠습니까?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirmDelete().then((e) => {
                confirm.onFalse();
              });
            }}
          >
            삭제
          </Button>
        }
      />
    </Form>
  );
}
