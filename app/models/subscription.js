module.exports = (sequelize, DataTypes) => {
  const SubscriptionPlan = sequelize.define(
    "subscription_plan",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      plan_name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      monthly_price: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      records_per_month: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      aum_limit_cr: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      number_of_users: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      support_level: {
        type: DataTypes.STRING,
        allowNull: true
      },

      sso_support: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      api_access: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      custom_reports: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      phone_support: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      dedicated_account_manager: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: "ACTIVE"
      }
    },
    {
      tableName: "subscription_plan",
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  );

  SubscriptionPlan.associate = (models) => {
  SubscriptionPlan.hasMany(models.company_subscription, {   
    foreignKey: "subscription_plan_id",
    as: "assignedCompanies",
  });
};



  return SubscriptionPlan;
};
