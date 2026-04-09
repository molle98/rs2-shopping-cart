import { useState } from "react";

type ProductType = "Books" | "Music" | "Games";

type Product = {
  id: number;
  name: string;
  type: ProductType;
  description: string;
};

type BasketItem = {
  id: number;
  name: string;
  type: ProductType;
  quantity: number;
};

const API = "http://localhost:3000";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginName, password }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products?name=${name}&type=${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProducts(data);
  };

  const addToBasket = async (productId: number) => {
    await fetch(`${API}/basket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    fetchBasket();
  };

  const fetchBasket = async () => {
    const res = await fetch(`${API}/basket`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setBasket(data);
  };

  if (!token) {
    return (
      <div className="container">
        <h2>Login</h2>
        <input
          placeholder="loginName"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
        />
        <br />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>

      <input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select onChange={(e) => setType(e.target.value)}>
        <option value="">All</option>
        <option value="Books">Books</option>
        <option value="Music">Music</option>
        <option value="Games">Games</option>
      </select>

      <button onClick={fetchProducts}>Search</button>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} ({p.type})
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: 50, marginLeft: 10 }}
            />
            <button onClick={() => addToBasket(p.id)}>Add</button>
          </li>
        ))}
      </ul>

      <h2>Basket</h2>
      <button onClick={fetchBasket}>Load Basket</button>

      <ul>
        {basket.map((b) => (
          <li key={b.id}>
            {b.name} - {b.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
