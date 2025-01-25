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
        workingProjects: 0,
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
                    workingProjects: res.data.totalAdmins,
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
    }, [countData])

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="flex flex-row justify-between">
                <HeadingBox title="Total Employees" count={countData.totalEmployees} />
                <HeadingBox title="Projects Count" count={countData.onGoingProject} />
                <HeadingBox title="Working on Projects" count={countData.workingProjects} />
                <HeadingBox title="Employees on Leave" count={countData.employeesOnLeave} />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AttendanceGraph />
                <ProjectStatusGraph />
                <TeamProductivityGraph />
                <KeyMetricsGraph />
            </div>

        </div>
    );
}

export default Dashboardbox;
