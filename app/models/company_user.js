module.exports = (sequelize, DataTypes) => {
  const CompanyUser = sequelize.define(
    "company_user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'company',
        //   key: 'id'
        // }
      },
      contact_person_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone_no: {
        type: DataTypes.STRING,
        allowNull: true
      },
        password: {
        type: DataTypes.STRING,
       allowNull: true
     },

      otp: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      tableName: "company_user",
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  );

  CompanyUser.associate = (models) => {
    CompanyUser.belongsTo(models.company, {
      foreignKey: "company_id",
      as: "company"
    });
  };

  return CompanyUser;
};