const formidable = require('formidable');

const parseForm = (req) => {
    return new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm({ keepExtensions: true });
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);

            try {
                fields.updateMap = Array.isArray(fields.updateMap)
                    ? fields.updateMap[0]
                    : fields.updateMap;
            } catch (e) {
                return reject(new Error(`Failed to process updateMap: ${e.message}`));
            }
            resolve({ fields, files });
        });
    });
};

module.exports = {
    parseForm
};