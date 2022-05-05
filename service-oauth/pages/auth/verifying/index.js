import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  TextField,
  Typography,
  Container,
  Button,
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
import { useEffect } from 'react';

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

function VerifyingBasic() {
  const { t } = useTranslation();
  const isMountedRef = useRefMounted();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (isMountedRef()) {
      if (!user) {
        router.push({ pathname: '/auth/login', query: router.query });
      } else {
        const { preferredMFA } = user;

        if (preferredMFA === 'NOMFA')
          router.push({ pathname: '/auth/login', query: router.query });
      }
    }
  }, []);

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
                {t('Multi-Factor Authentication')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{
                  mb: 3
                }}
              >
                {t('Enviamos um código de verificação para seu celular.')}{' '}
                <strong>
                  {user?.challengeParam?.CODE_DELIVERY_DESTINATION}
                </strong>
              </Typography>
            </Box>
            <Formik
              initialValues={{
                verificationCode: '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                verificationCode: Yup.string()
                  .max(6)
                  .required(t('Você precisa informar um código de verificação'))
              })}
              onSubmit={async (
                _values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  user.sendMFACode(_values.verificationCode, {
                    onSuccess: () => {
                      if (isMountedRef()) {
                        setStatus({ success: true });
                        setSubmitting(false);

                        window.location.reload();
                      }
                    },
                    onFailure: (err) => {
                      console.error(err);
                      if (isMountedRef()) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                      }
                    }
                  });
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
    </>
  );
}

VerifyingBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default VerifyingBasic;
