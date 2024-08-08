'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

import { idCheck, createAccount } from '../../../auth/context/jwt';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  id: zod.string().min(1, { message: 'ID is required!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();

  const [duplicated, setDuplicated] = useState<boolean>(true);

  const router = useRouter();

  const password = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    name: 'dna',
    id: 'hello',
    password: '@demo1',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setError,
    clearErrors,
    setFocus,
    formState: { isSubmitting, isValid },
  } = methods;
  const values = watch();
  const idValue = watch('id');

  useEffect(() => {
    setDuplicated(true);
  }, [idValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (isValid) {
      try {
        await createAccount({
          id: data.id,
          password: data.password,
          name: data.name,
        });
        await checkUserSession?.();

        router.refresh();
      } catch (error) {
        console.error(error);
        setErrorMsg(error instanceof Error ? error.message : error);
      }
    } else setFocus('id', { shouldSelect: true });
  });

  const duplicatedCheck = async () => {
    const entity = await idCheck(values.id);
    setDuplicated(entity);
    if (entity)
      setError('id', {
        type: 'duplicate',
        message: '이미 사용중인 ID 입니다. 다른 ID를 사용해 주세요.',
      });
    else clearErrors('id');
  };

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">DnA Admin을 시작해 보세요</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          이미 계정이 존재한다면?
        </Typography>

        <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
          로그인
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="name" label="이름" InputLabelProps={{ shrink: true }} variant="outlined" />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="id" label="ID" InputLabelProps={{ shrink: true }} variant="outlined" />
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: '80px' }}
          onClick={duplicatedCheck}
        >
          중복체크
        </Button>
      </Stack>

      <Field.Text
        name="password"
        label="비밀번호"
        placeholder="6자 이상 입력하세요."
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
      {duplicated && <Typography variant="body2">ID 중복체크를 진행해 주세요.</Typography>}
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={duplicated}
        loadingIndicator="Create account..."
      >
        계정 생성
      </LoadingButton>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 3,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      <Link underline="always" color="text.primary">
        서비스 약관
      </Link>
      {' 및 '}
      <Link underline="always" color="text.primary">
        개인정보 처리 방침
      </Link>
      에 동의합니다.
    </Typography>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {renderTerms}
    </>
  );
}
