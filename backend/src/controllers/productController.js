

const pool = require('../config/db');


exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

   
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`); 
    }

    query += ' ORDER BY name ASC';

    
    const [rows] = await pool.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error('Erreur getAllProducts:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des produits' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur getProductById:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du produit' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      reference,
      description = null,
      category,
      quantity = 0,
      alert_threshold = 5,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO products (name, reference, description, category, quantity, alert_threshold)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), reference.trim(), description, category.trim(), quantity, alert_threshold]
    );

    
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

    res.status(201).json(rows[0]); 
  } catch (error) {
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Cette référence produit existe déjà' });
    }
    console.error('Erreur createProduct:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du produit' });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

   
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    
    const allowedFields = ['name', 'reference', 'description', 'category', 'quantity', 'alert_threshold'];
    const fieldsToUpdate = [];
    const values = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fieldsToUpdate.push(`${field} = ?`);
        values.push(
          typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field]
        );
      }
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    values.push(id); 

    await pool.query(
      `UPDATE products SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
      values
    );

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Cette référence produit existe déjà' });
    }
    console.error('Erreur updateProduct:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la modification du produit' });
  }
};


exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, quantity } = req.body;

    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const currentQuantity = existing[0].quantity;

    
    const newQuantity = type === 'IN' ? currentQuantity + quantity : currentQuantity - quantity;

    
    if (newQuantity < 0) {
      return res.status(400).json({
        error: `Stock insuffisant : il ne reste que ${currentQuantity} unité(s), impossible d'en retirer ${quantity}.`,
      });
    }

    await pool.query('UPDATE products SET quantity = ? WHERE id = ?', [newQuantity, id]);

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur updateStock:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du stock' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.status(204).send(); 
  } catch (error) {
    console.error('Erreur deleteProduct:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du produit' });
  }
};
