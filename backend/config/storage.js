const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname,'ticket-467912-6909c1bbbd2d.json'), // Fixed path to key file
});

const bucketName = 'oranizers_image'; // Changed to your requested bucket name
const bucket = storage.bucket(bucketName);

module.exports = bucket;
