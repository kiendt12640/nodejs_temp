const searchAcc = (phoneNumber, password) => {
  return `
        SELECT *, nv.id as nv_id
        FROM nv
        WHERE phoneNumber = ${phoneNumber}`;
};

module.exports = { searchAcc, insertAcc };
