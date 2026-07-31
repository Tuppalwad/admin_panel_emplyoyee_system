/* API Methods */
export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const DELETE = 'delete';

// export const BaseURL = 'http://localhost:3030/api/'
export const BaseURL= 'https://backend-hr-management-vcxb.onrender.com/api/' 


export const api = {
    getAllEmployee: "/getallusers",
    setEmployee: "/adduser",
    deleteEmployee: "/deleteuser",
    closeEmployyeeAccount:'/closeaccount',
    updateEmployee: "/editadmin",
    updateEmp:'/edituser',
    getEmployeeeById: "/getuser",
    setAdminInfo: "/setadmininfo",
    getAdminInfo: "/getadmin",
    getAllEmployeeinfo: '/getallemployeeinfo',
    getEmpOnSearch:'/searchinfo',
    updateEmpinfostatus: '/updateuserinfostatus',
    getemployeeattendanceToday: '/getemployeeattendanceToday',
    getemployeeattendanceInfo: '/getemployeeattendanceinfo',
    getemployeeattendanceMonthly: '/getempMonthlyAttendanceAdmin',
    getAllLeaves: '/getallLeave',
    leaveStatus: '/leaveStatus',
    getDashboardCount: '/getCoutData',
    getDashboardAttendancedata: '/getattendancedata',
    getDashboardProjectData: '/getprojectdata',

    addProject: '/addproject',
    getProject: '/getproject',
    getProjectById: '/getprojectbyid',
    deleteProject: '/deleteproject',
    getManagerList: '/getmanagerlist',
    getProjectsbyEmpId: '/getprojectbyempid',
    editProjectData: '/editproject'

};
