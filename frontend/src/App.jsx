import { useEffect, useMemo, useState } from "react";

const CUSTOMER_API_URL = "http://localhost:5000/api/customers";
const ORDER_API_URL = "http://localhost:5000/api/orders";
const PRODUCT_API_URL = "http://localhost:5000/api/products";

const PRODUCT_CATEGORIES = [
  "Custom T-Shirts",
  "Mugs & Cups",
  "Bottles",
  "Gifting Products",
  "Arts & Crafts",
  "Customized Mousepads",
  "Cushions",
  "Keychains",
];

const menuItems = [
  { id: "dashboard", icon: "⌂", label: "Dashboard" },
  { id: "orders", icon: "▣", label: "Orders" },
  { id: "products", icon: "▤", label: "Products" },
  { id: "customers", icon: "♙", label: "Customers" },
  { id: "reviews", icon: "♡", label: "Reviews" },
  { id: "analytics", icon: "◔", label: "Analytics" },
  { id: "inventory", icon: "▦", label: "Inventory" },
  { id: "suppliers", icon: "♧", label: "Suppliers" },
  { id: "purchases", icon: "⇄", label: "Purchases" },
  { id: "finance", icon: "₹", label: "Finance" },
  { id: "employees", icon: "♙", label: "Employees" },
  { id: "payroll", icon: "▤", label: "Payroll" },
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    productName: "",
    category: "Custom T-Shirts",
    price: "",
    stock: "",
    status: "Active",
  });

  const [productSearch, setProductSearch] = useState("");

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [customerSearch, setCustomerSearch] = useState("");

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [orderForm, setOrderForm] = useState({
    orderNumber: "",
    customerName: "",
    productName: "",
    quantity: 1,
    amount: "",
    status: "Pending",
  });

  const [orderSearch, setOrderSearch] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [customerRes, orderRes, productRes] = await Promise.all([
        fetch(CUSTOMER_API_URL),
        fetch(ORDER_API_URL),
        fetch(PRODUCT_API_URL),
      ]);

      if (!customerRes.ok || !orderRes.ok || !productRes.ok) {
        throw new Error("Backend response error");
      }

      const customerData = await customerRes.json();
      const orderData = await orderRes.json();
      const productData = await productRes.json();

      setCustomers(customerData.customers || []);
      setOrders(orderData.orders || []);
      setProducts(productData.products || []);
    } catch (error) {
      console.error("Load data error:", error);
      showMessage("Backend connect nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // PRODUCT FUNCTIONS
  // ======================================================

  const openAddProduct = () => {
    setEditingProduct(null);

    setProductForm({
      productName: "",
      category: "Custom T-Shirts",
      price: "",
      stock: "",
      status: "Active",
    });

    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);

    setProductForm({
      productName: product.productName || "",
      category: product.category || "Custom T-Shirts",
      price: product.price ?? "",
      stock: product.stock ?? "",
      status: product.status || "Active",
    });

    setShowProductModal(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    try {
      const url = editingProduct
        ? `${PRODUCT_API_URL}/${editingProduct._id}`
        : PRODUCT_API_URL;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: productForm.productName,
          category: productForm.category,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          status: productForm.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Product save failed");
      }

      showMessage(
        editingProduct
          ? "Product updated successfully"
          : "Product added successfully"
      );

      setShowProductModal(false);
      setEditingProduct(null);

      setProductForm({
        productName: "",
        category: "Custom T-Shirts",
        price: "",
        stock: "",
        status: "Active",
      });

      await loadAllData();
    } catch (error) {
      console.error("Save product error:", error);
      showMessage(error.message || "Product save failed");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Kya tum ye product delete karna chahti ho?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      showMessage("Product deleted successfully");
      await loadAllData();
    } catch (error) {
      console.error("Delete product error:", error);
      showMessage(error.message || "Delete failed");
    }
  };

  // ======================================================
  // CUSTOMER FUNCTIONS
  // ======================================================

  const openAddCustomer = () => {
    setEditingCustomer(null);

    setCustomerForm({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setShowCustomerModal(true);
  };

  const openEditCustomer = (customer) => {
    setEditingCustomer(customer);

    setCustomerForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });

    setShowCustomerModal(true);
  };

  const saveCustomer = async (e) => {
    e.preventDefault();

    try {
      const url = editingCustomer
        ? `${CUSTOMER_API_URL}/${editingCustomer._id}`
        : CUSTOMER_API_URL;

      const method = editingCustomer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Customer save failed");
      }

      showMessage(
        editingCustomer
          ? "Customer updated successfully"
          : "Customer added successfully"
      );

      setShowCustomerModal(false);
      setEditingCustomer(null);

      setCustomerForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      await loadAllData();
    } catch (error) {
      console.error("Save customer error:", error);
      showMessage(error.message || "Customer save failed");
    }
  };

  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Kya tum ye customer delete karna chahti ho?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${CUSTOMER_API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      showMessage("Customer deleted successfully");
      await loadAllData();
    } catch (error) {
      console.error("Delete customer error:", error);
      showMessage(error.message || "Delete failed");
    }
  };

  // ======================================================
  // ORDER FUNCTIONS
  // ======================================================

  const openAddOrder = () => {
    setEditingOrder(null);

    setOrderForm({
      orderNumber: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      customerName: "",
      productName: "",
      quantity: 1,
      amount: "",
      status: "Pending",
    });

    setShowOrderModal(true);
  };

  const openEditOrder = (order) => {
    setEditingOrder(order);

    setOrderForm({
      orderNumber: order.orderNumber || "",
      customerName: order.customerName || "",
      productName: order.productName || "",
      quantity: order.quantity || 1,
      amount: order.amount ?? "",
      status: order.status || "Pending",
    });

    setShowOrderModal(true);
  };

  const handleOrderProductChange = (productName) => {
    const selectedProduct = products.find(
      (product) =>
        product.productName?.toLowerCase() ===
        productName.toLowerCase()
    );

    const quantity = Number(orderForm.quantity) || 1;

    setOrderForm((prev) => ({
      ...prev,
      productName,
      amount: selectedProduct
        ? Number(selectedProduct.price) * quantity
        : prev.amount,
    }));
  };

  const handleOrderQuantityChange = (quantity) => {
    const selectedProduct = products.find(
      (product) =>
        product.productName?.toLowerCase() ===
        orderForm.productName?.toLowerCase()
    );

    const qty = Number(quantity) || 1;

    setOrderForm((prev) => ({
      ...prev,
      quantity: qty,
      amount: selectedProduct
        ? Number(selectedProduct.price) * qty
        : prev.amount,
    }));
  };

  const saveOrder = async (e) => {
    e.preventDefault();

    try {
      const url = editingOrder
        ? `${ORDER_API_URL}/${editingOrder._id}`
        : ORDER_API_URL;

      const method = editingOrder ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: orderForm.orderNumber,
          customerName: orderForm.customerName,
          productName: orderForm.productName,
          quantity: Number(orderForm.quantity),
          amount: Number(orderForm.amount),
          status: orderForm.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order save failed");
      }

      showMessage(
        editingOrder
          ? "Order updated successfully"
          : "Order added successfully"
      );

      setShowOrderModal(false);
      setEditingOrder(null);

      setOrderForm({
        orderNumber: "",
        customerName: "",
        productName: "",
        quantity: 1,
        amount: "",
        status: "Pending",
      });

      await loadAllData();
    } catch (error) {
      console.error("Save order error:", error);
      showMessage(error.message || "Order save failed");
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Kya tum ye order delete karna chahti ho?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${ORDER_API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      showMessage("Order deleted successfully");
      await loadAllData();
    } catch (error) {
      console.error("Delete order error:", error);
      showMessage(error.message || "Delete failed");
    }
  };

  // ======================================================
  // DASHBOARD CALCULATIONS
  // ======================================================

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      return sum + Number(order.amount || 0);
    }, 0);
  }, [orders]);

  const activeCustomers = customers.filter(
    (customer) => customer.status !== "Inactive"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const filteredProducts = products.filter((product) =>
    `${product.productName || ""} ${product.category || ""}`
      .toLowerCase()
      .includes(productSearch.toLowerCase())
  );

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name || ""} ${customer.email || ""} ${
      customer.phone || ""
    }`
      .toLowerCase()
      .includes(customerSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((order) =>
    `${order.orderNumber || ""} ${order.customerName || ""} ${
      order.productName || ""
    }`
      .toLowerCase()
      .includes(orderSearch.toLowerCase())
  );

  const renderPage = () => {
    if (activePage === "dashboard") {
      return (
        <Dashboard
          customers={customers}
          orders={orders}
          products={products}
          activeCustomers={activeCustomers}
          pendingOrders={pendingOrders}
          completedOrders={completedOrders}
          totalRevenue={totalRevenue}
          onAddOrder={openAddOrder}
          onAddProduct={openAddProduct}
          onPageChange={setActivePage}
        />
      );
    }

    if (activePage === "products") {
      return (
        <ProductsPage
          products={filteredProducts}
          search={productSearch}
          setSearch={setProductSearch}
          onAdd={openAddProduct}
          onEdit={openEditProduct}
          onDelete={deleteProduct}
        />
      );
    }

    if (activePage === "customers") {
      return (
        <CustomersPage
          customers={filteredCustomers}
          search={customerSearch}
          setSearch={setCustomerSearch}
          onAdd={openAddCustomer}
          onEdit={openEditCustomer}
          onDelete={deleteCustomer}
        />
      );
    }

    if (activePage === "orders") {
      return (
        <OrdersPage
          orders={filteredOrders}
          search={orderSearch}
          setSearch={setOrderSearch}
          onAdd={openAddOrder}
          onEdit={openEditOrder}
          onDelete={deleteOrder}
        />
      );
    }

    if (activePage === "reviews") {
      return <ReviewsPage />;
    }

    if (activePage === "analytics") {
      return (
        <AnalyticsPage
          orders={orders}
          products={products}
          totalRevenue={totalRevenue}
        />
      );
    }

    if (["inventory", "suppliers", "purchases", "finance", "employees", "payroll"].includes(activePage)) {
      return <EnterpriseModulePage module={activePage === "finance" ? "expenses" : activePage} onMessage={showMessage} />;
    }

    return null;
  };

  return (
    <>
      <style>{styles}</style>

      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand-area">
            <div className="logo-box">
              <img
                src="/shubr-logo.png"
                alt="SHUBHR"
                className="brand-logo"
              />
            </div>

            <div className="brand-name">SHUBHR</div>

            <div className="brand-tagline">
              PURE CHOICES. HONEST QUALITY.
            </div>
          </div>

          <div className="nav-label">MAIN MENU</div>

          <nav className="nav-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => setActivePage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="mini-brand">
              <span>✦</span>

              <div>
                <strong>SHUBHR</strong>
                <small>Customized with care</small>
              </div>
            </div>
          </div>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div>
              <div className="breadcrumb">
                SHUBHR / {activePage}
              </div>

              <h1>
                {activePage === "dashboard"
                  ? "Welcome to SHUBHR"
                  : activePage.charAt(0).toUpperCase() +
                    activePage.slice(1)}
              </h1>
            </div>

            <div className="topbar-right">
              <button
                className="refresh-btn"
                onClick={loadAllData}
                title="Refresh"
              >
                ↻
              </button>

              <div className="admin-profile">
                <div className="admin-avatar">S</div>

                <div>
                  <strong>SHUBHR Admin</strong>
                  <span>Administrator</span>
                </div>
              </div>
            </div>
          </header>

          {message && <div className="toast">{message}</div>}

          <section className="page-content">
            {loading ? (
              <div className="loading-box">
                <div className="loader"></div>
                <p>SHUBHR data loading...</p>
              </div>
            ) : (
              renderPage()
            )}
          </section>
        </main>
      </div>

      {showProductModal && (
        <ProductModal
          form={productForm}
          setForm={setProductForm}
          editing={editingProduct}
          onClose={() => setShowProductModal(false)}
          onSave={saveProduct}
        />
      )}

      {showCustomerModal && (
        <CustomerModal
          form={customerForm}
          setForm={setCustomerForm}
          editing={editingCustomer}
          onClose={() => setShowCustomerModal(false)}
          onSave={saveCustomer}
        />
      )}

      {showOrderModal && (
        <OrderModal
          form={orderForm}
          setForm={setOrderForm}
          editing={editingOrder}
          customers={customers}
          products={products}
          onProductChange={handleOrderProductChange}
          onQuantityChange={handleOrderQuantityChange}
          onClose={() => setShowOrderModal(false)}
          onSave={saveOrder}
        />
      )}
    </>
  );
}

// ======================================================
// DASHBOARD
// ======================================================

function Dashboard({
  customers,
  orders,
  products,
  activeCustomers,
  pendingOrders,
  completedOrders,
  totalRevenue,
  onAddOrder,
  onAddProduct,
  onPageChange,
}) {
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="hero-card">
        <div className="hero-content">
          <div className="hero-kicker">
            CUSTOMIZED PRINTING & GIFTING
          </div>

          <h2>
            <span className="marathi-tagline">
              तुमची कल्पना, आमची कला!
            </span>
          </h2>

          <p>PURE CHOICES. HONEST QUALITY.</p>

          <div className="hero-buttons">
            <button className="gold-btn" onClick={onAddOrder}>
              + New Order
            </button>

            <button className="light-btn" onClick={onAddProduct}>
              + Add Product
            </button>
          </div>
        </div>

        <div className="hero-products">
          <div className="product-circle">☕</div>
          <div className="product-circle">👕</div>
          <div className="product-circle">🎁</div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="▣"
          title="Total Orders"
          value={orders.length}
          subtitle={`${pendingOrders} pending`}
        />

        <StatCard
          icon="₹"
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          subtitle="All orders"
        />

        <StatCard
          icon="▤"
          title="Products"
          value={products.length}
          subtitle="Customized products"
        />

        <StatCard
          icon="♙"
          title="Customers"
          value={customers.length}
          subtitle={`${activeCustomers} active`}
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-eyebrow">
                SHUBHR STORE
              </span>

              <h3>Our Products</h3>
            </div>

            <button
              className="text-btn"
              onClick={() => onPageChange("products")}
            >
              View all →
            </button>
          </div>

          <div className="category-grid">
            <CategoryCard icon="👕" name="Custom T-Shirts" />
            <CategoryCard icon="☕" name="Mugs & Cups" />
            <CategoryCard icon="🍼" name="Bottles" />
            <CategoryCard icon="🎁" name="Gifting Products" />
            <CategoryCard icon="🎨" name="Arts & Crafts" />
            <CategoryCard icon="🖱️" name="Mousepads" />
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-eyebrow">
                ORDER STATUS
              </span>

              <h3>Quick Overview</h3>
            </div>
          </div>

          <div className="status-list">
            <StatusRow
              label="Pending"
              count={pendingOrders}
              type="pending"
            />

            <StatusRow
              label="Processing"
              count={
                orders.filter(
                  (order) => order.status === "Processing"
                ).length
              }
              type="processing"
            />

            <StatusRow
              label="Completed"
              count={completedOrders}
              type="completed"
            />

            <StatusRow
              label="Cancelled"
              count={
                orders.filter(
                  (order) => order.status === "Cancelled"
                ).length
              }
              type="cancelled"
            />
          </div>
        </div>
      </div>

      <div className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <span className="section-eyebrow">
              LATEST ACTIVITY
            </span>

            <h3>Recent Orders</h3>
          </div>

          <button
            className="text-btn"
            onClick={() => onPageChange("orders")}
          >
            View all →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▣</div>

            <h4>No orders yet</h4>

            <p>
              SHUBHR ke first customized orders yahan dikhenge.
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>PRODUCT</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="strong-cell">
                      {order.orderNumber}
                    </td>

                    <td>{order.customerName}</td>

                    <td>{order.productName}</td>

                    <td>
                      ₹
                      {Number(order.amount || 0).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-info">
        <span>{title}</span>

        <strong>{value}</strong>

        <small>{subtitle}</small>
      </div>
    </div>
  );
}

function CategoryCard({ icon, name }) {
  return (
    <div className="category-card">
      <div className="category-icon">{icon}</div>

      <span>{name}</span>
    </div>
  );
}

function StatusRow({ label, count, type }) {
  return (
    <div className="status-row">
      <div className={`status-dot ${type}`}></div>

      <span>{label}</span>

      <strong>{count}</strong>
    </div>
  );
}

// ======================================================
// PRODUCTS
// ======================================================

function ProductsPage({
  products,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <PageIntro
        eyebrow="SHUBHR STORE"
        title="Customized Products"
        description="Manage SHUBHR ke customized printing aur gifting products."
        button="+ Add Product"
        onButton={onAdd}
      />

      <div className="toolbar">
        <div className="search-box">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
          />
        </div>
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
          <div className="empty-state full-width">
            <div className="empty-icon">▤</div>

            <h4>No products found</h4>

            <p>
              SHUBHR ka customized product add karo.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-image">
                {getProductIcon(product.category)}
              </div>

              <div className="product-card-body">
                <div className="product-category">
                  {product.category}
                </div>

                <h3>{product.productName}</h3>

                <div className="product-meta">
                  <strong>
                    ₹
                    {Number(product.price || 0).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <span
                    className={
                      Number(product.stock) > 0
                        ? "stock good"
                        : "stock bad"
                    }
                  >
                    {product.stock} in stock
                  </span>
                </div>

                <div className="product-actions">
                  <button onClick={() => onEdit(product)}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getProductIcon(category) {
  if (category?.includes("T-Shirt")) return "👕";
  if (category?.includes("Mug")) return "☕";
  if (category?.includes("Bottle")) return "🍼";
  if (category?.includes("Mouse")) return "🖱️";
  if (category?.includes("Cushion")) return "🛏️";
  if (category?.includes("Keychain")) return "🔑";
  if (category?.includes("Gift")) return "🎁";
  if (category?.includes("Arts")) return "🎨";

  return "✦";
}

// ======================================================
// CUSTOMERS
// ======================================================

function CustomersPage({
  customers,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <PageIntro
        eyebrow="CUSTOMER MANAGEMENT"
        title="Customers"
        description="SHUBHR ke customers aur unki details manage karo."
        button="+ Add Customer"
        onButton={onAdd}
      />

      <div className="toolbar">
        <div className="search-box">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
          />
        </div>
      </div>

      <div className="panel">
        {customers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♙</div>

            <h4>No customers found</h4>

            <p>SHUBHR ka first customer add karo.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>ADDRESS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="strong-cell">
                      {customer.name}
                    </td>

                    <td>{customer.email}</td>

                    <td>{customer.phone}</td>

                    <td>{customer.address || "-"}</td>

                    <td>
                      <span className="customer-status">
                        {customer.status || "Active"}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => onEdit(customer)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            onDelete(customer._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================================
// ORDERS
// ======================================================

function OrdersPage({
  orders,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div>
      <PageIntro
        eyebrow="ORDER MANAGEMENT"
        title="Customized Orders"
        description="T-shirts, mugs, mousepads aur gifting orders manage karo."
        button="+ New Order"
        onButton={onAdd}
      />

      <div className="toolbar">
        <div className="search-box">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
          />
        </div>
      </div>

      <div className="panel">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▣</div>

            <h4>No orders found</h4>

            <p>
              SHUBHR ka first customized order create karo.
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>PRODUCT</th>
                  <th>QTY</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="strong-cell">
                      {order.orderNumber}
                    </td>

                    <td>{order.customerName}</td>

                    <td>{order.productName}</td>

                    <td>{order.quantity}</td>

                    <td>
                      ₹
                      {Number(order.amount || 0).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <StatusBadge status={order.status} />
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => onEdit(order)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            onDelete(order._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================================
// ANALYTICS
// ======================================================

function AnalyticsPage({
  orders,
  products,
  totalRevenue,
}) {
  const categoryCounts = {};
  const statusCounts = {
    Pending: 0,
    Processing: 0,
    Completed: 0,
    Cancelled: 0,
  };

  products.forEach((product) => {
    const category = product.category || "Other";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  orders.forEach((order) => {
    const status = order.status || "Pending";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // Last 6 months revenue trend. Real order data is used; empty months stay at 0.
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const now = new Date();
  const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: `${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(-2)}`,
      revenue: 0,
      orders: 0,
    };
  });

  orders.forEach((order) => {
    const rawDate = order.createdAt || order.date || order.orderDate;
    const date = rawDate ? new Date(rawDate) : null;
    if (!date || Number.isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const month = monthlyRevenue.find((item) => item.key === key);
    if (month) {
      month.revenue += Number(order.amount || 0);
      month.orders += 1;
    }
  });

  const maxRevenue = Math.max(...monthlyRevenue.map((item) => item.revenue), 1);
  const chartWidth = 720;
  const chartHeight = 230;
  const paddingX = 34;
  const paddingY = 20;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - 55;

  const points = monthlyRevenue.map((item, index) => {
    const x = paddingX + (index / Math.max(monthlyRevenue.length - 1, 1)) * graphWidth;
    const y = paddingY + graphHeight - (item.revenue / maxRevenue) * graphHeight;
    return { ...item, x, y };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `${paddingX},${paddingY + graphHeight} ${linePoints} ${paddingX + graphWidth},${paddingY + graphHeight}`;

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  const completionRate = orders.length
    ? Math.round(((statusCounts.Completed || 0) / orders.length) * 100)
    : 0;

  return (
    <div>
      <PageIntro
        eyebrow="BUSINESS INSIGHTS"
        title="Analytics"
        description="SHUBHR business performance ka detailed overview."
      />

      <div className="analytics-cards">
        <div className="analytics-card">
          <span>Total Sales</span>
          <strong>₹{totalRevenue.toLocaleString("en-IN")}</strong>
          <small>All recorded orders</small>
        </div>

        <div className="analytics-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
          <small>{statusCounts.Completed || 0} completed</small>
        </div>

        <div className="analytics-card">
          <span>Products</span>
          <strong>{products.length}</strong>
          <small>{topCategory ? `${topCategory[0]} leads` : "No category data"}</small>
        </div>

        <div className="analytics-card analytics-card-light">
          <span>Completion Rate</span>
          <strong>{completionRate}%</strong>
          <small>Completed orders</small>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="panel analytics-chart-panel">
          <div className="panel-heading">
            <div>
              <span className="section-eyebrow">REVENUE TREND</span>
              <h3>Sales Performance</h3>
            </div>
            <span className="analytics-live-note">Last 6 months</span>
          </div>

          <div className="analytics-line-chart">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Revenue trend chart">
              {[0, 1, 2, 3].map((row) => {
                const y = paddingY + (graphHeight / 3) * row;
                return (
                  <line
                    key={row}
                    x1={paddingX}
                    x2={paddingX + graphWidth}
                    y1={y}
                    y2={y}
                    className="chart-grid-line"
                  />
                );
              })}

              <polygon points={areaPoints} className="chart-area" />
              <polyline points={linePoints} className="chart-line-path" />

              {points.map((point) => (
                <g key={point.key}>
                  <circle cx={point.x} cy={point.y} r="5" className="chart-dot" />
                  <text x={point.x} y={chartHeight - 13} textAnchor="middle" className="chart-label">
                    {point.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="analytics-chart-footer">
            <span>Revenue is calculated from the order amount stored in MongoDB.</span>
            <strong>₹{monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0).toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-eyebrow">ORDER STATUS</span>
              <h3>Order Distribution</h3>
            </div>
          </div>

          <div className="status-chart">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = orders.length ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div className="status-chart-row" key={status}>
                  <div className="status-chart-top">
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="status-bar">
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                  <small>{percentage}% of orders</small>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="analytics-grid analytics-bottom-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <span className="section-eyebrow">PRODUCT MIX</span>
              <h3>Product Categories</h3>
            </div>
          </div>

          <div className="analytics-list">
            {Object.keys(categoryCounts).length === 0 ? (
              <div className="empty-state">
                <p>No product data available.</p>
              </div>
            ) : (
              Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => {
                  const percentage = products.length
                    ? Math.round((count / products.length) * 100)
                    : 0;

                  return (
                    <div className="analytics-row analytics-category-row" key={category}>
                      <div>
                        <span>{category}</span>
                        <div className="category-progress">
                          <span style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <strong>{count}</strong>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        <div className="panel analytics-insight-panel">
          <span className="section-eyebrow">QUICK INSIGHTS</span>
          <h3>Business Snapshot</h3>

          <div className="insight-item">
            <span>Best product category</span>
            <strong>{topCategory ? topCategory[0] : "—"}</strong>
          </div>

          <div className="insight-item">
            <span>Average order value</span>
            <strong>
              ₹{orders.length ? Math.round(totalRevenue / orders.length).toLocaleString("en-IN") : "0"}
            </strong>
          </div>

          <div className="insight-item">
            <span>Pending orders</span>
            <strong>{statusCounts.Pending || 0}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// PLACEHOLDER
// ======================================================

function PlaceholderPage({ title, icon }) {
  return (
    <div>
      <PageIntro
        eyebrow="SHUBHR"
        title={title}
        description="Ye module SHUBHR ke next development phase mein add hoga."
      />

      <div className="panel placeholder-panel">
        <div className="placeholder-icon">
          {icon}
        </div>

        <h3>{title}</h3>

        <p>Coming soon...</p>
      </div>
    </div>
  );
}

// ======================================================
// CUSTOMER REVIEWS
// ======================================================

function ReviewsPage() {
  const [reviews, setReviews] = useState([
    { id: 1, name: "Priya", product: "Customized Mug", rating: 5, text: "Product quality bahut achhi thi. Design exactly meri expectation ke according tha." },
    { id: 2, name: "Rahul", product: "Custom T-Shirt", rating: 5, text: "Printing quality clean hai aur delivery bhi time par mili." },
    { id: 3, name: "Sneha", product: "Personalized Gift", rating: 4, text: "Gift packaging achhi thi. Overall experience very good." },
  ]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const count = (rating) => reviews.filter((r) => r.rating === rating).length;
  const average = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const filtered = reviews.filter((r) => {
    const matchesRating = filter === "All" || String(r.rating) === filter;
    const text = `${r.name} ${r.product} ${r.text}`.toLowerCase();
    return matchesRating && text.includes(search.toLowerCase());
  });

  return (
    <div>
      <PageIntro eyebrow="CUSTOMER EXPERIENCE" title="Customer Reviews" description="SHUBHR customers ka feedback aur product experience manage karo." />
      <div className="review-summary-grid">
        <div className="review-summary-card"><span>Average Rating</span><strong>{average}</strong><div className="review-stars">★★★★★</div></div>
        <div className="review-summary-card"><span>Total Reviews</span><strong>{reviews.length}</strong><small>Customer feedback</small></div>
        <div className="review-summary-card"><span>5 Star Reviews</span><strong>{count(5)}</strong><small>{reviews.length ? Math.round(count(5) / reviews.length * 100) : 0}% of reviews</small></div>
        <div className="review-summary-card"><span>Positive Reviews</span><strong>{reviews.filter((r) => r.rating >= 4).length}</strong><small>4 & 5 star feedback</small></div>
      </div>
      <div className="review-toolbar">
        <div className="search-box review-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews..." /></div>
        <div className="review-filters">
          {["All", "5", "4", "3", "2", "1"].map((value) => <button key={value} className={filter === value ? "review-filter active" : "review-filter"} onClick={() => setFilter(value)}>{value === "All" ? "All" : `${value} ★`}</button>)}
        </div>
      </div>
      <div className="panel review-breakdown-panel">
        <div className="panel-heading"><div><span className="section-eyebrow">RATING BREAKDOWN</span><h3>Customer Satisfaction</h3></div></div>
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((rating) => {
            const total = count(rating);
            const percentage = reviews.length ? Math.round(total / reviews.length * 100) : 0;
            return <div className="rating-breakdown-row" key={rating}><span>{rating} ★</span><div className="rating-bar"><div style={{ width: `${percentage}%` }} /></div><strong>{total}</strong></div>;
          })}
        </div>
      </div>
      <div className="reviews-section-heading"><div><span className="section-eyebrow">CUSTOMER FEEDBACK</span><h3>Recent Reviews</h3></div><span className="review-count-label">{filtered.length} reviews</span></div>
      {filtered.length ? (
        <div className="reviews-grid">
          {filtered.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-card-top"><div className="review-avatar">{review.name.charAt(0)}</div><div className="review-customer"><strong>{review.name}</strong><span>{review.product}</span></div><button className="review-delete" onClick={() => setReviews((items) => items.filter((item) => item.id !== review.id))}>×</button></div>
              <div className="review-rating">{"★".repeat(review.rating)}<span>{"★".repeat(5 - review.rating)}</span></div>
              <p className="review-text">“{review.text}”</p>
              <div className="review-card-bottom"><span>Recent</span><span className="review-status">Published</span></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel"><div className="empty-state"><div className="empty-icon">♡</div><h4>No reviews found</h4><p>Search ya filter change karke dekho.</p></div></div>
      )}
      <div className="review-note"><strong>Note:</strong> Reviews module abhi frontend demo data ke saath hai. Backend me Review model/API nahi hai, isliye refresh ke baad deleted reviews wapas aa jayenge.</div>
    </div>
  );
}

// ======================================================
// COMMON
// ======================================================

function PageIntro({
  eyebrow,
  title,
  description,
  button,
  onButton,
}) {
  return (
    <div className="page-intro">
      <div>
        <span className="section-eyebrow">
          {eyebrow}
        </span>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      {button && (
        <button
          className="primary-btn"
          onClick={onButton}
        >
          {button}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const type = status?.toLowerCase() || "pending";

  return (
    <span className={`status-badge ${type}`}>
      {status || "Pending"}
    </span>
  );
}

// ======================================================
// PRODUCT MODAL
// ======================================================

function ProductModal({
  form,
  setForm,
  editing,
  onClose,
  onSave,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <span className="section-eyebrow">
              SHUBHR STORE
            </span>

            <h3>
              {editing ? "Edit Product" : "Add Product"}
            </h3>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSave}>
          <label>Product Name</label>

          <input
            required
            value={form.productName}
            onChange={(e) =>
              setForm({
                ...form,
                productName: e.target.value,
              })
            }
            placeholder="e.g. Custom Couple Mug"
          />

          <label>Category</label>

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="form-two-col">
            <div>
              <label>Price</label>

              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
                placeholder="₹"
              />
            </div>

            <div>
              <label>Stock</label>

              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <label>Status</label>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              {editing ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// CUSTOMER MODAL
// ======================================================

function CustomerModal({
  form,
  setForm,
  editing,
  onClose,
  onSave,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <span className="section-eyebrow">
              CUSTOMER
            </span>

            <h3>
              {editing ? "Edit Customer" : "Add Customer"}
            </h3>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSave}>
          <label>Name</label>

          <input
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="Customer name"
          />

          <label>Email</label>

          <input
            required
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            placeholder="customer@email.com"
          />

          <label>Phone</label>

          <input
            required
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            placeholder="Phone number"
          />

          <label>Address</label>

          <textarea
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            placeholder="Customer address"
          />

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              {editing
                ? "Update Customer"
                : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// ORDER MODAL
// ======================================================

function OrderModal({
  form,
  setForm,
  editing,
  customers,
  products,
  onProductChange,
  onQuantityChange,
  onClose,
  onSave,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <span className="section-eyebrow">
              SHUBHR ORDERS
            </span>

            <h3>
              {editing ? "Edit Order" : "Create New Order"}
            </h3>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSave}>
          <label>Order Number</label>

          <input
            required
            value={form.orderNumber}
            onChange={(e) =>
              setForm({
                ...form,
                orderNumber: e.target.value,
              })
            }
          />

          <label>Customer</label>

          <input
            required
            type="text"
            list="order-customer-list"
            value={form.customerName}
            onChange={(e) =>
              setForm({
                ...form,
                customerName: e.target.value,
              })
            }
            autoComplete="off"
          />

          <datalist id="order-customer-list">
            {customers.map((customer) => (
              <option
                key={customer._id}
                value={customer.name}
              />
            ))}
          </datalist>

          <label>Customized Product</label>

          <input
            required
            type="text"
            list="order-product-list"
            value={form.productName}
            onChange={(e) =>
              onProductChange(e.target.value)
            }
            autoComplete="off"
          />

          <datalist id="order-product-list">
            {products.map((product) => (
              <option
                key={product._id}
                value={product.productName}
              />
            ))}
          </datalist>

          <div className="form-two-col">
            <div>
              <label>Quantity</label>

              <input
                required
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) =>
                  onQuantityChange(e.target.value)
                }
              />
            </div>

            <div>
              <label>Total Amount</label>

              <input
                required
                type="number"
                min="0"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <label>Status</label>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              {editing ? "Update Order" : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ======================================================
// CLEAN MODERN SHUBHR STYLES
// ======================================================

const ENTERPRISE_API = {
  suppliers: "http://localhost:5000/api/suppliers",
  purchases: "http://localhost:5000/api/purchases",
  expenses: "http://localhost:5000/api/expenses",
  employees: "http://localhost:5000/api/employees",
  payroll: "http://localhost:5000/api/payroll",
  inventory: "http://localhost:5000/api/products",
};

const ENTERPRISE_CONFIG = {
  inventory: { title: "Inventory Management", eyebrow: "STOCK CONTROL", description: "Product stock levels aur low-stock items manage karo.", fields: [], columns: ["productName", "category", "stock", "price", "status"] },
  suppliers: { title: "Supplier Management", eyebrow: "SUPPLIER DIRECTORY", description: "Supplier details aur supplied materials ka record maintain karo.", fields: [{name:"supplierName",label:"Supplier Name",required:true},{name:"companyName",label:"Company Name"},{name:"phone",label:"Phone"},{name:"email",label:"Email",type:"email"},{name:"address",label:"Address"},{name:"productsSupplied",label:"Products Supplied"},{name:"paymentStatus",label:"Payment Status",type:"select",options:["Unpaid","Partial","Paid"]}], columns:["supplierName","companyName","phone","email","productsSupplied","paymentStatus"] },
  purchases: { title: "Purchase Orders", eyebrow: "PROCUREMENT", description: "Suppliers se purchase ki gayi items ka record rakho.", fields: [{name:"purchaseNumber",label:"Purchase Number",required:true},{name:"supplierName",label:"Supplier Name",required:true},{name:"productName",label:"Product Name",required:true},{name:"quantity",label:"Quantity",type:"number",required:true},{name:"unitCost",label:"Unit Cost (₹)",type:"number",required:true},{name:"status",label:"Status",type:"select",options:["Ordered","Received","Cancelled"]},{name:"orderDate",label:"Order Date",type:"date"},{name:"notes",label:"Notes"}], columns:["purchaseNumber","supplierName","productName","quantity","totalCost","status","orderDate"] },
  expenses: { title: "Finance & Expenses", eyebrow: "FINANCIAL RECORDS", description: "Business expenses record karo. Revenue comes from available order records; net profit needs complete cost data.", fields: [{name:"title",label:"Expense Title",required:true},{name:"category",label:"Category",required:true},{name:"amount",label:"Amount (₹)",type:"number",required:true},{name:"expenseDate",label:"Date",type:"date"},{name:"paymentMethod",label:"Payment Method",type:"select",options:["Cash","UPI","Bank Transfer","Card","Other"]},{name:"notes",label:"Notes"}], columns:["title","category","amount","expenseDate","paymentMethod","notes"] },
  employees: { title: "HR / Employees", eyebrow: "PEOPLE MANAGEMENT", description: "Employee records aur monthly salary details manage karo.", fields: [{name:"employeeId",label:"Employee ID",required:true},{name:"fullName",label:"Full Name",required:true},{name:"department",label:"Department",required:true},{name:"designation",label:"Designation"},{name:"phone",label:"Phone"},{name:"email",label:"Email",type:"email"},{name:"joiningDate",label:"Joining Date",type:"date"},{name:"monthlySalary",label:"Monthly Salary (₹)",type:"number",required:true},{name:"status",label:"Status",type:"select",options:["Active","Inactive"]}], columns:["employeeId","fullName","department","designation","monthlySalary","status"] },
  payroll: { title: "Payroll", eyebrow: "SALARY PROCESSING", description: "Monthly payroll records. Net salary is calculated as basic salary + allowances − deductions.", fields: [{name:"payrollNumber",label:"Payroll Number",required:true},{name:"employeeId",label:"Employee ID",required:true},{name:"employeeName",label:"Employee Name",required:true},{name:"month",label:"Month (e.g. 2026-10)",required:true},{name:"basicSalary",label:"Basic Salary (₹)",type:"number",required:true},{name:"allowances",label:"Allowances (₹)",type:"number"},{name:"deductions",label:"Deductions (₹)",type:"number"},{name:"paymentStatus",label:"Payment Status",type:"select",options:["Pending","Paid"]}], columns:["payrollNumber","employeeId","employeeName","month","basicSalary","allowances","deductions","netSalary","paymentStatus"] }
};

function EnterpriseModulePage({ module, onMessage }) {
  const config = ENTERPRISE_CONFIG[module];
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [showForm, setShowForm] = useState(false);
  const api = ENTERPRISE_API[module];

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch(api);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load data");
      setRecords(module === "inventory" ? (data.products || []) : (data.records || []));
    } catch (e) { onMessage(`${config.title}: ${e.message}`); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [module]);

  const openNew = () => {
    setEditing(null);
    const initial = {};
    config.fields.forEach((field) => { initial[field.name] = field.type === "select" ? field.options[0] : ""; });
    if (module === "purchases") { initial.purchaseNumber = `PO-${Date.now().toString().slice(-6)}`; initial.quantity = 1; initial.unitCost = 0; }
    if (module === "payroll") { initial.payrollNumber = `PAY-${Date.now().toString().slice(-6)}`; initial.allowances = 0; initial.deductions = 0; }
    if (module === "expenses") initial.amount = 0;
    setForm(initial); setShowForm(true);
  };
  const openEdit = (record) => { setEditing(record); const copy = {...record}; config.fields.forEach(f => { if (copy[f.name] && f.type === "date") copy[f.name] = String(copy[f.name]).slice(0,10); }); setForm(copy); setShowForm(true); };
  const save = async (event) => {
    event.preventDefault();
    try {
      const payload = {...form};
      if (module === "purchases") { payload.quantity = Number(payload.quantity); payload.unitCost = Number(payload.unitCost); payload.totalCost = payload.quantity * payload.unitCost; }
      if (module === "expenses") payload.amount = Number(payload.amount);
      if (module === "employees") payload.monthlySalary = Number(payload.monthlySalary);
      if (module === "payroll") { payload.basicSalary = Number(payload.basicSalary); payload.allowances = Number(payload.allowances || 0); payload.deductions = Number(payload.deductions || 0); payload.netSalary = payload.basicSalary + payload.allowances - payload.deductions; }
      const response = await fetch(editing ? `${api}/${editing._id}` : api, {method: editing ? "PUT" : "POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
      const data = await response.json(); if (!response.ok) throw new Error(data.message || "Save failed");
      setShowForm(false); onMessage(`${config.title}: ${editing ? "updated" : "added"} successfully`); await load();
    } catch(e) { onMessage(e.message); }
  };
  const remove = async (record) => {
    if (!window.confirm("Delete this record?")) return;
    try { const response = await fetch(`${api}/${record._id}`, {method:"DELETE"}); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Delete failed"); onMessage("Record deleted"); await load(); }
    catch(e) { onMessage(e.message); }
  };
  const adjustStock = async (product, delta) => {
    const next = Number(product.stock || 0) + delta;
    if (next < 0) return onMessage("Stock cannot be negative.");
    try { const response = await fetch(`${api}/${product._id}`, {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({...product,stock:next})}); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Stock update failed"); onMessage("Stock updated"); await load(); }
    catch(e) { onMessage(e.message); }
  };
  const visible = records.filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
  const currency = n => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  const total = module === "expenses" ? records.reduce((s,r)=>s+Number(r.amount||0),0) : module === "purchases" ? records.reduce((s,r)=>s+Number(r.totalCost||0),0) : module === "payroll" ? records.reduce((s,r)=>s+Number(r.netSalary||0),0) : 0;

  return <div>
    <PageIntro eyebrow={config.eyebrow} title={config.title} description={config.description} button={module === "inventory" ? undefined : `+ Add ${module === "purchases" ? "Purchase Order" : module === "expenses" ? "Expense" : module === "employees" ? "Employee" : module === "payroll" ? "Payroll Record" : "Supplier"}`} onButton={module === "inventory" ? undefined : openNew} />
    <div className="enterprise-summary-grid">
      <div className="enterprise-summary-card"><span>Total Records</span><strong>{records.length}</strong></div>
      {module === "inventory" ? <div className="enterprise-summary-card"><span>Low Stock (≤ 10)</span><strong>{records.filter(r=>Number(r.stock||0)<=10).length}</strong></div> : null}
      {module === "expenses" || module === "purchases" || module === "payroll" ? <div className="enterprise-summary-card"><span>{module === "expenses" ? "Recorded Expenses" : module === "purchases" ? "Purchase Value" : "Payroll Total"}</span><strong>{currency(total)}</strong></div> : null}
      {module === "employees" ? <div className="enterprise-summary-card"><span>Active Employees</span><strong>{records.filter(r=>r.status === "Active").length}</strong></div> : null}
      {module === "suppliers" ? <div className="enterprise-summary-card"><span>Paid Suppliers</span><strong>{records.filter(r=>r.paymentStatus === "Paid").length}</strong></div> : null}
    </div>
    <div className="toolbar"><div className="search-box"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${config.title.toLowerCase()}...`} /></div><button className="refresh-btn enterprise-refresh" onClick={load}>↻ Refresh</button></div>
    <div className="panel"><div className="table-wrap"><table><thead><tr>{config.columns.map(col=><th key={col}>{col.replace(/([A-Z])/g," $1").toUpperCase()}</th>)}<th>ACTIONS</th></tr></thead><tbody>
      {loading ? <tr><td colSpan={config.columns.length+1}>Loading...</td></tr> : visible.length === 0 ? <tr><td colSpan={config.columns.length+1}>No records yet. {module === "inventory" ? "Add products in the Products module first." : "Use the add button to create your first record."}</td></tr> : visible.map(record=><tr key={record._id}>{config.columns.map(col=><td key={col}>{col.toLowerCase().includes("salary") || ["amount","unitCost","totalCost","netSalary","basicSalary","allowances","deductions","price"].includes(col) ? currency(record[col]) : col.toLowerCase().includes("date") ? (record[col] ? String(record[col]).slice(0,10) : "—") : String(record[col] ?? "—")}</td>)}<td><div className="table-actions">{module === "inventory" ? <><button onClick={()=>adjustStock(record,-1)} disabled={Number(record.stock||0)<=0}>− Stock</button><button onClick={()=>adjustStock(record,1)}>+ Stock</button></> : <><button onClick={()=>openEdit(record)}>Edit</button><button className="delete-btn" onClick={()=>remove(record)}>Delete</button></>}</div></td></tr>)}
    </tbody></table></div></div>
    {showForm && <div className="enterprise-modal-backdrop" onClick={()=>setShowForm(false)}><div className="enterprise-modal" onClick={e=>e.stopPropagation()}><div className="panel-heading"><h3>{editing ? "Edit" : "Add"} {config.title}</h3><button type="button" className="close-btn" onClick={()=>setShowForm(false)}>×</button></div><form onSubmit={save} className="enterprise-form-grid">
      {config.fields.map(field=><label key={field.name}>{field.label}{field.type === "select" ? <select required={field.required} value={form[field.name] ?? ""} onChange={e=>setForm({...form,[field.name]:e.target.value})}>{field.options.map(opt=><option key={opt}>{opt}</option>)}</select> : <input type={field.type || "text"} required={field.required} min={field.type === "number" ? "0" : undefined} step={field.type === "number" ? "0.01" : undefined} value={form[field.name] ?? ""} onChange={e=>setForm({...form,[field.name]:e.target.value})} />}</label>)}
      <div className="enterprise-form-actions"><button type="button" className="light-btn" onClick={()=>setShowForm(false)}>Cancel</button><button type="submit" className="gold-btn">Save Record</button></div>
    </form></div></div>}
    {module === "payroll" ? <div className="review-note"><strong>Payroll privacy:</strong> Limit access to authorized administrators. Verify salary and deduction values before marking a record as paid.</div> : null}
  </div>;
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700&family=Noto+Sans+Devanagari:wght@500;600;700&display=swap'); 
 
:root { 
  --black: #111111; 
  --black-soft: #181818; 
  --gold: #c3a34a; 
  --gold-light: #d8bc65; 
  --cream: #f7f4ed; 
  --cream-light: #ffffff; 
  --cream-dark: #ebe6da; 
  --text: #242424; 
  --muted: #77736b; 
  --border: #e3ded3; 
  --green: #5d795f; 
  --red: #9a5c56; 
  --shadow: 0 8px 28px rgba(20, 18, 14, 0.06); 
} 
 
* { 
  box-sizing: border-box; 
} 
 
html, 
body, 
#root { 
  margin: 0; 
  min-height: 100%; 
  width: 100%; 
} 
 
body { 
  font-family: "Inter", Arial, sans-serif; 
  background: var(--cream); 
  color: var(--text); 
} 
 
button, 
input, 
select, 
textarea { 
  font: inherit; 
} 
 
button { 
  cursor: pointer; 
} 
 
.app-shell { 
  min-height: 100vh; 
  display: flex; 
  background: var(--cream); 
} 
 
/* SIDEBAR */ 
 
.sidebar { 
  width: 245px; 
  min-height: 100vh; 
  position: fixed; 
  left: 0; 
  top: 0; 
  bottom: 0; 
  padding: 22px 16px; 
  background: var(--black); 
  color: white; 
  border-right: 1px solid #2b2b2b; 
  z-index: 20; 
} 
 
.brand-area { 
  text-align: center; 
  padding: 0 8px 24px; 
  border-bottom: 1px solid #292929; 
} 
 
.logo-box { 
  width: 78px; 
  height: 78px; 
  margin: 0 auto 12px; 
  border-radius: 50%; 
  background: var(--cream); 
  padding: 3px; 
  border: 1px solid var(--gold); 
  overflow: hidden; 
} 
 
.brand-logo { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  border-radius: 50%; 
} 
 
.brand-name { 
  font-family: "Poppins", sans-serif; 
  font-size: 21px; 
  font-weight: 700; 
  letter-spacing: 3px; 
  color: #e2c875; 
} 
 
.brand-tagline { 
  margin-top: 5px; 
  font-size: 8px; 
  letter-spacing: 1.2px; 
  color: #aaa69d; 
} 
 
.nav-label { 
  margin: 27px 10px 10px; 
  font-size: 9px; 
  letter-spacing: 1.4px; 
  color: #9c8960; 
  font-weight: 700; 
} 
 
.nav-menu { 
  display: flex; 
  flex-direction: column; 
  gap: 4px; 
} 
 
.nav-item { 
  width: 100%; 
  border: 0; 
  background: transparent; 
  color: #bdbab3; 
  padding: 11px 13px; 
  border-radius: 7px; 
  display: flex; 
  align-items: center; 
  gap: 11px; 
  text-align: left; 
  font-size: 11px; 
  font-weight: 500; 
  transition: 0.18s ease; 
} 
 
.nav-item:hover { 
  background: #1d1d1d; 
  color: white; 
} 
 
.nav-item.active { 
  background: #252525; 
  color: #e0c56e; 
  border-left: 3px solid var(--gold); 
  padding-left: 10px; 
  font-weight: 600; 
} 
 
.nav-icon { 
  width: 22px; 
  text-align: center; 
  font-size: 16px; 
  color: #b59b59; 
} 
 
.nav-item.active .nav-icon { 
  color: var(--gold-light); 
} 
 
.sidebar-bottom { 
  position: absolute; 
  left: 16px; 
  right: 16px; 
  bottom: 20px; 
} 
 
.mini-brand { 
  border-top: 1px solid #292929; 
  padding-top: 14px; 
  display: flex; 
  gap: 9px; 
  align-items: center; 
  color: #aaa69d; 
} 
 
.mini-brand span { 
  color: var(--gold); 
  font-size: 17px; 
} 
 
.mini-brand strong { 
  display: block; 
  font-size: 9px; 
  letter-spacing: 1px; 
} 
 
.mini-brand small { 
  display: block; 
  margin-top: 3px; 
  font-size: 8px; 
  color: #6f6b64; 
} 
 
/* MAIN */ 
 
.main-area { 
  width: calc(100% - 245px); 
  margin-left: 245px; 
  min-height: 100vh; 
} 
 
.topbar { 
  height: 78px; 
  padding: 0 32px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  background: rgba(255, 255, 255, 0.94); 
  border-bottom: 1px solid var(--border); 
  position: sticky; 
  top: 0; 
  z-index: 10; 
  backdrop-filter: blur(12px); 
} 
 
.breadcrumb { 
  color: var(--gold); 
  text-transform: uppercase; 
  font-size: 8px; 
  letter-spacing: 1.3px; 
  margin-bottom: 4px; 
  font-weight: 700; 
} 
 
.topbar h1 { 
  margin: 0; 
  font-family: "Poppins", sans-serif; 
  font-size: 21px; 
  font-weight: 600; 
  color: var(--black); 
} 
 
.topbar-right { 
  display: flex; 
  align-items: center; 
  gap: 15px; 
} 
 
.refresh-btn { 
  width: 38px; 
  height: 38px; 
  border-radius: 8px; 
  border: 1px solid var(--border); 
  background: white; 
  color: #555; 
  font-size: 19px; 
  transition: 0.2s; 
} 
 
.refresh-btn:hover { 
  border-color: var(--gold); 
  color: var(--gold); 
} 
 
.admin-profile { 
  display: flex; 
  gap: 9px; 
  align-items: center; 
} 
 
.admin-avatar { 
  width: 38px; 
  height: 38px; 
  border-radius: 8px; 
  display: grid; 
  place-items: center; 
  background: var(--black); 
  color: var(--gold-light); 
  font-weight: 700; 
} 
 
.admin-profile strong, 
.admin-profile span { 
  display: block; 
} 
 
.admin-profile strong { 
  font-size: 10px; 
  color: var(--black); 
} 
 
.admin-profile span { 
  margin-top: 3px; 
  color: var(--muted); 
  font-size: 8px; 
} 
 
.page-content { 
  padding: 28px 32px 45px; 
  max-width: 1600px; 
} 
 
/* TOAST */ 
 
.toast { 
  position: fixed; 
  right: 25px; 
  top: 92px; 
  z-index: 100; 
  background: var(--black); 
  color: white; 
  padding: 11px 16px; 
  border-radius: 7px; 
  border-left: 3px solid var(--gold); 
  box-shadow: var(--shadow); 
  font-size: 10px; 
  font-weight: 600; 
} 
 
/* HERO */ 
 
.hero-card { 
  position: relative; 
  min-height: 255px; 
  overflow: hidden; 
  border-radius: 14px; 
  padding: 35px 38px; 
  background: #111111; 
  color: white; 
  border: 1px solid #2b2b2b; 
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12); 
} 
 
.hero-card::before { 
  content: ""; 
  position: absolute; 
  width: 330px; 
  height: 330px; 
  right: -150px; 
  top: -180px; 
  border-radius: 50%; 
  border: 1px solid rgba(195, 163, 74, 0.18); 
} 
 
.hero-card::after { 
  content: ""; 
  position: absolute; 
  width: 230px; 
  height: 230px; 
  right: -100px; 
  bottom: -150px; 
  border-radius: 50%; 
  border: 1px solid rgba(195, 163, 74, 0.12); 
} 
 
.hero-content { 
  position: relative; 
  z-index: 3; 
} 
 
.hero-kicker { 
  color: #bca65d; 
  font-size: 8px; 
  font-weight: 700; 
  letter-spacing: 1.6px; 
} 
 
.hero-card h2 { 
  margin: 13px 0 0; 
  line-height: 1.15; 
  font-weight: 600; 
} 
 
.marathi-tagline { 
  display: inline-block; 
  font-family: 
    "Noto Sans Devanagari", 
    "Nirmala UI", 
    sans-serif; 
  color: #e0c875; 
  font-size: 27px; 
  font-weight: 600; 
  letter-spacing: 0; 
  line-height: 1.4; 
} 
 
.hero-card p { 
  margin: 11px 0 0; 
  color: #aaa69d; 
  font-size: 8px; 
  letter-spacing: 1.8px; 
  font-weight: 600; 
} 
 
.hero-buttons { 
  display: flex; 
  gap: 9px; 
  margin-top: 22px; 
} 
 
.gold-btn, 
.light-btn, 
.primary-btn, 
.cancel-btn { 
  border-radius: 6px; 
  padding: 9px 15px; 
  font-size: 9px; 
  font-weight: 700; 
  transition: 0.18s; 
} 
 
.gold-btn { 
  background: var(--gold); 
  color: #111; 
  border: 0; 
} 
 
.gold-btn:hover { 
  background: var(--gold-light); 
  transform: translateY(-1px); 
} 
 
.light-btn { 
  background: transparent; 
  color: #ddd; 
  border: 1px solid #444; 
} 
 
.light-btn:hover { 
  border-color: var(--gold); 
  color: var(--gold-light); 
} 
 
.hero-products { 
  position: absolute; 
  right: 55px; 
  top: 43px; 
  display: flex; 
  gap: 12px; 
  align-items: center; 
  transform: rotate(-3deg); 
  z-index: 2; 
} 
 
.product-circle { 
  width: 82px; 
  height: 82px; 
  border-radius: 50%; 
  background: #f8f5ed; 
  border: 1px solid #a88d43; 
  display: grid; 
  place-items: center; 
  font-size: 34px; 
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25); 
} 
 
.product-circle:nth-child(2) { 
  width: 105px; 
  height: 105px; 
  transform: translateY(28px); 
} 
 
/* STATS */ 
 
.stats-grid { 
  display: grid; 
  grid-template-columns: repeat(4, 1fr); 
  gap: 14px; 
  margin: 20px 0; 
} 
 
.stat-card { 
  background: white; 
  border: 1px solid var(--border); 
  border-radius: 10px; 
  padding: 17px; 
  display: flex; 
  gap: 12px; 
  align-items: center; 
  box-shadow: 0 3px 15px rgba(20, 18, 14, 0.035); 
  transition: 0.18s; 
} 
 
.stat-card:hover { 
  transform: translateY(-2px); 
  border-color: #cdbb88; 
  box-shadow: var(--shadow); 
} 
 
.stat-icon { 
  width: 42px; 
  height: 42px; 
  border-radius: 8px; 
  background: #f4efe2; 
  color: #9d8135; 
  display: grid; 
  place-items: center; 
  font-size: 17px; 
  font-weight: 700; 
  border: 1px solid #e1d3af; 
} 
 
.stat-info span, 
.stat-info strong, 
.stat-info small { 
  display: block; 
} 
 
.stat-info span { 
  color: var(--muted); 
  font-size: 8px; 
  font-weight: 500; 
} 
 
.stat-info strong { 
  color: var(--black); 
  font-family: "Poppins", sans-serif; 
  font-size: 20px; 
  font-weight: 600; 
  margin: 3px 0; 
} 
 
.stat-info small { 
  color: #9b7e31; 
  font-size: 8px; 
  font-weight: 600; 
} 
 
/* PANELS */ 
 
.dashboard-grid { 
  display: grid; 
  grid-template-columns: 1.4fr 0.8fr; 
  gap: 16px; 
  margin-bottom: 16px; 
} 
 
.panel { 
  background: white; 
  border: 1px solid var(--border); 
  border-radius: 11px; 
  padding: 20px; 
  box-shadow: 0 3px 15px rgba(20, 18, 14, 0.035); 
} 
 
.panel-heading { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  gap: 15px; 
  margin-bottom: 17px; 
} 
 
.section-eyebrow { 
  color: #a48536; 
  font-size: 8px; 
  letter-spacing: 1.4px; 
  font-weight: 700; 
  text-transform: uppercase; 
} 
 
.panel h3, 
.page-intro h2 { 
  margin: 4px 0 0; 
  color: var(--black); 
  font-family: "Poppins", sans-serif; 
  font-weight: 600; 
} 
 
.panel h3 { 
  font-size: 18px; 
} 
 
.text-btn { 
  background: transparent; 
  border: 0; 
  color: #555; 
  font-size: 9px; 
  font-weight: 600; 
} 
 
.text-btn:hover { 
  color: var(--gold); 
} 
 
.category-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 9px; 
} 
 
.category-card { 
  min-height: 92px; 
  border: 1px solid var(--border); 
  background: #fcfbf8; 
  border-radius: 8px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  gap: 7px; 
  text-align: center; 
  transition: 0.18s; 
} 
 
.category-card:hover { 
  border-color: #cdbb88; 
  transform: translateY(-2px); 
  background: #fff; 
} 
 
.category-icon { 
  width: 40px; 
  height: 40px; 
  display: grid; 
  place-items: center; 
  background: #f2eee4; 
  border: 1px solid #dfd3b7; 
  border-radius: 50%; 
  font-size: 19px; 
} 
 
.category-card span { 
  font-size: 8px; 
  font-weight: 600; 
  color: var(--text); 
} 
 
.status-list { 
  display: flex; 
  flex-direction: column; 
} 
 
.status-row { 
  display: grid; 
  grid-template-columns: 9px 1fr auto; 
  align-items: center; 
  gap: 10px; 
  padding: 12px 2px; 
  border-bottom: 1px solid #eeeae2; 
  font-size: 10px; 
} 
 
.status-row:last-child { 
  border-bottom: 0; 
} 
 
.status-row strong { 
  color: var(--black); 
} 
 
.status-dot { 
  width: 7px; 
  height: 7px; 
  border-radius: 50%; 
} 
 
.status-dot.pending { 
  background: var(--gold); 
} 
 
.status-dot.processing { 
  background: #99948a; 
} 
 
.status-dot.completed { 
  background: var(--green); 
} 
 
.status-dot.cancelled { 
  background: var(--red); 
} 
 
/* TABLE */ 
 
.table-wrap { 
  width: 100%; 
  overflow-x: auto; 
} 
 
table { 
  width: 100%; 
  border-collapse: collapse; 
} 
 
th { 
  color: #8b877e; 
  font-size: 8px; 
  letter-spacing: 0.9px; 
  text-align: left; 
  padding: 10px; 
  border-bottom: 1px solid var(--border); 
  white-space: nowrap; 
  font-weight: 700; 
} 
 
td { 
  padding: 13px 10px; 
  border-bottom: 1px solid #eeeae3; 
  font-size: 9px; 
  color: #62605a; 
} 
 
.strong-cell { 
  color: var(--black); 
  font-weight: 700; 
} 
 
.status-badge, 
.customer-status { 
  display: inline-flex; 
  padding: 4px 8px; 
  border-radius: 20px; 
  font-size: 7px; 
  font-weight: 700; 
} 
 
.status-badge.pending { 
  background: #f6edcf; 
  color: #856b22; 
} 
 
.status-badge.processing { 
  background: #ece9e2; 
  color: #67635b; 
} 
 
.status-badge.completed { 
  background: #e5eee5; 
  color: #526d55; 
} 
 
.status-badge.cancelled { 
  background: #f0e3e0; 
  color: #895b55; 
} 
 
.customer-status { 
  background: #e5eee5; 
  color: #526d55; 
} 
 
.table-actions { 
  display: flex; 
  gap: 5px; 
} 
 
.table-actions button, 
.product-actions button { 
  border: 1px solid var(--border); 
  background: white; 
  color: #444; 
  padding: 5px 8px; 
  border-radius: 5px; 
  font-size: 8px; 
  font-weight: 600; 
} 
 
.table-actions button:hover, 
.product-actions button:hover { 
  border-color: var(--gold); 
  color: #9a7b2e; 
} 
 
.delete-btn { 
  color: #92544e !important; 
} 
 
.recent-panel { 
  margin-bottom: 10px; 
} 
 
/* PAGE INTRO */ 
 
.page-intro { 
  display: flex; 
  justify-content: space-between; 
  align-items: end; 
  gap: 20px; 
  margin-bottom: 20px; 
} 
 
.page-intro h2 { 
  font-size: 27px; 
} 
 
.page-intro p { 
  color: var(--muted); 
  font-size: 9px; 
  margin: 7px 0 0; 
} 
 
.primary-btn { 
  background: var(--black); 
  color: #dfc873; 
  border: 1px solid #333; 
  box-shadow: none; 
} 
 
.primary-btn:hover { 
  background: #252525; 
  color: #e8d38b; 
  border-color: var(--gold); 
} 
 
/* TOOLBAR */ 
 
.toolbar { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 14px; 
} 
 
.search-box { 
  width: 300px; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  padding: 8px 11px; 
  background: white; 
  border: 1px solid var(--border); 
  border-radius: 7px; 
} 
 
.search-box:focus-within { 
  border-color: #c8ad63; 
  box-shadow: 0 0 0 3px rgba(195, 163, 74, 0.08); 
} 
 
.search-box span { 
  color: #a68739; 
  font-size: 16px; 
} 
 
.search-box input { 
  width: 100%; 
  border: 0; 
  outline: 0; 
  background: transparent; 
  color: var(--text); 
  font-size: 9px; 
} 
 
/* PRODUCTS */ 
 
.product-grid { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 15px; 
} 
 
.product-card { 
  background: white; 
  border: 1px solid var(--border); 
  border-radius: 10px; 
  overflow: hidden; 
  box-shadow: 0 3px 15px rgba(20, 18, 14, 0.035); 
  transition: 0.18s; 
} 
 
.product-card:hover { 
  transform: translateY(-3px); 
  border-color: #cdbb88; 
  box-shadow: var(--shadow); 
} 
 
.product-image { 
  height: 120px; 
  background: #f5f1e7; 
  display: grid; 
  place-items: center; 
  font-size: 50px; 
  border-bottom: 1px solid var(--border); 
} 
 
.product-card-body { 
  padding: 15px; 
} 
 
.product-category { 
  color: #a48536; 
  font-size: 8px; 
  text-transform: uppercase; 
  letter-spacing: 0.9px; 
  font-weight: 700; 
} 
 
.product-card h3 { 
  margin: 6px 0 11px; 
  font-family: "Poppins", sans-serif; 
  color: var(--black); 
  font-size: 16px; 
  font-weight: 600; 
} 
 
.product-meta { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
} 
 
.product-meta strong { 
  color: var(--black); 
  font-family: "Poppins", sans-serif; 
  font-size: 15px; 
  font-weight: 600; 
} 
 
.stock { 
  font-size: 8px; 
  font-weight: 600; 
} 
 
.stock.good { 
  color: var(--green); 
} 
 
.stock.bad { 
  color: var(--red); 
} 
 
.product-actions { 
  display: flex; 
  gap: 6px; 
  margin-top: 13px; 
} 
 
/* ANALYTICS */

.analytics-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 17px;
}

.analytics-card {
  background: var(--black);
  color: white;
  border-radius: 10px;
  padding: 19px;
  border: 1px solid #2d2d2d;
}

.analytics-card-light {
  background: #fffdf9;
  color: var(--black);
  border: 1px solid #e8e1d6;
}

.analytics-card span {
  display: block;
  color: #aaa69d;
  font-size: 8px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.analytics-card strong {
  display: block;
  color: var(--gold-light);
  font-family: "Poppins", sans-serif;
  font-size: 25px;
  font-weight: 600;
  margin-top: 5px;
}

.analytics-card-light strong {
  color: var(--black);
}

.analytics-card small {
  display: block;
  margin-top: 7px;
  color: #aaa69d;
  font-size: 8px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: 1.65fr 1fr;
  gap: 17px;
  margin-bottom: 17px;
}

.analytics-bottom-grid {
  grid-template-columns: 1.65fr 1fr;
}

.analytics-chart-panel {
  min-width: 0;
}

.analytics-live-note {
  font-size: 9px;
  color: #9b958b;
}

.analytics-line-chart {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  background: #fffdfa;
  border: 1px solid #eee8de;
  padding: 7px 5px 0;
}

.analytics-line-chart svg {
  display: block;
  width: 100%;
  height: 245px;
}

.chart-grid-line {
  stroke: #ece7de;
  stroke-width: 1;
}

.chart-area {
  fill: rgba(200, 151, 53, 0.10);
}

.chart-line-path {
  fill: none;
  stroke: #c89735;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-dot {
  fill: #c89735;
  stroke: #fffdf9;
  stroke-width: 3;
}

.chart-label {
  fill: #918b81;
  font-size: 10px;
  font-family: "Poppins", sans-serif;
}

.analytics-chart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  color: #9b958b;
  font-size: 8px;
}

.analytics-chart-footer strong {
  color: #24211d;
  font-size: 11px;
}

.status-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-chart-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-chart-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #4d4942;
}

.status-chart-top strong {
  color: #24211d;
}

.status-bar,
.category-progress {
  height: 6px;
  background: #eeeae3;
  border-radius: 999px;
  overflow: hidden;
}

.status-bar span,
.category-progress span {
  display: block;
  height: 100%;
  background: #c89735;
  border-radius: inherit;
}

.status-chart-row small {
  color: #aaa69d;
  font-size: 8px;
}

.analytics-list {
  display: flex;
  flex-direction: column;
}

.analytics-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 13px 2px;
  border-bottom: 1px solid #eeeae3;
  font-size: 10px;
}

.analytics-category-row > div {
  min-width: 0;
  flex: 1;
}

.analytics-category-row > div > span {
  display: block;
  margin-bottom: 7px;
  color: #4d4942;
}

.analytics-row strong {
  color: #24211d;
  font-size: 10px;
}

.analytics-insight-panel h3 {
  margin: 5px 0 16px;
  color: #24211d;
  font-size: 16px;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #eeeae3;
}

.insight-item span {
  color: #9b958b;
  font-size: 9px;
}

.insight-item strong {
  color: #24211d;
  font-size: 10px;
  text-align: right;
}

/* EMPTY */ 
 
.empty-state { 
  text-align: center; 
  padding: 42px 20px; 
  color: var(--muted); 
} 
 
.empty-state h4 { 
  margin: 10px 0 5px; 
  color: var(--black); 
  font-family: "Poppins", sans-serif; 
  font-size: 16px; 
  font-weight: 600; 
} 
 
.empty-state p { 
  margin: 0; 
  font-size: 9px; 
} 
 
.empty-icon { 
  width: 48px; 
  height: 48px; 
  margin: auto; 
  border-radius: 50%; 
  background: #f3eee2; 
  color: #a48536; 
  border: 1px solid #dfd1ad; 
  display: grid; 
  place-items: center; 
  font-size: 19px; 
} 
 
.full-width { 
  grid-column: 1 / -1; 
} 
 
/* MODAL */ 
 
.modal-overlay { 
  position: fixed; 
  inset: 0; 
  z-index: 100; 
  background: rgba(10, 10, 10, 0.65); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  padding: 20px; 
  backdrop-filter: blur(4px); 
} 
 
.modal { 
  width: min(520px, 100%); 
  max-height: 90vh; 
  overflow-y: auto; 
  background: white; 
  border: 1px solid #d6c58f; 
  border-radius: 12px; 
  padding: 23px; 
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25); 
} 
 
.modal-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: start; 
  margin-bottom: 19px; 
} 
 
.modal-header h3 { 
  margin: 4px 0 0; 
  font-family: "Poppins", sans-serif; 
  color: var(--black); 
  font-size: 20px; 
  font-weight: 600; 
} 
 
.close-btn { 
  width: 31px; 
  height: 31px; 
  border-radius: 7px; 
  border: 1px solid var(--border); 
  background: #fafafa; 
  color: #555; 
  font-size: 19px; 
} 
 
.close-btn:hover { 
  border-color: var(--gold); 
  color: #9a7b2e; 
} 
 
.modal label { 
  display: block; 
  color: #393733; 
  font-size: 9px; 
  font-weight: 600; 
  margin: 12px 0 5px; 
} 
 
.modal input, 
.modal select, 
.modal textarea { 
  width: 100%; 
  border: 1px solid var(--border); 
  border-radius: 6px; 
  background: white; 
  padding: 9px 10px; 
  outline: none; 
  color: var(--text); 
  font-size: 9px; 
} 
 
.modal input:focus, 
.modal select:focus, 
.modal textarea:focus { 
  border-color: #c8ad63; 
  box-shadow: 0 0 0 3px rgba(195, 163, 74, 0.08); 
} 
 
.modal textarea { 
  min-height: 80px; 
  resize: vertical; 
} 
 
.form-two-col { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 11px; 
} 
 
.modal-actions { 
  display: flex; 
  justify-content: flex-end; 
  gap: 8px; 
  margin-top: 21px; 
} 
 
.cancel-btn { 
  background: white; 
  color: #444; 
  border: 1px solid var(--border); 
} 
 
.cancel-btn:hover { 
  border-color: var(--gold); 
  color: #9a7b2e; 
} 
 
/* LOADING */ 
 
.loading-box { 
  min-height: 60vh; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-direction: column; 
  color: var(--muted); 
} 
 
.loader { 
  width: 32px; 
  height: 32px; 
  border: 3px solid #e4dfd5; 
  border-top-color: var(--gold); 
  border-radius: 50%; 
  animation: spin 0.8s linear infinite; 
} 
 
@keyframes spin { 
  to { 
    transform: rotate(360deg); 
  } 
} 
 
.placeholder-panel { 
  min-height: 350px; 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
} 
 
.placeholder-icon { 
  width: 65px; 
  height: 65px; 
  display: grid; 
  place-items: center; 
  border-radius: 50%; 
  background: #f3eee2; 
  border: 1px solid #dfd1ad; 
  color: #a48536; 
  font-size: 29px; 
} 
 
.placeholder-panel p { 
  color: var(--muted); 
  font-size: 9px; 
} 
 
/* RESPONSIVE */ 
 
@media (max-width: 1100px) { 
  .stats-grid { 
    grid-template-columns: repeat(2, 1fr); 
  } 
 
  .dashboard-grid { 
    grid-template-columns: 1fr; 
  } 
 
  .product-grid { 
    grid-template-columns: repeat(2, 1fr); 
  } 
 
  .hero-products { 
    right: 25px; 
    opacity: 0.3; 
  } 
} 
 
@media (max-width: 800px) { 
  .sidebar { 
    width: 200px; 
  } 
 
  .main-area { 
    width: calc(100% - 200px); 
    margin-left: 200px; 
  } 
 
  .page-content { 
    padding: 20px 17px; 
  } 
 
  .topbar { 
    padding: 0 17px; 
  } 
 
  .admin-profile { 
    display: none; 
  } 
 
  .category-grid { 
    grid-template-columns: repeat(2, 1fr); 
  } 
} 
 
@media (max-width: 600px) { 
  .sidebar { 
    width: 68px; 
    padding: 14px 8px; 
  } 
 
  .brand-name, 
  .brand-tagline, 
  .nav-label, 
  .nav-item span:last-child, 
  .sidebar-bottom { 
    display: none; 
  } 
 
  .brand-area { 
    border: 0; 
  } 
 
  .logo-box { 
    width: 50px; 
    height: 50px; 
  } 
 
  .nav-item { 
    justify-content: center; 
    padding: 12px 5px; 
  } 
 
  .main-area { 
    width: calc(100% - 68px); 
    margin-left: 68px; 
  } 
 
  .topbar { 
    height: 70px; 
  } 
 
  .topbar h1 { 
    font-size: 17px; 
  } 
 
  .stats-grid, 
  .product-grid, 
  .analytics-cards { 
    grid-template-columns: 1fr; 
  } 
 
  .hero-card { 
    padding: 25px; 
  } 
 
  .marathi-tagline { 
    font-size: 22px; 
  } 
 
  .hero-products { 
    display: none; 
  } 
 
  .page-intro { 
    align-items: start; 
    flex-direction: column; 
  } 
 
  .form-two-col { 
    grid-template-columns: 1fr; 
  } 
 
  .search-box { 
    width: 100%; 
  } 
} 


/* REVIEWS */
.review-summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}.review-summary-card{background:white;border:1px solid var(--border);border-radius:10px;padding:17px}.review-summary-card span{display:block;color:var(--muted);font-size:8px}.review-summary-card strong{display:block;margin-top:5px;color:var(--black);font-size:24px}.review-summary-card small{display:block;margin-top:5px;color:#918b7f;font-size:7px}.review-stars{margin-top:5px;color:var(--gold);letter-spacing:2px;font-size:10px}.review-toolbar{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:16px}.review-search{margin:0}.review-filters{display:flex;gap:5px;flex-wrap:wrap}.review-filter{border:1px solid var(--border);background:white;color:#666159;border-radius:6px;padding:7px 10px;font-size:8px;font-weight:600}.review-filter.active{background:var(--black);border-color:var(--black);color:var(--gold-light)}.review-breakdown-panel{margin-bottom:22px}.rating-breakdown{display:flex;flex-direction:column;gap:10px}.rating-breakdown-row{display:grid;grid-template-columns:35px 1fr 30px;align-items:center;gap:10px}.rating-breakdown-row>span{font-size:8px}.rating-breakdown-row>strong{text-align:right;font-size:8px}.rating-bar{height:6px;border-radius:20px;overflow:hidden;background:#eeeae2}.rating-bar>div{height:100%;background:var(--gold);border-radius:20px}.reviews-section-heading{display:flex;align-items:end;justify-content:space-between;margin:0 0 12px}.reviews-section-heading h3{margin:4px 0 0;font-size:18px}.review-count-label{color:var(--muted);font-size:8px}.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.review-card{background:white;border:1px solid var(--border);border-radius:10px;padding:17px}.review-card-top{display:flex;align-items:center;gap:10px}.review-avatar{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:var(--black);color:var(--gold-light);font-size:11px;font-weight:700}.review-customer{flex:1}.review-customer strong,.review-customer span{display:block}.review-customer strong{font-size:10px}.review-customer span{margin-top:3px;color:var(--muted);font-size:7px}.review-delete{width:25px;height:25px;border:1px solid var(--border);background:white;border-radius:5px;color:#9a5c56;font-size:15px}.review-rating{margin-top:13px;color:var(--gold);font-size:11px;letter-spacing:1px}.review-rating span{color:#d8d3c8}.review-text{min-height:62px;margin:11px 0;color:#5f5b54;font-size:9px;line-height:1.7}.review-card-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #eeeae3}.review-card-bottom>span:first-child{color:#989187;font-size:7px}.review-status{background:#e5eee5;color:#526d55;border-radius:20px;padding:4px 7px;font-size:7px;font-weight:700}.review-note{margin-top:17px;padding:11px 13px;border-left:3px solid var(--gold);background:#f7f3e8;color:#716b60;font-size:8px;line-height:1.6}.review-note strong{color:var(--black)}
@media(max-width:1100px){.review-summary-grid{grid-template-columns:repeat(2,1fr)}.reviews-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:800px){.review-toolbar{align-items:stretch;flex-direction:column}.review-search{width:100%}}
@media(max-width:600px){.review-summary-grid,.reviews-grid{grid-template-columns:1fr}.reviews-section-heading{align-items:start;flex-direction:column;gap:6px}}

.enterprise-summary-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin:0 0 18px}.enterprise-summary-card{background:#fff;border:1px solid var(--border);border-radius:10px;padding:17px}.enterprise-summary-card span{display:block;color:var(--muted);font-size:9px}.enterprise-summary-card strong{display:block;margin-top:7px;font-size:22px;color:var(--black)}.enterprise-refresh{width:auto;padding:10px 14px}.enterprise-modal-backdrop{position:fixed;inset:0;background:rgba(10,10,10,.55);z-index:10000;display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto}.enterprise-modal{background:#fffdf8;width:min(760px,100%);max-height:90vh;overflow:auto;border-radius:14px;padding:24px;border:1px solid #e9dfc7;box-shadow:0 24px 70px rgba(0,0,0,.24)}.enterprise-modal .panel-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}.enterprise-modal .panel-heading h3{margin:0}.close-btn{border:1px solid var(--border);background:white;border-radius:7px;width:32px;height:32px;font-size:20px}.enterprise-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.enterprise-form-grid label{display:flex;flex-direction:column;gap:6px;color:#5d584f;font-size:11px;font-weight:600}.enterprise-form-grid input,.enterprise-form-grid select{width:100%;padding:11px;border:1px solid #e5dfd2;border-radius:7px;background:white;color:#24221e;font:inherit}.enterprise-form-actions{grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;margin-top:10px}.enterprise-form-actions button{padding:11px 16px;border-radius:7px;border:1px solid #ddd}.enterprise-form-actions .gold-btn{background:var(--black);color:var(--gold-light);border-color:var(--black)}@media(max-width:700px){.enterprise-form-grid{grid-template-columns:1fr}.enterprise-form-actions{grid-column:1}.enterprise-modal{padding:18px}}
`; 

export default App;