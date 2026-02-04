module.exports = (sequelize, DataTypes) => {
  const UCICMaster = sequelize.define('UCICMaster', {
    ucic_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    ucic_code: { type: DataTypes.STRING, unique: true },
    customer_type: { type: DataTypes.ENUM('INDIVIDUAL','NON_INDIVIDUAL','FAMILY') },
    status: { type: DataTypes.ENUM('ACTIVE','INACTIVE'), defaultValue: 'ACTIVE' }
  }, { timestamps: true, createdAt: 'created_at', updatedAt: false, underscored: true, tableName: 'ucic_master' });

  UCICMaster.associate = (models) => {
    UCICMaster.hasMany(models.IndividualMaster, { as: 'individuals', foreignKey: 'ucic_id' });
    UCICMaster.hasMany(models.NonIndividualMaster, { as: 'nonIndividuals', foreignKey: 'ucic_id' });
    UCICMaster.hasMany(models.UcicRoles, { as: 'roles', foreignKey: 'ucic_id' });
    UCICMaster.hasMany(models.LoanMaster, { as: 'loans', foreignKey: 'ucic_id' });
  };

  return UCICMaster;
};