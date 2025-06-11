const LogisticsStock = (sequelize, DataTypes) => {
  const model = sequelize.define('LogisticsStock', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  });

  model.associate = (models) => {
    model.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return model;
};

export default LogisticsStock;
