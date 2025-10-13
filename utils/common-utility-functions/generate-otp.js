function generateOTP() {
    const getRandomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const getRandomDigit = () => Math.floor(Math.random() * 10).toString();

    const letters = Array.from({ length: 3 }, getRandomLetter);
    const digits = Array.from({ length: 3 }, getRandomDigit);

    const otpArray = [...letters, ...digits];

    for (let i = otpArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otpArray[i], otpArray[j]] = [otpArray[j], otpArray[i]];
    }

    return otpArray.join('');
}

module.exports = generateOTP;