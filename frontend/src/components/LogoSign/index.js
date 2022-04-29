import { styled } from '@mui/material';
import Link from 'src/components/Link';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 100%;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

function Logo({ white }) {
  return (
    <LogoWrapper href="/">
      {white ? (
        <img alt="Banco PAN" src="/assets/images/logo/bancopan-white.svg" />
      ) : (
        <img alt="Banco PAN" src="/assets/images/logo/bancopan.svg" />
      )}
    </LogoWrapper>
  );
}

export default Logo;
