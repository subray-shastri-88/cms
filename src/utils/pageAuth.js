const pageAuthMapper = {
  ADMIN: {
    routesAllowed: [
      '/',
      '/bookings',
      '/corporates',
      '/cpo',
      '/customers',
      '/products',
      '/rfid',
      '/stationOwners',
      '/stations',
      '/users'
    ]
  },
  CORP: {},
  ISO: {},
  CPO: {},
  DRIVER: {},
  PERSONAL: {}
};

export default pageAuthMapper;
