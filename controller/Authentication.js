const UserMasterService = require("../service/auth/UserMasterService");
const { generateToken } = require("../middleware/generateJwt");

exports.generateOtp = async (req, res) => {
    try {
        const body = req.body;
        if (!body || body.length === 0) return res.status(400).send({ success: false, message: `Contact number not received for sending OTP.` });
        const { contactNumber } = body;
        if (!contactNumber) return res.status(400).send({ success: false, message: `Phone Number is not provided.` });
        const generatedOtp = await UserMasterService.generateUserOtp(contactNumber);
        if (!generatedOtp.success) return res.status(generatedOtp.statusCode).send({ success: false, message: generatedOtp.message });
        return res.status(generatedOtp.statusCode).send({ success: true, message: generatedOtp.message });
    } catch (e) {
        return { success: false, message: `Error occurred while generating OTP: ${e.message}.`, statusCode: 500 };
    }
}

exports.validateOtp = async (req, res) => {
    try {
        const body = req.body;
        if (!body || body.length === 0) return res.status(400).send({ success: false, message: `No data received for validating OTP.` });
        const { contactNumber, otp } = body;
        if (!contactNumber || !otp) return res.status(400).send({ success: false, message: `Either phone number of OTP has not been sent.` });
        const validatedOtp = await UserMasterService.validateOtp(contactNumber, otp);
        if (!validatedOtp.success) return res.status(validatedOtp.statusCode).send({ success: false, message: validatedOtp.message });
        const token = generateToken({ userId: validatedOtp.message });
        if (!token.success) return res.status(token.statusCode).send({ success: false, message: token.message });
        return res.status(token.statusCode).send({ success: true, message: `User has been verified successfully.`, token: token.message, contactNumber: contactNumber });
    } catch (e) {
        return { success: false, message: `Error validating OTP. Please try again ${e.message}.`, statusCode: 500 };
    }
}