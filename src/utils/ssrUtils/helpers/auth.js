import { parseJwt, getCookie } from '../../jsUtils';

const routeToLogin = (pageProps, ctx, reason) => {
  pageProps.props.reason = reason;
  if (ctx.resolvedUrl !== '/login') {
    pageProps.redirect = {
      destination: '/login',
      permanent: false
    };
    return;
  }
};

const auth = async (ctx, pageProps, next) => {
  let currentSession;
  const token = getCookie({
    cname: 'token',
    cookie: ctx.req.headers.cookie,
    fromServer: true
  });
  pageProps.props.token = token;

  if (token) {
    currentSession = await parseJwt(token);
    pageProps.props.currentSession = currentSession;

    if (currentSession) {
      const isExpired = currentSession?.exp < new Date() / 1000;
      const user = currentSession?.user;
      if (user) {
        const { email, id, kind, role, phone, status, name } = user;
        if (status !== 'ACTIVE' || isExpired) {
          routeToLogin(pageProps, ctx, 'user not active or expired');
        }
        pageProps.props.user = { email, id, kind, role, phone, status, name };
        if (ctx.resolvedUrl === '/login') {
          pageProps.redirect = {
            destination: '/',
            permanent: false
          };
        }
      }
    } else {
      routeToLogin(pageProps, ctx, 'currentSession unread');
    }
  } else {
    routeToLogin(pageProps, ctx, 'Token Unreead');
  }
  return next();
};

export default auth;
