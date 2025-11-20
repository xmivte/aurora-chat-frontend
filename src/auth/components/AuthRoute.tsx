import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '..';

export interface IAuthRouteProps {
  children: ReactNode;
}

const AuthRoute = (props: IAuthRouteProps) => {
  const { children } = props;
  const navigate = useNavigate();
  const { loading } = useAuth(navigate);

  if (loading) return <p></p>;

  return <div>{children}</div>;
};

export default AuthRoute;
