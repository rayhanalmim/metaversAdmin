export const getTierBadgeColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
        case 'enterprise': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg';
        case 'premium': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg';
        case 'standard': return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg';
        case 'free': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg';
        default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg';
    }
};

export const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'active': return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg';
        case 'trial': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-lg';
        case 'suspended': return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg';
        case 'resolved': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg';
        case 'pending': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg';
        default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg';
    }
};

export const formatDateTime = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleString();
    } catch {
        return 'Invalid date';
    }
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

export const formatNumber = (num: number) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num);
};

export const chartColors = {
    primary: '#1e40af',     // Professional blue
    secondary: '#059669',    // Professional green
    accent: '#7c3aed',      // Professional purple
    warning: '#d97706',     // Professional amber
    danger: '#dc2626',      // Professional red
    info: '#0891b2',        // Professional cyan
    neutral: '#6b7280',     // Professional gray
    gradient: ['#1e40af', '#7c3aed', '#059669', '#d97706', '#dc2626']
};

export const generateCSV = <T extends Record<string, unknown>>(data: T[]): string => {
    if (!data || data.length === 0) {
        return '';
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => JSON.stringify(row[header])).join(',')
        )
    ];
    return csvRows.join('\n');
};

export const downloadCSV = (csvData: string, filename: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}; 