import { Box, Card, Typography, Container, styled } from '@mui/material';
import Head from 'next/head';
import { Guest } from 'src/components/Guest';
import { useAuth } from 'src/hooks/useAuth';
import { RegisterAuth0 } from 'src/content/Auth/Register/RegisterAuth0';
import { RegisterFirebaseAuth } from 'src/content/Auth/Register/RegisterFirebaseAuth';
import { RegisterJWT } from 'src/content/Auth/Register/RegisterJWT';
import { RegisterAmplify } from 'src/content/Auth/Register/RegisterAmplify';
import { useTranslation } from 'react-i18next';
import Logo from 'src/components/Logo';
import BaseLayout from 'src/layouts/BaseLayout';
import Link from 'src/components/Link';
import { useRouter } from 'next/router';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
`
);

function RegisterBasic() {
  const { method } = useAuth();
  const { t } = useTranslation();

  const router = useRouter();
  const { redirect } = router.query;

  return (
    <>
      <Head>
        <title>Banco PAN</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Box sx={{ width: 120, margin: '0 auto' }}>
              <Logo />
            </Box>
            <Card
              sx={{
                mt: 3,
                px: 4,
                pt: 5,
                pb: 3
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Abra sua conta grátis')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Preencha os campos abaixo para abrir sua conta grátis.')}
                </Typography>
              </Box>
              {method === 'Auth0' && <RegisterAuth0 />}
              {method === 'FirebaseAuth' && <RegisterFirebaseAuth />}
              {method === 'JWT' && <RegisterJWT />}
              {method === 'Amplify' && <RegisterAmplify />}
              <Box mt={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  {t('Já possui uma conta?')}
                </Typography>{' '}
                <Link href={{ pathname: '/auth/login', query: router.query }}>
                  <b>Entre aqui</b>
                </Link>
              </Box>
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

RegisterBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default RegisterBasic;
