import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { getFleetVehicles } from '../../../graphQL/corporate';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useQuery } from '@apollo/client';

const Fleet = ({ corpId, count = 100 }) => {
  const [fleetList, setFleetList] = useState([]);
  const [pagination, setPagination] = useState({});

  const filterVmTypes = (data) => {
    const list = data.filter((item) => item.type.some((r) => type.includes(r)));
    setVms(list);
  };

  const { data, refetch } = useQuery(getFleetVehicles, {
    variables: {
      filter: {
        corporateId: corpId
      },
      pagination: {
        limit: count,
        page: 1
      }
    }
  });

  const handlePagination = (page) => {
    refetch({
      filter: {
        corporateId: corpId
      },
      pagination: {
        limit: count,
        page: page
      }
    });
  };

  useEffect(() => {
    if (data) {
      setFleetList(get(data, 'FleetVehicles.docs', []));
      setPagination(get(data, 'FleetVehicles.pagination', {}));
    }
  }, [data]);

  return {
    fleetList,
    pagination,
    handlePagination
  };
};

export default Fleet;
