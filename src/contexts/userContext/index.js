import { useState, useEffect } from 'react';
import constate from 'constate';
import { get } from 'lodash';
import fetchPartners from '../../graphQL/cpo/autoComplete';
import { useQuery, useLazyQuery } from '@apollo/client';
import contextWrapper from '../../utils/withContextWrapper';

function useUserContext() {
  const [user, setUser] = useState();

  return {
    user,
    setUser
  };
}

const [UserCtxProvider, UserContext] = constate(useUserContext);

const WithUserCtx = (WrappedComponent) =>
  contextWrapper(WrappedComponent, UserContext, 'WithUserCtx');

export default UserCtxProvider;
export { WithUserCtx };
