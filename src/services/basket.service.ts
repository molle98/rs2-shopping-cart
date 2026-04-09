export const getBasket = async (db: any, userId: number) => {
  const items = await db.all(
    `
    SELECT 
      b.id,
      p.name,
      p.type,
      b.quantity
    FROM basket b
    JOIN products p ON p.id = b.productId
    WHERE b.userId = ?
    `,
    [userId],
  );

  return items;
};

export const addToBasket = async (
  db: any,
  userId: number,
  productId: number,
  quantity: number,
) => {
  const product = await db.get("SELECT id FROM products WHERE id = ?", [
    productId,
  ]);

  if (!product) {
    throw new Error("Product not found");
  }

  const existing = await db.get(
    "SELECT id FROM basket WHERE userId = ? AND productId = ?",
    [userId, productId],
  );

  if (existing) {
    throw new Error("Product already added");
  }

  await db.run(
    "INSERT INTO basket (userId, productId, quantity) VALUES (?, ?, ?)",
    [userId, productId, quantity],
  );

  return { message: "Product added to basket" };
};
