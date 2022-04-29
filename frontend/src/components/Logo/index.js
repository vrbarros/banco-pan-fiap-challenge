import { Card, styled } from '@mui/material';
import Link from 'src/components/Link';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};

        &:hover {
          text-decoration: none;
        }
`
);

const CardImg = styled(Card)(
  ({ theme }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid ${theme.colors.alpha.black[10]};
    transition: ${theme.transitions.create(['border'])};

    &:hover {
      border-color: ${theme.colors.primary.main};
    }
`
);

function Logo() {
  return (
    <LogoWrapper href="/">
      <CardImg
        sx={{
          width: 110,
          height: 110
        }}
      >
        <img
          width={80}
          alt="Banco PAN"
          src="/assets/images/logo/bancopan.svg"
        />
      </CardImg>
    </LogoWrapper>
  );
}

export default Logo;
