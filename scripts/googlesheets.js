class GoogleSheetsManager {
    constructor(config) {
        this.config = config;
        this.cache = null;
        this.lastFetch = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async loadData(forceRefresh = false) {
        // Check cache first
        if (!forceRefresh && this.cache && this.lastFetch) {
            const age = Date.now() - this.lastFetch;
            if (age < this.cacheTimeout) {
                return this.cache;
            }
        }

        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${this.config.range}?key=${this.config.apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                const rows = data.values.slice(1);
                
                this.cache = rows.map(row => {
                    const tenant = {};
                    headers.forEach((header, index) => {
                        const key = this.normalizeColumnName(header);
                        tenant[key] = row[index] || '';
                    });
                    return tenant;
                });
                
                this.lastFetch = Date.now();
                return this.cache;
            }
            
            return [];
            
        } catch (error) {
            console.error('Error loading from Google Sheets:', error);
            throw error;
        }
    }

    normalizeColumnName(header) {
        const mapping = {
            'Room No.': 'roomNo',
            'Tenant Name': 'tenantName',
            'Start/Renewal of Tenancy ': 'startDate',
            'End of Tenancy Aggreement': 'endDate',
            'Total Amount Due (GHC)': 'amountDue',
            'Total Amount Paid (GHC)': 'amountPaid',
            'Rent Balance (GHC)': 'rentBalance',
            'Tel Number': 'phoneNumber',
            'ECG Meter No.': 'ecgMeter',
            'E-Mail': 'email',
            'Link To Tenant Info': 'link',
            'Notes': 'notes'
        };
        return mapping[header] || header.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    async updateRow(rowIndex, data) {
        // This would require Google Apps Script or backend service
        // for write operations due to CORS and authentication requirements
        console.log('Update operation would be sent to backend service', { rowIndex, data });
    }

    async addRow(data) {
        // This would require Google Apps Script or backend service
        console.log('Add operation would be sent to backend service', data);
    }

    async deleteRow(rowIndex) {
        // This would require Google Apps Script or backend service
        console.log('Delete operation would be sent to backend service', { rowIndex });
    }
}