module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define(
    "state",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "state",
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  );

  State.associate = (models) => {
    State.hasMany(models.city, {
      foreignKey: "state_id",
      as: "cities"
    });
  };

  return State;
};
