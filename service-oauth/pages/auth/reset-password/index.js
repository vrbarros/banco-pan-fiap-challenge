import { useState, forwardRef } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  TextField,
  Typography,
  Container,
  Slide,
  Dialog,
  Button,
  Avatar,
  CircularProgress,
  styled,
  Alert
} from '@mui/material';
import Head from 'next/head';
import { useAuth } from 'src/hooks/useAuth';

import BaseLayout from 'src/layouts/BaseLayout';

import { useRefMounted } from 'src/hooks/useRefMounted';
import { Guest } from 'src/components/Guest';
import Link from 'src/components/Link';
import { useRouter } from 'next/router';

import { useTranslation } from 'react-i18next';
import Logo from 'src/components/Logo';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.success};
      top: -${theme.spacing(6)};
      position: absolute;
      left: 50%;
      margin-left: -${theme.spacing(6)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

function ResetPasswordBasic() {
  const { t } = useTranslation();
  const isMountedRef = useRefMounted();
  const router = useRouter();
  const { passwordReset } = useAuth();
  const { email } = router.query;

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Head>
        <title>Banco PAN</title>
      </Head>
      <MainContent>
        <Container maxWidth="sm">
          <Box sx={{ width: 120, margin: '0 auto' }}>
            <Logo />
          </Box>
          <Card
            sx={{
              mt: 3,
              p: 4
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  mb: 1
                }}
              >
                {t('Redefinir uma nova senha')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{
                  mb: 3
                }}
              >
                {t(
                  'Enviamos um código de verificação para seu e-mail para que possa utilizar na definição de uma nova senha.'
                )}
              </Typography>
            </Box>

            <Formik
              initialValues={{
                email: email || '',
                password: '',
                verificationCode: '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email(
                    t('O e-mail informado precisa ser em um formato válido')
                  )
                  .max(255)
                  .required(t('O campo e-mail é necessário')),
                password: Yup.string()
                  .min(6, 'Sua senha deve conter no mínimo 6 dígitos')
                  .max(12, 'Sua senha deve conter no máximo 12 dígitos')
                  .required(t('O campo senha é necessário')),
                verificationCode: Yup.string()
                  .max(6)
                  .required(t('Você precisa informar um código de verificação'))
              })}
              onSubmit={async (
                _values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  await passwordReset(
                    _values.email,
                    _values.verificationCode,
                    _values.password
                  );

                  if (isMountedRef()) {
                    setStatus({ success: true });
                    setSubmitting(false);

                    setOpenDialog(true);
                  }
                } catch (err) {
                  console.error(err);
                  if (isMountedRef()) {
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                  }
                }
              }}
            >
              {({
                isSubmitting,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label={t('E-mail')}
                    margin="normal"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(
                      touched.verificationCode && errors.verificationCode
                    )}
                    fullWidth
                    helperText={
                      touched.verificationCode && errors.verificationCode
                    }
                    label={t('Código de verificação')}
                    margin="normal"
                    name="verificationCode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.verificationCode}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    margin="normal"
                    helperText={touched.password && errors.password}
                    label={t('Senha')}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    variant="outlined"
                  />
                  <Button
                    sx={{
                      mt: 3
                    }}
                    color="primary"
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={
                      isSubmitting ||
                      Boolean(
                        touched.verificationCode && errors.verificationCode
                      )
                    }
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                  >
                    {t('Confirmar')}
                  </Button>

                  {Boolean(errors.submit) && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {errors.submit}
                    </Alert>
                  )}
                </form>
              )}
            </Formik>
          </Card>
          <Box mt={3} textAlign="right">
            <Typography
              component="span"
              variant="subtitle2"
              color="text.primary"
              fontWeight="bold"
            >
              {t('Gostaria de tentar acessar novamente?')}
            </Typography>{' '}
            <Link href={{ pathname: '/auth/login', query: router.query }}>
              <b>Clique aqui</b>
            </Link>
          </Box>
        </Container>
      </MainContent>
      <DialogWrapper
        open={openDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
      >
        <Box
          sx={{
            px: 4,
            pb: 4,
            pt: 10
          }}
        >
          <AvatarSuccess>
            <CheckTwoToneIcon />
          </AvatarSuccess>
          <Typography align="center" sx={{ px: 6 }} variant="h3">
            {t('Definimos sua nova senha')}
          </Typography>
          <Typography align="center" sx={{ py: 4, px: 6 }} variant="body1">
            {t(
              'Sua nova senha foi salva com sucesso e você pode utilizá-la para acesso à sua conta Banco PAN.'
            )}
          </Typography>
          <Button
            fullWidth
            component={Link}
            size="large"
            variant="contained"
            href={{ pathname: '/auth/login', query: router.query }}
          >
            {t('Continuar')}
          </Button>
        </Box>
      </DialogWrapper>
    </>
  );
}

ResetPasswordBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default ResetPasswordBasic;
