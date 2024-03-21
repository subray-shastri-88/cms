import faker from 'faker';

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const chargerTypes = {
  labels: ['AC', 'DC'],

  datasets: [
    {
      label: 'No of Chargers',
      data: [40, 11],

      backgroundColor: ['rgba(63, 81, 181, 0.8)', 'rgba(75, 192, 192, 0.8)']
    }
  ]
};

const newChargers = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],

  datasets: [
    {
      label: 'AC',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 }))
    },
    {
      label: 'DC',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgb(63, 81, 181)'
    }
  ]
};

const powerTypes = {
  datasets: [
    {
      data: [63, 15, 22],
      backgroundColor: [
        'rgb(251, 140, 0, 0.8)',
        'rgb(229, 57, 53, 0.8)',
        'rgb(63, 81, 181, 0.8)'
      ],
      borderWidth: 8,
      borderColor: '#FFFFFF',
      hoverBorderColor: '#FFFFFF'
    }
  ],
  labels: ['15KW', '25KW', '50KW']
};

const plugTypes = {
  labels: ['CCS', 'CHAdeMO', 'GB/T', 'TESLA'],

  datasets: [
    {
      label: 'No of Plugs',
      data: [40, 11, 3, 5],

      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ]
    }
  ]
};

const acPlugTypes = {
  labels: ['Type-1', 'Type-2'],

  datasets: [
    {
      label: 'No of Plugs',
      data: [40, 11],

      backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(75, 192, 192, 0.8)']
    }
  ]
};

const data = { chargerTypes, acPlugTypes, plugTypes, powerTypes, newChargers };

export default data;
