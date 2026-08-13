import { jwtDecode } from 'jwt-decode';

/* The asset backend expects the acting admin's email in `assignedBy` — the auth
   middleware does not attach admin identity, so the frontend has to send it. */
export const getLoggedInEmail = () => {
    try {
        const token = localStorage.getItem('token') || '';
        return jwtDecode(token)?.email || '';
    } catch (error) {
        console.log(error);
        return '';
    }
};

export const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB');
};

/* Used to prefill <input type="date"> values on the edit form */
export const formatInputDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const statusColor = (status) => {
    switch (status) {
        case 'Available':
            return 'bg-green-100 text-green-700';
        case 'Assigned':
            return 'bg-blue-100 text-blue-700';
        case 'UnderMaintenance':
            return 'bg-yellow-100 text-yellow-700';
        case 'Lost':
            return 'bg-red-100 text-red-700';
        case 'Retired':
            return 'bg-slate-200 text-slate-700';
        /* Dead means broken, not formally written off — kept visually distinct
           from both Retired (end of service life) and Lost. */
        case 'Dead':
            return 'bg-red-600 text-white';
        default:
            return 'bg-slate-100 text-slate-700';
    }
};

export const conditionColor = (condition) => {
    switch (condition) {
        case 'New':
            return 'bg-emerald-100 text-emerald-700';
        case 'Good':
            return 'bg-green-100 text-green-700';
        case 'Fair':
            return 'bg-yellow-100 text-yellow-700';
        case 'Damaged':
            return 'bg-orange-100 text-orange-700';
        case 'Beyond Repair':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-slate-100 text-slate-700';
    }
};

export const maintenanceStatusColor = (status) => {
    switch (status) {
        case 'Pending':
            return 'bg-yellow-100 text-yellow-700';
        case 'InProgress':
            return 'bg-blue-100 text-blue-700';
        case 'Resolved':
            return 'bg-green-100 text-green-700';
        default:
            return 'bg-slate-100 text-slate-700';
    }
};

/* Lifecycle: Available -> Assigned -> (Available | UnderMaintenance) -> Retired.
   Retired and Lost are terminal, so the whole asset renders read-only there. */
export const isTerminalStatus = (status) => status === 'Retired' || status === 'Lost';

/* An asset can only be deleted while it has never been assigned — otherwise retire it. */
export const canDeleteAsset = (asset) => !asset?.assignmentHistory?.length;

/* A return does not always put the asset back into available stock — the backend
   diverts it to UnderMaintenance when it comes back Damaged or Beyond Repair. The
   confirmation reports what actually happened rather than assuming. */
export const returnSuccessMessage = (updatedAsset) =>
    updatedAsset?.status === 'UnderMaintenance'
        ? 'Asset Returned — sent to Under Maintenance, not back to available stock'
        : 'Asset Returned — back in available stock';

export const assetActionState = (asset) => {
    const status = asset?.status;
    const terminal = isTerminalStatus(status);

    return {
        canEdit: !terminal,
        canAssign: status === 'Available',
        canReturn: status === 'Assigned',
        canTransfer: status === 'Assigned',
        canRetire: !terminal && status !== 'Assigned',
        /* Dead is not terminal — a dead asset can still be formally retired later,
           and the backend applies the same "return it first" guard as retire. */
        canMarkDead: !terminal && status !== 'Assigned' && status !== 'Dead',
        canDelete: !terminal && canDeleteAsset(asset),
        canAddMaintenance: !terminal && status !== 'Assigned'
    };
};
