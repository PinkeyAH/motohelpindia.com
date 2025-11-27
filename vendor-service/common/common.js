// Common functions for the project
// Function to save multiple base64 images
const fs = require('fs');
const path = require('path');
exports.saveMultipleBase64Images = (imagesMap, destFolder) => {
      fs.mkdirSync(destFolder, { recursive: true });
    
      const saved = {};
      for (const [key, dataUri] of Object.entries(imagesMap)) {
        const matches = dataUri.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!matches) throw new Error(`Invalid Data URI for "${key}"`);
        const ext    = matches[1].split('/')[1];           // “jpeg”, “png”, etc.
        const buffer = Buffer.from(matches[2], 'base64');
        const savefile   = path.join(destFolder, `${Date.now()}-${key}.${ext}`);
        const file = `${Date.now()}-${key}.${ext}`;
        fs.writeFileSync(savefile, buffer);
        saved[key] = file;
        console.log(`Saved ${key} to ${file}`);
        
      }
      return saved;
    };

exports.saveSingleBase64Image = (base64, destFolder) => {

    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });

    const match = base64.match(/^data:(.+);base64,(.+)$/);
    const ext = match[1].split("/")[1];
    const buffer = Buffer.from(match[2], "base64");

    const fileName = `cheque_${Date.now()}.${ext}`;
    fs.writeFileSync(path.join(destFolder, fileName), buffer);

    return fileName;
}


    // Generate OTP function

// exports.generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
// };

exports.generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
};


exports.getRandomSixDigitNumber =()=> {
        return Math.floor(100000 + Math.random() * 900000);
      
  }
  
 exports.toSqlTime = (value)=> {
  // Accepts '2025-05-30T20:00:00' or '20:00' or Date object
  if (!value) return null;

  if (value instanceof Date) {
    // format Date to HH:mm:ss
    return value.toTimeString().split(' ')[0];
  }

  if (typeof value === 'string') {
    if (value.length === 5 && value.includes(':')) {
      // HH:mm  => add seconds
      return value + ':00';
    }
    if (value.length >= 8 && value.includes('T')) {
      // ISO datetime string
      return value.split('T')[1].substring(0, 8);
    }
    // Already HH:mm:ss or invalid
    return value;
  }

  return null; // fallback
}

// // Usage example:
// const bidActiveTimeForSql = toSqlTime(data.bid_active_time);

// request.input('bid_active_time', sql.Time(0), bidActiveTimeForSql);


exports.formatDateTime = (input, type = 'datetime') => { 
  // input can be a Date object or ISO string
  if (!input) return null;

  let dateObj;

  if (input instanceof Date) {
    dateObj = input;
  } else if (typeof input === 'string') {
    // Try to parse string into Date
    dateObj = new Date(input);
    if (isNaN(dateObj)) return null;
  } else {
    return null;
  }

  const pad = (n) => (n < 10 ? '0' + n : n);

  const year = dateObj.getFullYear();
  const month = pad(dateObj.getMonth() + 1);
  const day = pad(dateObj.getDate());
  const hours = pad(dateObj.getHours());
  const minutes = pad(dateObj.getMinutes());
  const seconds = pad(dateObj.getSeconds());

  switch (type.toLowerCase()) {
    case 'date':
      // Format: YYYY-MM-DD
      return `${year}-${month}-${day}`;

    case 'time':
      // Format: HH:mm:ss
      return `${hours}:${minutes}:${seconds}`;

    case 'datetime':
    default:
      // Format: YYYY-MM-DD HH:mm:ss
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
