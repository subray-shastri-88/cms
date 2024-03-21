const operators = [
  {
    id: 'CPO1',
    name: 'BESCOM',
    type: 'Public',
    stations: 74,
    machines: 136,
    city: 'Bengaluru',
    revenue: 'Plan 1'
  },
  {
    id: 'CPO2',
    name: 'SHELL',
    type: 'Fuel',
    stations: 70,
    machines: 150,
    city: 'Bengaluru',
    revenue: 'Plan 2'
  },
  {
    id: 'CPO3',
    name: 'TVS',
    type: 'Motor',
    stations: 40,
    machines: 250,
    city: 'Bengaluru',
    revenue: 'Plan 3'
  },
  {
    id: 'CPO4',
    name: 'TATA',
    type: 'Motor',
    stations: 40,
    machines: 250,
    city: 'Bengaluru',
    revenue: 'Plan 3'
  }
];

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
  labels: ['BESCOM', 'SHELL', 'TVS']
};

const totalRevenue = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Revenue Generated From All CPO',
      data: [63, 15, 22, 63, 15, 22, 70],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    }
  ]
};

const revenue = {
  labels: ['BESCOM', 'SHELL', 'TVS'],

  datasets: [
    {
      label: 'Revenue from CPO',
      data: [40, 11, 3],

      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ]
    }
  ]
};

export { operators, powerTypes, revenue, totalRevenue };
