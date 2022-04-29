import { Container, Typography, Grid } from '@mui/material';

import DocsLayout from 'src/layouts/DocsLayout';
import Head from 'next/head';
import PageHeader from 'src/components/PageHeaderDocs';
import { Prism } from 'react-syntax-highlighter';
import a11yDark from 'react-syntax-highlighter/dist/cjs/styles/prism/a11y-dark';

function RtlLayout() {
  const intDir = `import createCache from '@emotion/cache';
  // import stylisRTLPlugin from 'stylis-plugin-rtl';
  
  export default function createEmotionCache() {
    return createCache({
      key: 'css',
      // 
      // stylisPlugins: [stylisRTLPlugin]
    });
  }
  `;

  return (
    <>
      <Head>
        <title>
          Right-to-Left Layout - Tokyo NextJS Javascript Admin Dashboard
        </title>
      </Head>
      <Container maxWidth={false}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PageHeader
              heading="Right-to-Left Layout"
              subheading=""
            ></PageHeader>
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>
              Tokyo NextJS Javascript Admin Dashboard fully supports
              right-to-left layouts. By default, the RTL support is disabled,
              but it's easy to enable it.
            </Typography>
            <Typography paragraph>
              Uncomment the lines in the below example, inside{' '}
              <code>src\createEmotionCache.js</code>
            </Typography>
            <Prism
              showLineNumbers
              wrapLines
              language="javascript"
              style={a11yDark}
            >
              {intDir}
            </Prism>
            <br />
            <Typography paragraph>
              When using a RTL layout, in <code>pages\_document.js</code> you
              will have to add <code>dir="rtl"</code> to the <code>body</code>{' '}
              or <code>html</code> tag.
            </Typography>
            <Typography paragraph>
              Also, inside the used theme (eg.{' '}
              <code>src\theme\schemes\PureLightTheme.js</code>) you will have to
              uncomment <code>direction: i18n.dir(),</code> and{' '}
              <code>import i18n from 'src/i18n/i18n';</code> or simply replace{' '}
              <code>i18n.dir()</code> with <code>'rtl'</code> if you don't want
              automatic RTL detection.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default RtlLayout;

RtlLayout.getLayout = function getLayout(page) {
  return <DocsLayout>{page}</DocsLayout>;
};
