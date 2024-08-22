/* API Methods */
export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const DELETE = 'delete';


export const api = {
    getAllEmployee: "/getallusers",
    setEmployee: "/adduser",
    deleteEmployee: "/deleteuser",
    updateEmployee: "/editadmin",
    getEmployeeeById: "/getuser",
    setAdminInfo: "/setadmininfo",
    getAdminInfo: "/getadmin",
    getAllEmployeeinfo :'/getallemployeeinfo',
    updateEmpinfostatus:'/updateuserinfostatus',
    getemployeeattendanceToday:'/getemployeeattendanceToday',
    getemployeeattendanceInfo:'/getemployeeattendanceinfo',
    getemployeeattendanceMonthly:'/getemployeeattendanceMonthly', 

    getAllLeaves:'/getallLeave',
    leaveStatus:'/leaveStatus',
    
};
