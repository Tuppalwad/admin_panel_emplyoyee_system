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
    view: ["CEO", "HR","FOUNDER", "CO-FOUNDER"],
    paths: ['/dashboard/employee/add', '/dashboard/employee/view'],

    subNav: [
      { title: 'Add Employee', path: '/dashboard/employee/add', subView:["CEO", "HR", "FOUNDER", "CO-FOUNDER"] },
      { title: 'View Employees', path: '/dashboard/employee/view', subView:["CEO", "HR", "FOUNDER", "CO-FOUNDER"] },
      { title: 'View Employees Info', path: '/dashboard/employee/viewinfo', subView:["CEO", "HR", "FOUNDER", "CO-FOUNDER"] }
    ]
  },
  {
    key: 'project',
    title: 'Project',
    icon: 'fa-project-diagram',
    view: ["CEO", "MANAGER", "FOUNDER", "HR","CO-FOUNDER"],
    paths: ['/dashboard/project/add', '/dashboard/project/view'],
  
    subNav: [
      { title: 'Add Project', path: '/dashboard/project/add',subView:["CEO","FOUNDER", "CO-FOUNDER"] },
      { title: 'View Projects', path: '/dashboard/project/view' ,subView:["CEO","FOUNDER", "CO-FOUNDER","HR","MANAGER"]}
    ]
  },
  {
    key: 'attendance',
    title: 'Attendance',
    icon: 'fa-user-clock',
    view: ["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"],
    paths: ['/dashboard/attendance/today_attendance', '/dashboard/attendance/monthly_attendance'],
    subNav: [
      { title: 'Today Attendance', path: '/dashboard/attendance/today_attendance', subView:["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"]},
      { title: 'View Monthly', path: '/dashboard/attendance/monthly_attendance',subView:["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"] }
    ]
  },
  {
    key: 'leave',
    title: 'Leave Management',
    icon: 'fa-calendar-alt',
    view: [ "HR", "MANAGER",],
    paths: ['/dashboard/leave/leave_request', '/dashboard/leave/view'],
    
    subNav: [
      { title: 'Leave Request', path: '/dashboard/leave/leave_request' ,subView:[ "HR", "MANAGER"]},
      { title: 'View Leaves', path: '/dashboard/leave/view' ,subView:["HR", "MANAGER"]}
    ]
  },
  {
    key: 'client',
    title: 'Client',
    icon: 'fa-user-tie',
    view: ["CEO",  "FOUNDER", "CO-FOUNDER"],
    paths: ['/dashboard/client/add', '/dashboard/client/view'],
    subNav: [
      { title: 'Add Client', path: '/dashboard/client/add' ,subView:["CEO", "FOUNDER", "CO-FOUNDER"],},
      { title: 'View Clients', path: '/dashboard/client/view',subView:["CEO", "FOUNDER", "CO-FOUNDER","HR", "MANAGER",], }
    ]
  },
  {
    key: 'settings',
    title: 'Settings',
    icon: 'fa-cog',
    paths: ['/settings'],
    view: ["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"],
    // subView:["CEO", "HR", "MANAGER", "FOUNDER", "CO-FOUNDER"]
  }
];