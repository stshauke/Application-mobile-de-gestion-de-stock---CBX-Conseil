
exports.validateCreateProduct = (req, res, next) => {
  const errors = [];
  const { name, reference, category, quantity, alert_threshold } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Le nom du produit est obligatoire.');
  }

  if (!reference || typeof reference !== 'string' || reference.trim().length === 0) {
    errors.push('La référence du produit est obligatoire.');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('La catégorie du produit est obligatoire.');
  }

  
  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    errors.push('La quantité initiale doit être un nombre entier positif ou nul.');
  }

  
  if (alert_threshold !== undefined && (!Number.isInteger(alert_threshold) || alert_threshold < 0)) {
    errors.push("Le seuil d'alerte doit être un nombre entier positif ou nul.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Données invalides', details: errors });
  }

  next(); 
};


exports.validateUpdateProduct = (req, res, next) => {
  const errors = [];
  const { name, reference, category, quantity, alert_threshold } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    errors.push('Le nom du produit ne peut pas être vide.');
  }

  if (reference !== undefined && (typeof reference !== 'string' || reference.trim().length === 0)) {
    errors.push('La référence du produit ne peut pas être vide.');
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim().length === 0)) {
    errors.push('La catégorie du produit ne peut pas être vide.');
  }

  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    errors.push('La quantité doit être un nombre entier positif ou nul.');
  }

  if (alert_threshold !== undefined && (!Number.isInteger(alert_threshold) || alert_threshold < 0)) {
    errors.push("Le seuil d'alerte doit être un nombre entier positif ou nul.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Données invalides', details: errors });
  }

  next();
};


exports.validateStockMovement = (req, res, next) => {
  const errors = [];
  const { type, quantity } = req.body;

  if (!type || !['IN', 'OUT'].includes(type)) {
    errors.push("Le type de mouvement doit être 'IN' (entrée) ou 'OUT' (sortie).");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    errors.push('La quantité du mouvement doit être un nombre entier strictement positif.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Données invalides', details: errors });
  }

  next();
};
