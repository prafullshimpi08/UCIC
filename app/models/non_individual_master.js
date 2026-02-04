module.exports = (sequelize, DataTypes) => {
  const NonIndividualMaster = sequelize.define('NonIndividualMaster', {
    non_individual_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    ucic_id: { type: DataTypes.BIGINT, allowNull: false },
    org_name: { type: DataTypes.STRING, allowNull: false },
    contact_person: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING }
  }, { timestamps: true, createdAt: 'created_at', updatedAt: false, underscored: true, tableName: 'non_individual_master' });

  NonIndividualMaster.associate = (models) => {
    NonIndividualMaster.belongsTo(models.UCICMaster, { foreignKey: 'ucic_id' });
    NonIndividualMaster.hasMany(models.NonIndividualKYC, { as: 'kycs', foreignKey: 'non_individual_id' });
  };

  return NonIndividualMaster;
};