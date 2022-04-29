import { useState, useCallback, useEffect } from 'react';

import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import Footer from 'src/components/Footer';

import { Box, Tabs, Tab, Grid, styled } from '@mui/material';

import { usersApi } from 'src/mocks/users';

import { useRefMounted } from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';

import ProfileCover from 'src/content/Management/Users/single/ProfileCover';
import MyCards from 'src/content/Management/Users/single/MyCards';
import SecurityTab from 'src/content/Management/Users/single/SecurityTab';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUsersView() {
  const isMountedRef = useRefMounted();
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState('security');

  const tabs = [{ value: 'security', label: t('Segurança') }];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  const getUser = useCallback(async () => {
    try {
      const response = await usersApi.getUser();

      if (isMountedRef()) {
        setUser(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Banco PAN</title>
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid
          sx={{ px: 4 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={6}>
            <ProfileCover user={user} />
          </Grid>
          <Grid item xs={12} md={6}>
            <MyCards />
          </Grid>
          <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === 'security' && <SecurityTab />}
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

ManagementUsersView.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementUsersView;
