export const navItems = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    icon: 'fa-tachometer-alt',
    view: ["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"],
    // subView:["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"],
    paths: ['/dashboard']
  },
  {
    key: 'employee',
    title: 'Employee',
    icon: 'fa-users',
    view: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"],
    paths: ['/dashboard/employee/add', '/dashboard/employee/view'],

    subNav: [
      { title: 'Add Employee', path: '/dashboard/employee/add', subView: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"] },
      { title: 'Manage Employees', path: '/dashboard/employee/view', subView: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"] },
      { title: 'View Employees Info', path: '/dashboard/employee/viewinfo', subView: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"] }
    ]
  },
  {
    key: 'project',
    title: 'Project',
    icon: 'fa-project-diagram',
    view: ["CEO", "MANAGER", "FOUNDER", "CO-FOUNDER"],
    paths: ['/dashboard/project/add', '/dashboard/project/view'],

    subNav: [
      { title: 'Add Project', path: '/dashboard/project/add', subView: ["CEO", "FOUNDER", "CO-FOUNDER", "MANAGER"] },
      { title: 'View Projects', path: '/dashboard/project/view', subView: ["CEO", "FOUNDER", "CO-FOUNDER", "MANAGER"] },
      // { title: 'Manage Projects', path: '/dashboard/project/manage', subView: ["CEO", "FOUNDER", "CO-FOUNDER", "MANAGER"] }

    ]
  },
  {
    key: 'asset',
    title: 'Asset Management',
    icon: 'fa-laptop',
    view: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"],
    paths: ['/dashboard/asset/dashboard', '/dashboard/asset/add', '/dashboard/asset/view', '/dashboard/asset/employee', '/dashboard/asset/import'],

    subNav: [
      { title: 'Asset Dashboard', path: '/dashboard/asset/dashboard', subView: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"] },
      { title: 'Add Asset', path: '/dashboard/asset/add', subView: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"] },
      { title: 'View Assets', path: '/dashboard/asset/view', subView: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"] },
      { title: 'Employee Assets', path: '/dashboard/asset/employee', subView: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"] },
      // One-time legacy spreadsheet import — kept last, out of the day-to-day flow
      { title: 'Import Register', path: '/dashboard/asset/import', subView: ["CEO", "HR", "FOUNDER", "CO-FOUNDER"] }
    ]
  },
  {
    key: 'attendance',
    title: 'Attendance',
    icon: 'fa-user-clock',
    view: ["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"],
    paths: ['/dashboard/attendance/today_attendance', '/dashboard/attendance/monthly_attendance'],
    subNav: [
      { title: 'Today Attendance', path: '/dashboard/attendance/today_attendance', subView: ["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"] },
      { title: 'View Monthly', path: '/dashboard/attendance/monthly_attendance', subView: ["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"] }
    ]
  },
  {
    key: 'leave',
    title: 'Leave Management',
    icon: 'fa-calendar-alt',
    view: ["HR", "MANAGER","CEO"],
    paths: ['/dashboard/leave/leave_request', '/dashboard/leave/view'],

    subNav: [
      { title: 'Leave Request', path: '/dashboard/leave/leave_request', subView: ["HR", "MANAGER","CEO"] },
      // { title: 'View Leaves', path: '/dashboard/leave/view', subView: ["HR", "MANAGER","CEO"] }
    ]
  },
  // {
  //   key: 'client',
  //   title: 'Client',
  //   icon: 'fa-user-tie',
  //   view: ["CEO", "FOUNDER", "CO-FOUNDER"],
  //   paths: ['/dashboard/client/add', '/dashboard/client/view'],
  //   subNav: [
  //     { title: 'Add Client', path: '/dashboard/client/add', subView: ["CEO", "FOUNDER", "CO-FOUNDER"], },
  //     { title: 'View Clients', path: '/dashboard/client/view', subView: ["CEO", "FOUNDER", "CO-FOUNDER", "HR", "MANAGER",], }
  //   ]
  // },
  // {
  //   key: 'settings',
  //   title: 'Settings',
  //   icon: 'fa-cog',
  //   paths: ['/settings'],
  //   view: ["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"],
  //   // subView:["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"]
  // }
];