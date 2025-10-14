const db = require('../../utils/database/db-init').db;
const OtpDetails = db.OtpDetails;

const OtpDetailsService = {

    async createRecord(otpRecord, t) {
        try {
            const createdRecord = await OtpDetails.create(otpRecord, {
                transaction: t
            });
            return { success: true, message: createdRecord, statusCode: 201 };
        } catch (e) {
            return { success: false, message: `Error occurred while creating OTP Record.`, statusCode: 500 };
        }
    },

    async updateRecord(otpRecord, t) {
        try {
            const updatedRecord = await OtpDetails.update(otpRecord, {
                transaction: t,
                returning: true,
                where: {
                    otpId : otpRecord.otpId
                }
            });
            return { success: true, message: updatedRecord[1][0], statusCode: 201 };
        } catch (e) {
            return { success: false, message: `Error occurred while updating OTP Record.`, statusCode: 500 };
        }
    },

    async fetchLatestAndActiveOtp(userId) {
        try {
            const record = await OtpDetails.findOne({
                where: {
                    isActive: true,
                    latest: true,
                    userId: userId
                },
                raw: true,
                order: [['createdAt', 'DESC']]
            });
            if (!record || record.length === 0) return { success: false, message: `Please retry sending OTP again.`, statusCode: 404 };
            return { success: true, message: record, statusCode: 200 };
        } catch (e) {
            return { success: false, message: `Error occurred while fetching OTP Record.`, statusCode: 500 };
        }
    },

    async findAllOtpOnUserId(userId) {
        try {
            const records = await OtpDetails.findAll({
                where: {
                    userId: userId
                },
                raw: true
            });
            if (records.length === 0) return { success: true, message: records, statusCode: 404 };
            return { success: true, message: records, statusCode: 200 };
        } catch (e) {
            return { success: false, message: `Error occurred while fetching OTP Details on User Id.`, statusCode: 500 };
        }
    },

    async updateOtpDetailsOnUserId(otpDetails, t, userId) {
        try {
            const updatedDetails = await OtpDetails.update(otpDetails, {
                where: {
                    userId: userId
                },
                transaction: t,
                returning: true
            });
            return { success: true, message: updatedDetails, statusCode: 201 };
        } catch (e) {
            return { success: false, message: `Error occurred while updating OTP Details on User ID.`, statusCode: 500 };
        }
    }

}

module.exports = OtpDetailsService;