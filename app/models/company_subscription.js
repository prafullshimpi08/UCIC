// app/models/companySubscription.js
module.exports = (sequelize, DataTypes) => {
  const CompanySubscription = sequelize.define(
    "company_subscription",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      subscription_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "ACTIVE"
      }
    },
    {
      tableName: "company_subscription",
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  );

  CompanySubscription.associate = (models) => {
    CompanySubscription.belongsTo(models.subscription_plan, {   // lowercase
  foreignKey: "subscription_plan_id",
  as: "subscriptionPlan",
});

CompanySubscription.belongsTo(models.company, {   // lowercase
  foreignKey: "company_id",
  as: "company",
});
    };

  return CompanySubscription;
};
