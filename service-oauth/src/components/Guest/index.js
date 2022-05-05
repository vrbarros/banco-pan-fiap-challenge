import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/useAuth';
import { Auth } from 'aws-amplify';

export const Guest = (props) => {
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (auth.isAuthenticated) {
      Auth.currentSession().then((res) => {
        const refreshToken = res.getRefreshToken();
        const isValid = res.isValid();

        const query = {
          isValid: isValid,
          refreshToken: refreshToken.token
        };

        const searchParams = new URLSearchParams(query);

        if (router.query.service) {
          window.location.href = `${
            router.query.service
          }?${searchParams.toString()}`;
        } else {
          router.push('/auth/profile');
        }
      });

      // router.push('/auth/profile');
    } else {
      setVerified(true);
    }
  }, [router.isReady]);

  if (!verified) {
    return null;
  }

  return <>{children}</>;
};

Guest.propTypes = {
  children: PropTypes.node
};
