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
  styled,
  Alert,
  CircularProgress
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

function RecoverPasswordBasic() {
  const { t } = useTranslation();
  const isMountedRef = useRefMounted();
  const router = useRouter();
  const { passwordRecovery } = useAuth();
  const { email } = router.query;

  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
                {t('Recuperar senha')}
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
                  'Informe o e-mail utilizado por sua conta no Banco PAN para que possamos ajudá-lo a definir uma nova senha.'
                )}
              </Typography>
            </Box>

            <Formik
              initialValues={{
                email: email || '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email(
                    t('O e-mail informado precisa estar em um formato válido')
                  )
                  .max(255)
                  .required(t('O campo e-mail é obrigatório'))
              })}
              onSubmit={async (
                _values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  await passwordRecovery(_values.email);

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
                    label={t('E-mail cadastrado')}
                    margin="normal"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
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
                      isSubmitting || Boolean(touched.email && errors.email)
                    }
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                  >
                    {t('Enviar uma nova senha')}
                  </Button>

                  {Boolean(errors.submit) && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {errors.submit}
                    </Alert>
                  )}

                  <DialogWrapper
                    open={openDialog}
                    maxWidth="sm"
                    fullWidth
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseDialog}
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
                        {t('Verifique seu e-mail')}
                      </Typography>
                      <Typography
                        align="center"
                        sx={{ py: 4, px: 6 }}
                        variant="body1"
                      >
                        {t(
                          'Siga as instruções que enviamos por e-mail para definir uma nova senha de acesso.'
                        )}
                      </Typography>
                      <Button
                        fullWidth
                        component={Link}
                        size="large"
                        variant="contained"
                        onClick={handleCloseDialog}
                        href={{
                          pathname: '/auth/reset-password',
                          query: {
                            email: values.email
                          }
                        }}
                      >
                        {t('Continuar')}
                      </Button>
                    </Box>
                  </DialogWrapper>
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
            <Link href="/auth/login">
              <b>Clique aqui</b>
            </Link>
          </Box>
        </Container>
      </MainContent>
    </>
  );
}

RecoverPasswordBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default RecoverPasswordBasic;
