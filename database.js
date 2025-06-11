import db from './models/index.js';

const {
  Store,
  Product,
  ProductStock,
  LogisticsStock,
  Sale,
  SaleItem,
  StockRequest,
} = db;

const seed = async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Database synced');

    // Stores
    const stores = await Store.bulkCreate([
      { name: 'Magasin A', address: 'Rue Alpha', region: 'Nord' },
      { name: 'Magasin B', address: 'Rue Beta', region: 'Sud' },
      { name: 'Magasin C', address: 'Rue Gamma', region: 'Est' },
    ]);

    // Products
    const products = await Product.bulkCreate([
      { name: 'Pomme', price: 1.2, category: 'Fruits' },
      { name: 'Lait', price: 2.5, category: 'Dairy' },
      { name: 'Pain', price: 1.8, category: 'Boulangerie' },
      { name: 'Banane', price: 0.9, category: 'Fruits' },
      { name: 'Riz', price: 3.0, category: 'Épicerie' },
    ]);

    // Logistics stock
    for (const product of products) {
      await LogisticsStock.create({
        product_id: product.id,
        quantity: 200
      });
    }

    // Stock par magasin
    for (const store of stores) {
      for (const product of products) {
        await ProductStock.create({
          store_id: store.id,
          product_id: product.id,
          quantity: Math.floor(Math.random() * 30) + 10
        });
      }
    }

    // Ventes de test
    for (const store of stores) {
      const sale = await Sale.create({ store_id: store.id, price: 0 });
      let total = 0;

      const items = products.slice(0, 3);
      for (const product of items) {
        const qty = Math.floor(Math.random() * 3) + 1;
        const subtotal = qty * product.price;
        total += subtotal;

        await SaleItem.create({
          sale_id: sale.id,
          product_id: product.id,
          quantity: qty,
          unit_price: product.price,
          subtotal
        });

        const stock = await ProductStock.findOne({ where: { store_id: store.id, product_id: product.id } });
        if (stock) {
          stock.quantity -= qty;
          await stock.save();
        }
      }

      sale.total_amount = total;
      await sale.save();
    }

    // 1 demande de stock en attente
    await StockRequest.create({
      store_id: stores[0].id,
      product_id: products[0].id,
      quantity: 20,
      status: 'pending'
    });

    console.log('Données insérées');
    process.exit();
  } catch (err) {
    console.error('Erreur insertion données :', err);
    process.exit(1);
  }
};

seed();
