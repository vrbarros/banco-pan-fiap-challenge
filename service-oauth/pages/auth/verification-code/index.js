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
  CircularProgress,
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

function VerificationCodeBasic() {
  const { t } = useTranslation();
  const isMountedRef = useRefMounted();
  const router = useRouter();
  const { verifyCode } = useAuth();
  const { email } = router.query;

  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

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
                {t('C??digo de verifica????o')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{
                  mb: 3
                }}
              >
                {t('Enviamos um c??digo de verifica????o para seu e-mail.')}
              </Typography>
            </Box>

            <Formik
              initialValues={{
                email: email || '',
                verificationCode: '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email(
                    t('O e-mail informado precisa ser em um formato v??lido')
                  )
                  .max(255)
                  .required(t('O campo e-mail ?? necess??rio')),
                verificationCode: Yup.string()
                  .max(6)
                  .required(t('Voc?? precisa informar um c??digo de verifica????o'))
              })}
              onSubmit={async (_values, { setErrors, setStatus }) => {
                setSubmitting(true);

                try {
                  await verifyCode(_values.email, _values.verificationCode);

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
                    type="text"
                    value={values.email}
                    variant="outlined"
                    disabled
                  />
                  <TextField
                    error={Boolean(
                      touched.verificationCode && errors.verificationCode
                    )}
                    fullWidth
                    helperText={
                      touched.verificationCode && errors.verificationCode
                    }
                    label={t('C??digo de verifica????o')}
                    margin="normal"
                    name="verificationCode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.verificationCode}
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
            {t('Confirmamos sua conta')}
          </Typography>
          <Typography align="center" sx={{ py: 4, px: 6 }} variant="body1">
            {t(
              'Tudo certo com a verifica????o da sua conta no Banco PAN. Voc?? agora tem acesso ao maior portf??lio de produtos financeiros feitos exclusivamente para voc??!'
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

VerificationCodeBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default VerificationCodeBasic;
