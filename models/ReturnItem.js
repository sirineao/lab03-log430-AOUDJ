const ReturnItem = (sequelize, DataTypes) => {
  const model = sequelize.define('ReturnItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    return_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING, // optionnel
      allowNull: true,
    }
  });

  model.associate = (models) => {
    model.belongsTo(models.Return, { foreignKey: 'return_id' });
    model.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return model;
};

export default ReturnItem;
