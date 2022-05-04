import {
  Box,
  Card,
  Typography,
  Container,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  styled
} from '@mui/material';
import Head from 'next/head';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';

import BaseLayout from 'src/layouts/BaseLayout';

import { useTranslation } from 'react-i18next';

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
                    href={`${process.env.NEXT_PUBLIC_OAUTH_APP_URL}/oauth`}
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
