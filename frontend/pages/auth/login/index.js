import {
  Box,
  Card,
  Tooltip,
  Typography,
  Container,
  Alert,
  styled,
  Button
} from '@mui/material';
import Head from 'next/head';
import { useAuth } from 'src/hooks/useAuth';
import { Guest } from 'src/components/Guest';
import { LoginAuth0 } from 'src/content/Auth/Login/LoginAuth0';
import { LoginFirebaseAuth } from 'src/content/Auth/Login/LoginFirebaseAuth';
import { LoginJWT } from 'src/content/Auth/Login/LoginJWT';
import { LoginAmplify } from 'src/content/Auth/Login/LoginAmplify';
import BaseLayout from 'src/layouts/BaseLayout';
import Link from 'src/components/Link';
import { useRouter } from 'next/router';

import { useTranslation } from 'react-i18next';
import Logo from 'src/components/Logo';
import Scrollbar from 'src/components/Scrollbar';

const Content = styled(Box)(
  () => `
    display: flex;
    flex: 1;
    width: 100%;
`
);

const MainContent = styled(Box)(
  () => `
  padding: 0 0 0 440px;
  width: 100%;
  display: flex;
  align-items: center;
`
);

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    background: ${theme.colors.alpha.white[100]};
    width: 440px;
`
);

const SidebarContent = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing(6)};
`
);

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(33)};
`
);

function LoginCover() {
  const { method } = useAuth();
  const { t } = useTranslation();

  const router = useRouter();
  const { redirect } = router.query;

  return (
    <>
      <Head>
        <title>Banco PAN</title>
      </Head>
      <Content>
        <SidebarWrapper
          sx={{
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <Scrollbar>
            <SidebarContent>
              <Logo />
              <Box mt={6}>
                <Box
                  sx={{
                    width: 300
                  }}
                >
                  <img
                    width="100%"
                    alt="Auth0"
                    src="/assets/images/other/openaccount.png"
                  />
                </Box>
                <TypographyH1
                  variant="h1"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Conta Grátis e 100% digital')}
                </TypographyH1>
                <Typography
                  variant="subtitle1"
                  sx={{
                    my: 3
                  }}
                >
                  {t(
                    'Uma conta todinha pensada pra você comandar a sua vida financeira pelo celular.'
                  )}
                </Typography>
              </Box>
              <Button
                color="primary"
                type="submit"
                fullWidth
                size="large"
                variant="outlined"
              >
                {t('Abra sua conta')}
              </Button>
            </SidebarContent>
          </Scrollbar>
        </SidebarWrapper>
        <MainContent>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
            maxWidth="sm"
          >
            <Card
              sx={{
                p: 4,
                my: 4
              }}
            >
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Área do cliente')}
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
                    'Preencha os campos abaixo para entrar em sua área exclusiva como cliente.'
                  )}
                </Typography>
              </Box>
              {method === 'Auth0' && <LoginAuth0 />}
              {method === 'FirebaseAuth' && <LoginFirebaseAuth />}
              {method === 'JWT' && <LoginJWT />}
              {method === 'Amplify' && <LoginAmplify />}
              <Box my={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  {t('Ainda não é cliente?')}
                </Typography>{' '}
                <Link href="#">
                  <b>Abra sua conta!</b>
                </Link>
              </Box>
              {method !== 'Auth0' && (
                <Tooltip
                  title={t('Used only for the live preview demonstration !')}
                >
                  <Alert severity="warning">
                    Use <b>fiap@bancopan.com.br</b> e senha <b>Fiap2022*@</b>
                  </Alert>
                </Tooltip>
              )}
            </Card>
          </Container>
        </MainContent>
      </Content>
    </>
  );
}

LoginCover.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default LoginCover;
