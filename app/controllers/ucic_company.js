const httpStatus = require('http-status');
const response = require('../response');
const db = require('../models');
// const { Op } = require('sequelize');


const listUcics = async (req, res) => {
  try {
    const ucics = await db.UCICMaster.findAll({
      include: [
        { model: db.IndividualMaster, as: 'individuals', include: [{ model: db.IndividualKYC, as: 'kycs' }] },
        { model: db.NonIndividualMaster, as: 'nonIndividuals', include: [{ model: db.NonIndividualKYC, as: 'kycs' }] },
        { model: db.UcicRoles, as: 'roles' },
        { model: db.LoanMaster, as: 'loans' }
      ]
    });

    // counts by customer type
    const individualCount = await db.UCICMaster.count({ where: { customer_type: 'INDIVIDUAL' } });
    const nonIndividualCount = await db.UCICMaster.count({ where: { customer_type: 'NON_INDIVIDUAL' } });
    const totalUcicCount = await db.UCICMaster.count();

    // enrich loans with role and kyc_flag (matched by application_id)
    const ucicsData = ucics.map(ucic => {
      const u = typeof ucic.toJSON === 'function' ? ucic.toJSON() : ucic;
      const roles = u.roles || [];
      u.loans = (u.loans || []).map(loan => {
        const matchedRole = roles.find(r => r.application_id === loan.application_id);
        return {
          ...loan,
          role: matchedRole ? matchedRole.role : null,
          kyc_flag: matchedRole ? matchedRole.kyc_flag : null
        };
      });
      return u;
    });

    return response.success(req, res, { msgCode: 'UCIC_LIST_FETCHED', data: { ucics: ucicsData, counts: { individualCount, nonIndividualCount, totalUcicCount } } }, 200);
  } catch (err) {
    console.error('LIST UCIC ERROR >>>', err);
    return response.error(req, res, { msgCode: 'UCIC_LIST_FETCH_FAILED', data: err.message }, 500);
  }
};









// console.log(db,"////////");

module.exports = {
  listUcics,
}