import React from 'react';
import HeadingBox from '../../components/dashboard/HeadingBox';
import ProjectStatusGraph from '../../components/dashboard/ProjectStatusGraph';
import TeamProductivityGraph from '../../components/dashboard/TeamProductivityGraph';
import KeyMetricsGraph from '../../components/dashboard/KeyMetricsGraph';
import AttendanceGraph from '../../components/dashboard/AttendanceGraph';

function Dashboardbox() {
    const totalEmployees = 100;
    const attendanceCount = 80;
    const workingProjects = 20;
    const employeesOnLeave = 20;
    const onGoingProject = 122

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="flex flex-row justify-between">
                <HeadingBox title="Total Employees" count={totalEmployees} />
                <HeadingBox title="Projects Count" count={onGoingProject} />
                <HeadingBox title="Working on Projects" count={workingProjects} />
                <HeadingBox title="Employees on Leave" count={employeesOnLeave} />

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
