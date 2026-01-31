module.exports = (sequelize, DataTypes) => {
  const UcicManage = sequelize.define(
    "ucic_manage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      /* COMPANY DETAILS */
      company_name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      company_type: {
        type: DataTypes.STRING,
        allowNull: true
      },

      registration_number: {
        type: DataTypes.STRING,
        allowNull: true
      },

      pan_number: {
        type: DataTypes.STRING,
        allowNull: true
      },

      gst_number: {
        type: DataTypes.STRING,
        allowNull: true
      },

      /* CONTACT DETAILS */
      contact_person: {
        type: DataTypes.STRING,
        allowNull: true
      },

      designation: {
        type: DataTypes.STRING,
        allowNull: true
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      city: {
        type: DataTypes.STRING,
        allowNull: true
      },

      state: {
        type: DataTypes.STRING,
        allowNull: true
      },

      pincode: {
        type: DataTypes.STRING,
        allowNull: true
      },

      /* BUSINESS DETAILS */
      ucic: {
        type: DataTypes.STRING,
        allowNull: true
      },

      business_type: {
        type: DataTypes.STRING,
        allowNull: true
      },

      business_description: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      annual_turnover_cr: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: true
      },

      employee_count: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      bank_name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      account_number: {
        type: DataTypes.STRING,
        allowNull: true
      },

      ifsc_code: {
        type: DataTypes.STRING,
        allowNull: true
      },

      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "DRAFT"
      }
    },
    {
      tableName: "ucic_manage",
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  );

  return UcicManage;
};
