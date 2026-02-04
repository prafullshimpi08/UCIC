module.exports = (sequelize, DataTypes) => {
  const IndividualKYC = sequelize.define(
    "IndividualKYC",
    {
      kyc_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      individual_id: { type: DataTypes.BIGINT, allowNull: false },
      pan: { type: DataTypes.STRING, allowNull: false },
      aadhaar: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: true, createdAt: "created_at", updatedAt: false, underscored: true, tableName: "individual_kyc" },
  );

  IndividualKYC.associate = (models) => {
    IndividualKYC.belongsTo(models.IndividualMaster, { foreignKey: "individual_id" });
  };

  return IndividualKYC;
};
