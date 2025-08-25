class EmailManager {
    constructor(config) {
        this.config = config;
        this.initializeEmailJS();
    }

    initializeEmailJS() {
        if (this.config.service === 'emailjs') {
            emailjs.init(this.config.publicKey);
        }
    }

    async sendExpiryReminder(tenant, daysUntilExpiry) {
        const templateParams = {
            to_email: this.config.adminEmails.join(','),
            tenant_name: tenant.tenantName,
            room_number: tenant.roomNo,
            phone_number: tenant.phoneNumber,
            expiry_date: tenant.endDate,
            days_until_expiry: daysUntilExpiry,
            urgency: this.getUrgencyLevel(daysUntilExpiry)
        };

        try {
            await emailjs.send(
                this.config.serviceId,
                this.config.templateId,
                templateParams
            );
            console.log('Expiry reminder sent for:', tenant.tenantName);
        } catch (error) {
            console.error('Failed to send expiry reminder:', error);
            throw error;
        }
    }

    async sendRentReminder(tenant) {
        const templateParams = {
            to_email: this.config.adminEmails.join(','),
            tenant_name: tenant.tenantName,
            room_number: tenant.roomNo,
            phone_number: tenant.phoneNumber,
            amount_due: tenant.amountDue,
            amount_paid: tenant.amountPaid,
            balance: tenant.rentBalance
        };

        try {
            await emailjs.send(
                this.config.serviceId,
                'rent_reminder_template', // Separate template for rent reminders
                templateParams
            );
            console.log('Rent reminder sent for:', tenant.tenantName);
        } catch (error) {
            console.error('Failed to send rent reminder:', error);
            throw error;
        }
    }

    getUrgencyLevel(days) {
        if (days <= 30) return 'URGENT - 1 Month';
        if (days <= 60) return 'Important - 2 Months';
        if (days <= 90) return 'Notice - 3 Months';
        return 'Low';
    }

    async sendBulkReminders(type, tenants) {
        const results = [];
        
        for (const tenant of tenants) {
            try {
                if (type === 'expiry') {
                    const endDate = new Date(tenant.endDate);
                    const today = new Date();
                    const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                    
                    await this.sendExpiryReminder(tenant, daysUntilExpiry);
                } else if (type === 'rent') {
                    await this.sendRentReminder(tenant);
                }
                
                results.push({ tenant: tenant.tenantName, status: 'sent' });
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                results.push({ tenant: tenant.tenantName, status: 'failed', error: error.message });
            }
        }
        
        return results;
    }
}