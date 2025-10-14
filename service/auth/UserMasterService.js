const db = require('../../utils/database/db-init').db;
const { filterData } = require('../../utils/data-filteration/filter-data');
const UserMaster = db.UserMaster;
const OtpDetailsService = require('../notification/OtpService');
const { sequelize } = require("../../utils/database/db");
const generateOTP = require('../../utils/common-utility-functions/generate-otp');
const sendSMS = require('../../utils/twilio-service/sms');

const createUser = async (userDetails, t) => {
    try {
        const savedUserDetails = await UserMaster.create(userDetails, {
            transaction: t,
        });
        return { success: true, message: savedUserDetails, statusCode: 201 };
    } catch (e) {
        return { success: false, message: `Error occurred while creating user.`, statusCode: 500 };
    }
}

const findUserByPhoneNumber = async (phoneNumber) => {
    try {
        const data = await UserMaster.findOne({
            where: {
                phoneNumber: phoneNumber,
            },
            attributes: { exclude: ['createdOn', 'modifiedOn'] },
            raw: true,
        });
        if (!data) return { success: true, statusCode: 204, message: `No data available` };
        return { success: true, statusCode: 200, message: data };
    } catch (e) {
        return { success: false, message: `Error occurred while fetching all active users upon contact numbers.`, statusCode: 500 };
    }
}

const UserMasterService = {

    async findActiveUsers() {
        try {
            const data = await UserMaster.findAll({
                where: {
                    isActive: true,
                },
                attributes: { exclude: ['createdOn', 'modifiedOn'] },
                raw: true,
            });
            if (data.length === 0) return { success: true, statusCode: 204, message: `No data available` };
            return { success: true, statusCode: 200, message: data };
        } catch (e) {
            return { success: false, message: `Error occurred while fetching all active users: ${e.message}`, statusCode: 500 };
        }
    },

    async generateUserOtp(phoneNumber) {
        const t = await sequelize.transaction();
        try {
            const verifyPhoneNumber = await findUserByPhoneNumber(phoneNumber);
            if (!verifyPhoneNumber.success) return verifyPhoneNumber;
            let userId;
            if (verifyPhoneNumber.statusCode === 200) {
                userId = verifyPhoneNumber.message.userId;
                const existingOtpDetails = await OtpDetailsService.findAllOtpOnUserId(userId);
                if (!existingOtpDetails.success) return existingOtpDetails;
                if (existingOtpDetails.statusCode === 200) {
                    const updateExistingRecords = await OtpDetailsService.updateOtpDetailsOnUserId({ latest: false }, t, userId);
                    if (!updateExistingRecords.success) return updateExistingRecords;
                }
            } else {
                const createdUser = await createUser({ phoneNumber: phoneNumber }, t);
                if (!createdUser.success) return createdUser;
                userId = createdUser.message.userId;
            }
            const otp = generateOTP();
            // const sentMessage = await sendSMS(`Your OTP for Tenant Management is: ${otp}.`, phoneNumber);
            // if (!sentMessage.success) return sentMessage;
            // const messageSid = sentMessage.message;
            const messageSid = 'SMe55005d958dcc3a18ae20d861e5d03d1';
            const saveOtp = await OtpDetailsService.createRecord({ otp: otp, messageSid: messageSid, userId: userId }, t);
            if (!saveOtp.success) return saveOtp;
            await t.commit();
            return { success: true, statusCode: 200, message: `OTP has been sent to your mobile successfully.` };
        } catch (e) {
            await t.rollback();
            return { success: false, statusCode: 500, message: `Error occurred while generating otp: ${e.message}.` };
        }
    }

}

module.exports = UserMasterService;