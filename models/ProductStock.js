const ProductStock = (sequelize, DataTypes) => {
  const model = sequelize.define('ProductStock', {
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
      defaultValue: 0,
    }
  }, {
    tableName: 'ProductStocks'
  });

  model.associate = (models) => {
    model.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    model.belongsTo(models.Store, {
      foreignKey: 'store_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return model;
};

export default ProductStock;
