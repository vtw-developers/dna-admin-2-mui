import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import { ConfirmDialog } from '../../components/custom-dialog';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import { getRoles, deleteUser, updateUser, createUser } from '../../actions/user';

import type { Role, User } from '../../types/user';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.string(),
  name: zod.string().min(1, { message: 'Name is required!' }),
  roleId: zod.number().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: User;
};

export function UserEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.manage.user.root;
  const editPath = paths.manage.user.edit(entity?.id);
  const detailsPath = paths.manage.user.details(entity?.id);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    getRoles().then((e) => {
      setRoles([...e.filter((r: Role) => r.id !== 3)]);
    });
  }, []);

  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      name: entity?.name || '',
      roleId: entity?.roleId || 0,
    }),
    [entity]
  );

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues,
  });

  const {
    reset,
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
        await createUser(data).then(() => toast.success('저장되었습니다.'));
        router.push(listPath);
      } else if (editMode === 'update') {
        await updateUser(data).then(() => toast.success('수정되었습니다.'));
        router.push(detailsPath);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  });

  const cancelEdit = () => {
    if (editMode === 'update') {
      router.push(detailsPath);
    }
  };

  const confirmDelete = handleSubmit(async (data) => {
    await deleteUser(data.id);
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
            name="id"
            label="Id"
            inputProps={{ readOnly: editMode !== 'create' }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text
            name="name"
            label="Name"
            inputProps={{ readOnly: editMode === 'details' }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select
            name="roleId"
            label="역할"
            inputProps={{ readOnly: editMode === 'details' }}
            variant="outlined"
          >
            {roles.map((option) => (
              <MenuItem key={option.id} value={option.id} sx={{ textTransform: 'capitalize' }}>
                {option.name}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        {editMode === 'create' && (
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" color="red">
              * 초기 비밀번호는 ID와 동일합니다
            </Typography>
          </Grid>
        )}
      </Grid>
    </Card>
  );

  return (
    <>
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
      </Form>
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
    </>
  );
}
