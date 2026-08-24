/* API Methods */
export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const DELETE = 'delete';

// export const BaseURL = 'http://localhost:3030/api/'
// export const BaseURL= 'https://backend-hr-management-vcxb.onrender.com/api/'
export const BaseURL = 'http://135.235.218.223:3030/api/'

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
    editProjectData: '/editproject',

    /* Asset Management */
    addAsset: '/asset/add',
    editAsset: '/asset/edit',
    deleteAsset: '/asset/delete',
    retireAsset: '/asset/retire',
    markDeadAsset: '/asset/markdead',
    getAssetById: '/asset/get',
    getAllAssets: '/asset/getall',
    searchAsset: '/asset/search',
    getAssetsByEmpId: '/asset/getbyempid',
    getEmployeeAssetHistory: '/asset/employeehistory',
    assignAsset: '/asset/assign',
    returnAsset: '/asset/return',
    transferAsset: '/asset/transfer',
    getAssetHistory: '/asset/history',
    getAssetCategories: '/asset/categories',
    importAssetRegister: '/asset/import/upload',

    /* Asset Maintenance */
    addMaintenance: '/asset/maintenance/add',
    updateMaintenance: '/asset/maintenance/update',
    getMaintenance: '/asset/maintenance/get',

    /* Asset Dashboard */
    getAssetCountByStatus: '/asset/dashboard/countbystatus',
    getAssetCountByCategory: '/asset/dashboard/countbycategory',
    getWarrantyExpiring: '/asset/dashboard/warrantyexpiring',
    getAssetOverview: '/asset/dashboard/overview'

};
