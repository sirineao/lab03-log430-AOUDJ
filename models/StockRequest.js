const StockRequest = (sequelize, DataTypes) => {
  const model = sequelize.define('StockRequest', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', // can be 'pending', 'completed', 'rejected'
    },
    requested_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  });

  model.associate = (models) => {
    model.belongsTo(models.Product, { foreignKey: 'product_id' });
    model.belongsTo(models.Store, { foreignKey: 'store_id' });
  };

  return model;
};

export default StockRequest;
