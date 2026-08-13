export const validateAsset = (formData) => {
    const newErrors = {};

    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.modelName) newErrors.modelName = 'Model Name is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase Date is required';

    if (formData.purchaseCost && !/^\d+(\.\d{1,2})?$/.test(formData.purchaseCost)) {
        newErrors.purchaseCost = 'Purchase Cost must be a valid amount';
    }

    if (
        formData.warrantyExpiryDate &&
        formData.purchaseDate &&
        new Date(formData.warrantyExpiryDate) <= new Date(formData.purchaseDate)
    ) {
        newErrors.warrantyExpiryDate = 'Warranty Expiry must be after the Purchase Date';
    }

    return newErrors;
};

export const validateAssign = (formData) => {
    const newErrors = {};

    if (!formData.empId) newErrors.empId = 'Employee is required';
    if (!formData.conditionAtAssign) newErrors.conditionAtAssign = 'Condition at assign is required';

    return newErrors;
};

export const validateReturn = (formData) => {
    const newErrors = {};

    if (!formData.conditionAtReturn) newErrors.conditionAtReturn = 'Condition at return is required';

    return newErrors;
};

export const validateTransfer = (formData) => {
    const newErrors = {};

    if (!formData.newEmpId) newErrors.newEmpId = 'New employee is required';
    if (!formData.conditionAtReturn) newErrors.conditionAtReturn = 'Condition at return is required';
    if (!formData.conditionAtAssign) newErrors.conditionAtAssign = 'Condition at assign is required';

    return newErrors;
};

export const validateMaintenance = (formData) => {
    const newErrors = {};

    if (!formData.issueReported) newErrors.issueReported = 'Issue description is required';

    return newErrors;
};
