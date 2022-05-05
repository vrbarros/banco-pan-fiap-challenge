import {
  Box,
  Card,
  Typography,
  Container,
  Divider,
  Button,
  styled
} from '@mui/material';
import Head from 'next/head';
import { useAuth } from 'src/hooks/useAuth';

import BaseLayout from 'src/layouts/BaseLayout';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const MainContent = styled(Box)(
  () => `
      height: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
  `
);

const TopWrapper = styled(Box)(
  ({ theme }) => `
    display: flex;
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(6)};
  `
);

function LogoutPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();

  const { service } = router.query;

  useEffect(() => {
    async function logoutRequest() {
      try {
        await logout();
      } catch (err) {
        console.error(err);
      }
    }

    logoutRequest();
  }, []);

  return (
    <>
      <Head>
        <title>Banco PAN | 404</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center">
              <img
                alt="404"
                height={180}
                src="/assets/images/logo/bancopan.svg"
              />
              <Typography variant="h2" sx={{ my: 2 }}>
                {t('Sessão encerrada')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                {t(
                  'Encerramos a sessão de usuário deste dispositivo. Volte sempre!'
                )}
              </Typography>
            </Box>
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                <Button
                  component="a"
                  href={service}
                  variant="contained"
                  disabled={!service}
                >
                  {t('Retornar ao serviço utilizado')}
                </Button>
                <Divider sx={{ my: 4 }}>Ou</Divider>
                <Button href="/" variant={service ? 'outlined' : 'contained'}>
                  {t('Ir para a página inicial')}
                </Button>
              </Card>
            </Container>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default LogoutPage;

LogoutPage.getLayout = function getLayout(page) {
  return <BaseLayout>{page}</BaseLayout>;
};
