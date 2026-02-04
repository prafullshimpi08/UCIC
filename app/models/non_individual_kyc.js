module.exports = (sequelize, DataTypes) => {
  const NonIndividualKYC = sequelize.define('NonIndividualKYC', {
    kyc_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    non_individual_id: { type: DataTypes.BIGINT, allowNull: false },
    pan: { type: DataTypes.STRING, allowNull: false },
    gst: { type: DataTypes.STRING },
    document_type: { type: DataTypes.STRING }
  }, { timestamps: true, createdAt: 'created_at', updatedAt: false, underscored: true, tableName: 'non_individual_kyc' });

  NonIndividualKYC.associate = (models) => {
    NonIndividualKYC.belongsTo(models.NonIndividualMaster, { foreignKey: 'non_individual_id' });
  };

  return NonIndividualKYC;
};