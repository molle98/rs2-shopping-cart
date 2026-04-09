export const getProducts = async (db: any, name?: string, type?: string) => {
  let query = "SELECT id, name, type, description FROM products WHERE 1=1";
  const params: any[] = [];

  if (name) {
    query += " AND name LIKE ?";
    params.push(`%${name}%`);
  }

  if (type) {
    query += " AND type = ?";
    params.push(type);
  }

  return db.all(query, params);
};
