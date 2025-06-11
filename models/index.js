import SequelizeConstructor from 'sequelize';
import StoreModel from './Store.js';
import ProductModel from './Product.js';
import ProductStockModel from './ProductStock.js';
import LogisticsStockModel from './LogisticsStock.js';
import SaleModel from './Sale.js';
import SaleItemModel from './SaleItem.js';
import ReturnModel from './Return.js';
import ReturnItemModel from './ReturnItem.js';
import StockRequestModel from './StockRequest.js';
const isTest = process.env.NODE_ENV === 'test';

const sequelize = new SequelizeConstructor('shop_db', 'root', 'hello1234', {
  host: isTest ? '127.0.0.1' : 'my-store-db-2',
  dialect: 'mysql',
  port: 3306,
  logging: false,
  retry: {
    max: 5,
   } 
});

const Store = StoreModel(sequelize, SequelizeConstructor.DataTypes);
const Product = ProductModel(sequelize, SequelizeConstructor.DataTypes);
const ProductStock = ProductStockModel(sequelize, SequelizeConstructor.DataTypes);
const LogisticsStock = LogisticsStockModel(sequelize, SequelizeConstructor.DataTypes);
const Sale = SaleModel(sequelize, SequelizeConstructor.DataTypes);
const SaleItem = SaleItemModel(sequelize, SequelizeConstructor.DataTypes);
const Return = ReturnModel(sequelize, SequelizeConstructor.DataTypes);
const ReturnItem = ReturnItemModel(sequelize, SequelizeConstructor.DataTypes);
const StockRequest = StockRequestModel(sequelize, SequelizeConstructor.DataTypes);

const db = {
  sequelize,
  Sequelize: SequelizeConstructor,
  Store,
  Product,
  ProductStock,
  LogisticsStock,
  Sale,
  SaleItem,
  Return,
  ReturnItem,
  StockRequest
};

Store.associate?.(db);
Product.associate?.(db);
ProductStock.associate?.(db);
LogisticsStock.associate?.(db);
Sale.associate?.(db);
SaleItem.associate?.(db);
Return.associate?.(db);    
ReturnItem.associate?.(db);
StockRequest.associate?.(db);

export default db;