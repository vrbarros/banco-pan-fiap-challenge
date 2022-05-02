import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';

import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import Link from 'src/components/Link';

import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Checkbox,
  Typography,
  FormControlLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from 'src/hooks/useAuth';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';

import { recaptcha } from 'config';

export const LoginAmplify = (props) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const isMountedRef = useRefMounted();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      terms: true,
      recaptcha: null,
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('O e-mail informado precisa ser em um formato válido'))
        .max(255)
        .required(t('O campo e-mail é necessário')),
      password: Yup.string().max(255).required(t('O campo senha é necessário')),
      terms: Yup.boolean().oneOf(
        [true],
        t('Você precisa estar de acordo com termos e condições de uso')
      ),
      recaptcha: Yup.string()
        .nullable()
        .required(t('Você precisa fazer a verificação de que não é um robô'))
    }),
    onSubmit: async (values, helpers) => {
      try {
        await login(values.email, values.password);

        if (isMountedRef()) {
          router.push({
            pathname: '/auth/multi-factor',
            query: router.query
          });
        }
      } catch (err) {
        console.error(err);

        if (isMountedRef()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit} {...props}>
      <TextField
        error={Boolean(formik.touched.email && formik.errors.email)}
        fullWidth
        margin="normal"
        autoFocus
        helperText={formik.touched.email && formik.errors.email}
        label={t('E-mail')}
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={formik.values.email}
        variant="outlined"
      />
      <TextField
        error={Boolean(formik.touched.password && formik.errors.password)}
        fullWidth
        margin="normal"
        helperText={formik.touched.password && formik.errors.password}
        label={t('Senha')}
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="password"
        value={formik.values.password}
        variant="outlined"
      />
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.terms}
              name="terms"
              color="primary"
              onChange={formik.handleChange}
            />
          }
          label={
            <>
              <Typography variant="body2">
                {t('Estou de acordo com')}{' '}
                <Link href="#">{t('termos e condições')}</Link>.
              </Typography>
            </>
          }
        />
        <Link href="/auth/recover-password">
          <b>{t('Esqueceu sua senha?')}</b>
        </Link>
      </Box>
      {Boolean(formik.touched.terms && formik.errors.terms) && (
        <FormHelperText error>{formik.errors.terms}</FormHelperText>
      )}
      <Box sx={{ mt: 1 }}>
        <ReCAPTCHA
          sitekey={recaptcha.sitekey}
          onChange={(value) => formik.setFieldValue('recaptcha', value)}
        />
      </Box>
      <Button
        sx={{
          mt: 2
        }}
        color="primary"
        startIcon={
          formik.isSubmitting ? <CircularProgress size="1rem" /> : null
        }
        disabled={formik.isSubmitting}
        type="submit"
        fullWidth
        size="large"
        variant="contained"
      >
        {t('Entrar')}
      </Button>
      {Boolean(formik.errors.recaptcha) && (
        <FormHelperText error>{formik.errors.recaptcha}</FormHelperText>
      )}
      {Boolean(formik.errors.submit) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {formik.errors.submit}
        </Alert>
      )}
    </form>
  );
};
