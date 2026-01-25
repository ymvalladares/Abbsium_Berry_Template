export const usersFiltersSchema = [
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Editor', value: 'Editor' },
      { label: 'Author', value: 'Author' },
      { label: 'Maintainer', value: 'Maintainer' }
    ]
  },
  {
    key: 'plan',
    label: 'Plan',
    type: 'select',
    options: [
      { label: 'Enterprise', value: 'Enterprise' },
      { label: 'Team', value: 'Team' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Inactive', value: 'Inactive' }
    ]
  },
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search user...'
  }
];
