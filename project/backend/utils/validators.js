const validateAadhar = (aadharNumber) => {
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadharNumber);
};

const validatePAN = (panNumber) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(panNumber);
};

const validateDrivingLicense = (dlNumber) => {
  const dlRegex = /^[A-Z]{2}[0-9]{13}$/;
  return dlRegex.test(dlNumber);
};

const validatePassport = (passportNumber) => {
  const passportRegex = /^[A-Z]{1}[0-9]{7}$/;
  return passportRegex.test(passportNumber);
};

const validateIdProof = (type, number) => {
  switch (type) {
    case 'aadhar':
      return validateAadhar(number);
    case 'pan':
      return validatePAN(number);
    case 'driving_license':
      return validateDrivingLicense(number);
    case 'passport':
      return validatePassport(number);
    default:
      return false;
  }
};

const generateBookingReference = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FLX${timestamp}${randomStr}`;
};

module.exports = {
  validateIdProof,
  generateBookingReference,
  validateAadhar,
  validatePAN,
  validateDrivingLicense,
  validatePassport
};
