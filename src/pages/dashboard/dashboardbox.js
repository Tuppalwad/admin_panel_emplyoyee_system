import React, { useEffect, useState } from 'react';
import HeadingBox from '../../components/dashboard/HeadingBox';
import ProjectStatusGraph from '../../components/dashboard/ProjectStatusGraph';
import TeamProductivityGraph from '../../components/dashboard/TeamProductivityGraph';
import KeyMetricsGraph from '../../components/dashboard/KeyMetricsGraph';
import AttendanceGraph from '../../components/dashboard/AttendanceGraph';
import { useDispatch } from 'react-redux';
import { getDashboardCountdata } from '../../redux/actions/dashboardAction';

function Dashboardbox() {

    const [countData, setCountData] = useState({
        totalEmployees: 0,
        clientCount: 0,
        employeesOnLeave: 0,
        onGoingProject: 0
    })
    const dispatch = useDispatch();
    const getCountData = async () => {
        try {
            const res = await dispatch(getDashboardCountdata())
            if (res?.status == "success") {
                setCountData({
                    totalEmployees: res.data.totalUsers,
                    clientCount: res.data.totalAdmins,
                    employeesOnLeave: res.data.totalLeaves,
                    onGoingProject: res.data.totalProjects
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCountData();
    }, [])

    return (
        <div className="bg-gray-100 min-h-screen p-6 w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="flex flex-row justify-between my-6 gap-4">
                 
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> */}
                    <HeadingBox
                        title="Employees"
                        count={countData.totalEmployees}
                        icon="fas fa-users"
                        color="from-blue-500 to-cyan-500"
                        link="/dashboard/employee/view"
                    />

                    <HeadingBox
                        title="Projects"
                        count={countData.onGoingProject}
                        icon="fas fa-briefcase"
                        color="from-purple-500 to-pink-500"
                        link="/dashboard/project/view"
                    />

                    <HeadingBox
                        title="Attendance"
                        count={countData.employeesOnLeave}
                        icon="fas fa-calendar-check"
                        color="from-green-500 to-emerald-500"
                        link="/dashboard/attendance/today_attendance"
                    />

                    {/* <HeadingBox
                        title="Pending Tasks"
                        count={15}
                        icon="fas fa-tasks"
                        color="from-orange-500 to-red-500"
                        link="/dashboard/task"
                    /> */}
                {/* </div> */}

            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AttendanceGraph />
                <ProjectStatusGraph />
                <TeamProductivityGraph />
                <KeyMetricsGraph />
            </div>

        </div>
    );
}

export default Dashboardbox;
