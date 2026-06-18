// ordersFilterSchema.js
export const ordersFilterSchema = [
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'ID, Customer, SKU...',
    grid: { xs: 12, sm: 5 }
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'all', label: 'All Status' },
      { value: 'pending', label: 'Pending' },
      { value: 'completed', label: 'Completed' }
    ],
    grid: { xs: 6, sm: 2 }
  },
  {
    key: 'dateRange',
    label: 'Period',
    type: 'select',
    options: [
      { value: '7d', label: 'Last 7 Days' },
      { value: '30d', label: 'Last 30 Days' }
    ],
    grid: { xs: 6, sm: 2 }
  }
];
