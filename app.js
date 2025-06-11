//for tests
import express from 'express';

import productRoutes from './routes/product.routes.js';
import salesRoutes from './routes/sales.routes.js';
import storeRoutes from './routes/store.routes.js';
import logisticsRoutes from './routes/logistics.routes.js';
import reportRoutes from './routes/report.routes.js';

const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/reports', reportRoutes);

export default app;
