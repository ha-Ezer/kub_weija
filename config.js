window.TENANCY_CONFIG = {
    // Google Sheets Configuration
    googleSheets: {
        spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
        apiKey: 'YOUR_API_KEY_HERE',
        range: 'KUB Weija!A:L'
    },
    
    // Email Configuration
    email: {
        service: 'emailjs', // or 'custom'
        serviceId: 'YOUR_EMAILJS_SERVICE_ID',
        templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
        publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
        adminEmails: [
            'ntimeben@gmail.com',
            'khalidumab@gmail.com'
        ]
    },
    
    // Notification Settings
    notifications: {
        expiryReminders: {
            enabled: true,
            intervals: [90, 60, 30], // days before expiry
            subject: 'Tenancy Agreement Expiry Reminder'
        },
        rentReminders: {
            enabled: true,
            monthlyReminder: true,
            subject: 'Outstanding Rent Balance Reminder'
        }
    },
    
    // UI Settings
    ui: {
        itemsPerPage: 50,
        autoRefreshInterval: 300000, // 5 minutes
        colorCoding: {
            expiring1Month: '#f5c6cb',
            expiring2Months: '#f8d7da',
            expiring3Months: '#fff3cd',
            rentDue: '#d1ecf1'
        }
    }
};