const UserMasterService = require("../service/auth/UserMasterService");

exports.generateOtp = async (req, res) => {
    try {
        const body = req.body;
        if (!body || body.length === 0) return res.status(400).send({ success: false, message: `Request body cannot be empty.` });
        const { contactNumber } = body;
        if (!contactNumber) return res.status(400).send({ success: false, message: `Contact Number is not provided.` });
        const generatedOtp = await UserMasterService.generateUserOtp(contactNumber);
        if (!generatedOtp.success) return res.status(generatedOtp.statusCode).send({ success: false, message: generatedOtp.message });
        return res.status(generatedOtp.statusCode).send({ success: true, message: generatedOtp.message });
    } catch (e) {
        return { success: false, message: `Error occurred while generating OTP: ${e.message}.`, statusCode: 500 };
    }
}