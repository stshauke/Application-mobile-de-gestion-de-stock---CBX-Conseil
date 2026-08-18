

require('dotenv').config(); 

const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');

const app = express();


app.use(cors());          
                           
app.use(express.json());  


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Gestion de Stock opérationnelle' });
});


app.use('/api/products', productRoutes);


app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`   -> Testez avec : curl http://localhost:${PORT}/api/health`);
});
