import { Card, Grid, CardHeader, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import React, { useEffect, useState } from "react";
import PerformanceBar from "src/components/operators/Operator/utils/PerformaceBar";
import { useLazyQuery } from '@apollo/client';
import stationsQuery from "src/graphQL/stations/getStations";
import { get } from 'lodash';
import Filters, { Stations } from '../../../components/operators/Operator/utils/Filters/index';
import { useRouter } from "next/router";
import compose from '../../../utils/compose';
import { auth } from '../../../utils/ssrUtils';

const Page = () => {
  const [value, setValue] = useState(0);
  const router = useRouter();
  const { id: name } = router.query;
  const [cpo, setCPO] = useState(name);
  const [cpos, setCPOs] = useState([]);
  const [station, setStation] = useState('');
  const [stations, setStations] = useState([]);
  const [date, setDate] = useState('');
  const [open, setOpen] = React.useState(false);
  const [year, setYear] = useState();

  const handleChangeYear = (event) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    if (year === undefined) {
      setYear('2024')
    }
  })

  const [loadStations, { data: stationsList }] = useLazyQuery(stationsQuery, {
    variables: {
      pagination: {
        page: 1,
        limit: 1000
      },
      filter: {
        cpoId: name
      }
    }
  });

  useEffect(() => {
    if (name) {
      loadStations();
    }
  }, [name]);


  useEffect(() => {
    if (stationsList) {
      const list = get(stationsList, 'Stations.docs', []);
      let mappedData = list.map((item) => {
        return { label: item.name || '', name: item.name || '', ...item };
      });
      mappedData = mappedData.filter((item) => item.name);
      setStations(mappedData);
    }
  }, [stationsList]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 2,
      }}
    >
      <Grid container spacing={1}>
        <Filters
          cpo={cpo}
          setCPO={setCPO}
          open={open}
          setOpen={setOpen}
          station={station}
          setStation={setStation}
          date={date}
          setDate={setDate}
        />
        <Grid item md={12}>
          <Card>
            <CardHeader
              sx={{ padding: '15px 20px 10px' }}
              subheader="Filters"
              action={
                <Grid container>
                  <Stations
                    station={station}
                    setStation={setStation}
                    stations={stations}
                  />
                  <FormControl sx={{ width: '250px', marginX: '2px' }}>
                    <InputLabel id="demo-simple-select-label">Year</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      size='small'
                      defaultValue={'2024'}
                      value={year}
                      label="Year"
                      onChange={handleChangeYear}
                    >
                      <MenuItem value={'2024'}>2024</MenuItem>
                      <MenuItem value={'2023'}>2023</MenuItem>
                      <MenuItem value={'2022'}>2022</MenuItem>
                      <MenuItem value={'2021'}>2021</MenuItem>
                      <MenuItem value={'2020'}>2020</MenuItem>
                      <MenuItem value={'2019'}>2019</MenuItem>
                      <MenuItem value={'2018'}>2018</MenuItem>
                      <MenuItem value={'2017'}>2017</MenuItem>
                      <MenuItem value={'2016'}>2016</MenuItem>
                      <MenuItem value={'2015'}>2015</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              }
            />
            <PerformanceBar
              cpoId={name}
              stationId={get(station, 'id', '')}
              year={year}
            />

          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
export const getServerSideProps = compose(auth);