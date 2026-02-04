module.exports = (sequelize, DataTypes) => {
  const IndividualMaster = sequelize.define('IndividualMaster', {
    individual_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    ucic_id: { type: DataTypes.BIGINT, allowNull: false },
    full_name: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('M','F') },
    mobile: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING }
  }, { timestamps: true, createdAt: 'created_at', updatedAt: false, underscored: true, tableName: 'individual_master' });

  IndividualMaster.associate = (models) => {
    IndividualMaster.belongsTo(models.UCICMaster, { foreignKey: 'ucic_id' });
    IndividualMaster.hasMany(models.IndividualKYC, { as: 'kycs', foreignKey: 'individual_id' });
  };

  return IndividualMaster;
};