module.exports = (sequelize, DataTypes) => {
  const CompanyImage = sequelize.define(
    "company_image",
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
      image_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      public_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image_type: {
        type: DataTypes.STRING, // e.g., 'logo', 'document', 'banner'
        allowNull: true
      }
    },
    {
      tableName: "company_image",
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  );

  CompanyImage.associate = (models) => {
    CompanyImage.belongsTo(models.company, {
      foreignKey: "company_id",
      as: "company"
    });
  };

  return CompanyImage;
};