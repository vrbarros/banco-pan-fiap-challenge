import PropTypes from 'prop-types';

import {
  Box,
  Typography,
  Card,
  Tooltip,
  Avatar,
  CardMedia,
  IconButton,
  styled
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';

const Input = styled('input')({
  display: 'none'
});

const AvatarWrapper = styled(Card)(
  ({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
);

const ProfileCover = ({ user }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box display="flex" mb={3}>
        <Tooltip arrow placement="top" title={t('Go back')}>
          <IconButton
            href="/management/users"
            color="primary"
            sx={{
              p: 2,
              mr: 2
            }}
          >
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            {t('Esta é sua conta')} {user.name}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'Você pode facilmente acessar os diversos serviços oferecidos pelo Banco PAN'
            )}
          </Typography>
        </Box>
      </Box>
      <CardCover>
        <CardMedia image={user.coverImg} />
      </CardCover>
      <AvatarWrapper>
        <Avatar variant="rounded" alt={user.name} src={user.avatar} />
        <ButtonUploadWrapper>
          <Input
            accept="image/*"
            id="icon-button-file"
            name="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton component="span" color="primary">
              <UploadTwoToneIcon />
            </IconButton>
          </label>
        </ButtonUploadWrapper>
      </AvatarWrapper>
      <Box py={2} pl={2} mb={3}></Box>
    </>
  );
};

ProfileCover.propTypes = {
  user: PropTypes.object.isRequired
};

export default ProfileCover;
