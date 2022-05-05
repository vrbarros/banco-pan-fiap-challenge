import {
  Box,
  Card,
  Typography,
  Container,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  TextField,
  styled,
  Button
} from '@mui/material';
import Head from 'next/head';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';

import BaseLayout from 'src/layouts/BaseLayout';

import { useTranslation } from 'react-i18next';
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
  ({ theme }) => `
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(6)};
`
);

function IndexPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isValid, refreshToken } = router.query;

  return (
    <>
      <Head>
        <title>Banco PAN</title>
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
                {t('Banking Service')}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                {t(
                  'Simulamos um serviço legado que precisa se utilizar do novo serviço de autenticação do Banco Pan.'
                )}
              </Typography>
            </Box>
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                <List>
                  <ListItemButton
                    component="a"
                    href={`${process.env.NEXT_PUBLIC_OAUTH_APP_URL}/auth/login?service=${window?.location?.href}`}
                  >
                    <ListItemIcon>
                      <SecurityOutlined />
                    </ListItemIcon>
                    <ListItemText>
                      {t('Solicitar credenciais para o serviço de Banking')}
                    </ListItemText>
                  </ListItemButton>
                </List>
              </Card>
              <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Credenciais de segurança')}
                </Typography>
                <TextField
                  error={!isValid}
                  fullWidth
                  margin="normal"
                  helperText={t('Verificação se a credencial está válida')}
                  label={t('Validade')}
                  name="isValid"
                  type="text"
                  value={isValid || ''}
                  variant="outlined"
                  disabled
                />
                <TextField
                  error={!refreshToken}
                  fullWidth
                  margin="normal"
                  helperText={t(
                    'Este é o Refresh Token utilizado para o serviço iniciar uma nova sessão'
                  )}
                  label={t('Refresh Token')}
                  name="refreshToken"
                  type="text"
                  value={refreshToken || ''}
                  variant="outlined"
                  disabled
                />
                <Button
                  disabled={!refreshToken}
                  component="a"
                  fullWidth
                  variant="contained"
                  href={`${process.env.NEXT_PUBLIC_OAUTH_APP_URL}/auth/logout?service=${window?.location?.href}`}
                >
                  {t('Encerrar sessão')}
                </Button>
              </Card>
            </Container>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default IndexPage;

IndexPage.getLayout = function getLayout(page) {
  return <BaseLayout>{page}</BaseLayout>;
};
