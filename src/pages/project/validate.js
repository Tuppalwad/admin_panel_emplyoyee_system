export const validatedata = (formData, isClientProject) => {
    const newErrors = {};
    if (!formData.projectTitle) newErrors.projectTitle = 'Project Title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.projectPriority) newErrors.projectPriority = 'Project Priority is required';
    if (!formData.budget) {
        newErrors.budget = 'Budget is required';
    } else if (!/^\d+$/.test(formData.budget)) {
        newErrors.budget = 'Budget must be a valid integer';
    }
    if (!formData.projectStartDate) newErrors.projectStartDate = 'Project Start Date is required';
    if (!formData.projectEndDate) newErrors.projectEndDate = 'Project End Date is required';
    else if (new Date(formData.projectEndDate) <= new Date(formData.projectStartDate)) {
        newErrors.projectEndDate = 'End Date must be after the Start Date';
    }
    if (!formData.manager) newErrors.manager = 'Manager selection is required';
    if (!formData.teamMembers.length) newErrors.teamMembers = 'At least one team member must be selected';
    if (!formData.workStatus) newErrors.workStatus = 'Work Status is required';
    if (!formData.description) newErrors.description = 'Description is required';

    if (isClientProject) {
        if (!formData.clientFullName) newErrors.clientFullName = 'Client Full Name is required';
        if (!formData.clientNumber) newErrors.clientNumber = 'Client Number is required';
        if (!formData.clientEmail) newErrors.clientEmail = 'Client Email is required';
        if (!formData.clientAddress) newErrors.clientAddress = 'Client Address is required';
    }
    return newErrors;
};
