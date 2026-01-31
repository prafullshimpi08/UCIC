module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define(
    "city",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      state_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "city",
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  );

  City.associate = (models) => {
    City.belongsTo(models.state, {
      foreignKey: "state_id",
      as: "state"
    });
  };

  return City;
};
