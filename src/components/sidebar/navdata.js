export const navItems = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: 'fa-tachometer-alt',
      paths: ['/dashboard']
    },
    {
      key: 'employee',
      title: 'Employee',
      icon: 'fa-users',
      paths: ['/dashboard/employee/add', '/dashboard/employee/view'],
      subNav: [
        { title: 'Add Employee', path: '/dashboard/employee/add' },
        { title: 'View Employees', path: '/dashboard/employee/view' },
        {title:'View Employees Info',path:'/dashboard/employee/viewinfo'}
      ]
    },
    {
      key: 'project',
      title: 'Project',
      icon: 'fa-project-diagram',
      paths: ['/dashboard/project/add', '/dashboard/project/view'],
      subNav: [
        { title: 'Add Project', path: '/dashboard/project/add' },
        { title: 'View Projects', path: '/dashboard/project/view' }
      ]
    },
    {
      key: 'attendance',
      title: 'Attendance',
      icon: 'fa-user-clock',
      paths: ['/dashboard/attendance/today_attendance', '/dashboard/attendance/monthly_attendance'],
      subNav: [
        { title: 'Today Attendance', path: '/dashboard/attendance/today_attendance' },
        { title: 'View Monthly', path: '/dashboard/attendance/monthly_attendance' }
      ]
    },
    {
      key: 'leave',
      title: 'Leave Management',
      icon: 'fa-calendar-alt',
      paths: ['/dashboard/leave/leave_request', '/dashboard/leave/view'],
      subNav: [
        { title: 'Leave Request', path: '/dashboard/leave/leave_request' },
        { title: 'View Leaves', path: '/dashboard/leave/view' }
      ]
    },
    {
      key: 'client',
      title: 'Client',
      icon: 'fa-user-tie',
      paths: ['/dashboard/client/add', '/dashboard/client/view'],
      subNav: [
        { title: 'Add Client', path: '/dashboard/client/add' },
        { title: 'View Clients', path: '/dashboard/client/view' }
      ]
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: 'fa-cog',
      paths: ['/settings']
    }
  ];