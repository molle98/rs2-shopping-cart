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

  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginName, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const fetchProducts = async () => {
    if (name && !/^[A-Za-z]{1,30}$/.test(name)) {
      alert("Invalid product name");
      return;
    }

    const res = await fetch(`${API}/products?name=${name}&type=${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProducts(data);
  };

  const addToBasket = async (productId: number) => {
    const qty = quantities[productId] || 1;

    const res = await fetch(`${API}/basket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: qty }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setQuantities({
      ...quantities,
      [productId]: 1,
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
        <div className="section">
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
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section">
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

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>

                <td>
                  <input
                    type="number"
                    value={quantities[p.id] || 1}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [p.id]: Number(e.target.value),
                      })
                    }
                    style={{ width: 50 }}
                  />
                </td>

                <td>
                  <button onClick={() => addToBasket(p.id)}>Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
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
    </div>
  );
}
