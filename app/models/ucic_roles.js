module.exports = (sequelize, DataTypes) => {
  const UcicRoles = sequelize.define('UcicRoles', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    ucic_id: { type: DataTypes.BIGINT, allowNull: false },
    application_id: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('BORROWER','CO_BORROWER','GUARANTOR'), allowNull: false },
    kyc_flag: { type: DataTypes.ENUM('NONE','REVIEW','APPROVED','REJECTED'), defaultValue: 'NONE' }
  }, { timestamps: true, createdAt: 'created_at', updatedAt: false, underscored: true, tableName: 'ucic_roles' });

  UcicRoles.associate = (models) => {
    UcicRoles.belongsTo(models.UCICMaster, { foreignKey: 'ucic_id' });
  };

  return UcicRoles;
};