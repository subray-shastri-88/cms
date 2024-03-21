import { useState, useEffect } from 'react';
import constate from 'constate';
import { get } from 'lodash';
import fetchPartners from '../../graphQL/cpo/autoComplete';
import { useQuery, useLazyQuery } from '@apollo/client';
import contextWrapper from '../../utils/withContextWrapper';

function useCpoContext() {
  const { loadCPOs, loadISOs, loadAllPartners } = fetchPartners;

  const [cpos, setCpoList] = useState([]);
  const [paginationData, setPgData] = useState({});

  const [iso, setIsoList] = useState([]);
  const [isoPaginationData, setIsoPgData] = useState({});

  const [allPartners, setPartners] = useState([]);
  const [allCpos, setAllCpoList] = useState([]);

  const { data: cpoAutoCompleteData, refetch } = useQuery(loadCPOs, {
    variables: {
      pagination: {
        page: 1,
        limit: 10
      }
    }
  });

  const [loadISO, { data: isoList, refetch: fetchIsoWithPagination }] =
    useLazyQuery(loadISOs, {
      variables: {
        pagination: {
          page: 1,
          limit: 10
        }
      }
    });

  const [loadAllCpos, { data: cpoCompleteData }] = useLazyQuery(
    loadAllPartners,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 200
        }
      }
    }
  );

  const loadCpoList = (page = 1) => {
    refetch({
      pagination: {
        page: page,
        limit: 10
      }
    });
  };

  const loadIsoList = (page = 1) => {
    fetchIsoWithPagination({
      pagination: {
        page: page,
        limit: 10
      }
    });
  };

  useEffect(() => {
    const data = get(cpoAutoCompleteData, 'cpo.docs', []);
    setPgData(get(cpoAutoCompleteData, 'cpo.pagination', {}));
    let mappedData = data.map((item) => {
      return { label: item.name || '', name: item.name || '', ...item };
    });
    mappedData = mappedData.filter((item) => item.name);
    setCpoList(mappedData);
  }, [cpoAutoCompleteData]);

  useEffect(() => {
    const data = get(isoList, 'iso.docs', []);
    setIsoPgData(get(cpoAutoCompleteData, 'iso.pagination', {}));
    let mappedData = data.map((item) => {
      return { label: item.name || '', name: item.name || '', ...item };
    });
    mappedData = mappedData.filter((item) => item.name);
    setIsoList(mappedData);
  }, [isoList]);

  useEffect(() => {
    const data = get(cpoCompleteData, 'all.docs', []);
    let mappedData = data.map((item) => {
      return { label: item.name || '', name: item.name || '', ...item };
    });
    mappedData = mappedData.filter((item) => item.name);
    setPartners(mappedData);
  }, [cpoCompleteData]);

  return {
    cpos,
    iso,
    allPartners,
    paginationData,
    setCpoList,
    loadCpoList,
    loadIsoList,
    allCpos,
    loadAllCpos,
    loadISO,
    isoPaginationData
  };
}

const [CpoCtxProvider, CpoContext] = constate(useCpoContext);

const WithCpoCtx = (WrappedComponent) =>
  contextWrapper(WrappedComponent, CpoContext, 'WithCpoCtx');

export default CpoCtxProvider;
export { WithCpoCtx };
