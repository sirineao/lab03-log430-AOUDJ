const SaleItem = (sequelize, DataTypes) => {
  const model = sequelize.define('SaleItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sale_id: {
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
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  });

  model.associate = (models) => {
    model.belongsTo(models.Sale, { foreignKey: 'sale_id' });
    model.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return model;
};

export default SaleItem;
