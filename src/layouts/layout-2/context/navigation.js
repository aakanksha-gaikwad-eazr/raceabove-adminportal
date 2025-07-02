// CUSTOM ICON COMPONENT
import duotone from '@/icons/duotone';
export const navigation = [{
  name: 'Dashboards',
  Icon: duotone.PersonChalkboard,
  children: [{
    name: 'Analytics 1',
    path: '/'
  }, {
    name: 'Analytics 2',
    path: '/analytics-2'
  }, {
    name: 'CRM 1',
    path: '/crm'
  }, {
    name: 'CRM 2',
    path: '/crm-2'
  }, {
    name: 'Sales 1',
    path: '/sales'
  }, {
    name: 'Sales 2',
    path: '/sales-2'
  }, {
    name: 'Finance 1',
    path: '/finance'
  }, {
    name: 'Finance 2',
    path: '/finance-2'
  }, {
    name: 'Ecommerce',
    path: '/ecommerce'
  }, {
    name: 'Logistics',
    path: '/logistics'
  }, {
    name: 'Marketing',
    path: '/marketing'
  }, {
    name: 'LMS',
    path: '/learning-management'
  }, {
    name: 'Job Management',
    path: '/job-management'
  }]
}, {
  name: 'Profile',
  Icon: duotone.UserProfile,
  path: '/profile'
}, {
  name: 'Account',
  Icon: duotone.Accounts,
  path: '/account'
},
 {
  name: 'Users',
  Icon: duotone.UserList,
  children: [{

    name: 'Add User',
    path: '/add-user'
  },
  //  {
  //   name: 'User List 1',
  //   path: '/user-list'
  // }, {
  //   name: 'User Grid 1',
  //   path: '/user-grid'
  // }, 
  {
    name: 'User List 2',
    path: '/user-list-2'
  }, {
    name: 'User Grid 2',
    path: '/user-grid-2'
  }]
}, 


 {
  name: 'Admin',
  Icon: duotone.AdminList,
  children: [{
    name: 'Add Admin',
    path: '/add-admin'
  },
   {
    name: 'Admin List 1',
    path: '/admin-list'
  }, {
    name: 'Admin Grid 1',
    path: '/admin-grid'
  }, 
  {
    name: 'Admin List 2',
    path: '/admin-list-2'
  }, {
    name: 'Admin Grid 2',
    path: '/admin-grid-2'
  }]
}, 

// organisers
 {
  name: 'Organisers',
  Icon: duotone.AdminList,
  children: [{
    name: 'Add Organiser',
    path: '/add-organiser'
  },
   {
    name: 'Organiser List 1',
    path: '/organiser-list'
  }, 
  {
    name: 'Organiser Grid 1',
    path: '/organiser-grid'
  }, 
  {
    name: 'Organiser List 2',
    path: '/organiser-list-2'
  }, {
    name: 'Organiser Grid 2',
    path: '/organiser-grid-2'
  }]
}, 
 
{
  name: 'Products',
  Icon: duotone.AdminEcommerce,
  children: [{
    name: 'Product List',
    path: '/product-list'
  }, {
    name: 'Product Grid',
    path: '/product-grid'
  }, 
  // {
  //   name: 'Create Product',
  //   path: '/create-product'
  // }, 
  
  // {
  //   name: 'Product Details',
  //   path: '/product-details'
  // }
]
}, {
  name: 'Invoice',
  Icon: duotone.Invoice,
  children: [{
    name: 'Invoice List',
    path: '/invoice-list'
  }, {
    name: 'Invoice Details',
    path: '/invoice-details'
  }, {
    name: 'Create Invoice',
    path: '/create-invoice'
  }]
}, {
  name: 'Ecommerce',
  Icon: duotone.Ecommerce,
  children: [{
    name: 'Cart',
    path: '/cart'
  }, {
    name: 'Payment',
    path: '/payment'
  }, {
    name: 'Billing Address',
    path: '/billing-address'
  }, {
    name: 'Payment Complete',
    path: '/payment-complete'
  }]
}, {
  name: 'Projects',
  Icon: duotone.ProjectChart,
  children: [{
    name: 'Project 1',
    path: '/projects/version-1'
  }, {
    name: 'Project 2',
    path: '/projects/version-2'
  }, {
    name: 'Project 3',
    path: '/projects/version-3'
  }, {
    name: 'Project Details',
    path: '/projects/details'
  }, {
    name: 'Team Member',
    path: '/projects/team-member'
  }]
}, {
  name: 'Data Table',
  Icon: duotone.DataTable,
  children: [{
    name: 'Data Table 1',
    path: '/data-table-1'
  }]
}, {
  name: 'Todo List',
  Icon: duotone.TodoList,
  path: '/todo-list'
}, {
  name: 'Chats',
  Icon: duotone.Chat,
  path: '/chat'
}, {
  name: 'Email',
  Icon: duotone.Inbox,
  children: [{
    name: 'Inbox',
    path: '/mail/all'
  }, {
    name: 'Email Details',
    path: '/mail/details'
  }, {
    name: 'Create Email',
    path: '/mail/compose'
  }]
}, {
  name: 'Pages',
  Icon: duotone.Pages,
  children: [{
    name: 'About (Admin)',
    path: '/about'
  }, {
    name: 'About (Public)',
    path: '/about-us'
  }, {
    name: 'Career (Admin)',
    path: '/career'
  }, {
    name: 'Career (Public)',
    path: '/career'
  }, {
    name: 'Job Details',
    path: '/career/designer'
  }, {
    name: 'Job Apply',
    path: '/career/apply'
  }, {
    name: 'Shop',
    path: '/products'
  }, {
    name: 'Product Details',
    path: '/products/Wu4GdphiI0F48eMQZ_zBJ'
  }, {
    name: 'Cart',
    path: '/cart'
  }, {
    name: 'Checkout',
    path: '/checkout'
  }, {
    name: 'Faq',
    path: '/faqs'
  }, {
    name: 'Pricing',
    path: '/pricing'
  }, {
    name: 'Support',
    path: '/support'
  }, {
    name: 'Create Ticket',
    path: '/create-ticket'
  }, {
    name: 'File Manager',
    path: '/file-manager'
  }]
}];