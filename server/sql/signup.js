const searchAcc = () => {
  return `
      SELECT *, nv.id as nv_id
      FROM nv
      INNER JOIN trangthai
      ON nv.trangthaiID = trangthai.id`;
};

const insertAcc = "INSERT INTO nv SET ?";

module.exports = { searchAcc, insertAcc };
