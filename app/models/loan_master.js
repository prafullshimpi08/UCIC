module.exports = (sequelize, DataTypes) => {
  const LoanMaster = sequelize.define('LoanMaster', {
    loan_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    ucic_id: { type: DataTypes.BIGINT, allowNull: false },
    application_id: { type: DataTypes.STRING, allowNull: false },
    loan_amount: { type: DataTypes.FLOAT, allowNull: false },
    loan_type: { type: DataTypes.STRING }
  }, { timestamps: true, createdAt: 'created_at', updatedAt: false, underscored: true, tableName: 'loan_master' });

  LoanMaster.associate = (models) => {
    LoanMaster.belongsTo(models.UCICMaster, { foreignKey: 'ucic_id' });
  };

  return LoanMaster;
};