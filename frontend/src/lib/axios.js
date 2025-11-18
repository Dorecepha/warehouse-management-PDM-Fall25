/* import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again later.';

    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === 'string') {
        message = data;
      } else if (typeof data === 'object') {
        message = data.message ?? data.error ?? message;
      }
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default api; */
// This is our FAKE backend.
// We are temporarily commenting out the real 'axios'
// import axios from 'axios';

// const api = axios.create({ ... });
// ... all the real interceptors ...
// export default api;

// -----------------------------------------------------------------
// --- START OF FAKE API ---
// -----------------------------------------------------------------

const FAKE_DELAY = 400;

let fakeDatabase = {
  products: [
    {
      id: 1,
      name: 'Test Product 1',
      sku: 'TP001',
      price: 10.99,
      stockQuantity: 100,
      description: 'A test product',
      categoryId: 1,
      imageUrl: 'https://via.placeholder.com/300',
    },
    {
      id: 2,
      name: 'Test Product 2',
      sku: 'TP002',
      price: 49.5,
      stockQuantity: 50,
      description: 'Another test product',
      categoryId: 2,
      imageUrl: 'https://via.placeholder.com/300',
    },
  ],
  categories: [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Office Supplies' },
  ],
  suppliers: [
    {
      id: 1,
      name: 'Supplier A',
      contactInfo: '123-456-7890',
      address: '123 Main St',
    },
    {
      id: 2,
      name: 'Supplier B',
      contactInfo: 'supplier@b.com',
      address: '456 Market St',
    },
  ],
  transactions: [
    {
      id: 1,
      transactionType: 'PURCHASE',
      status: 'COMPLETED',
      totalPrice: 1099.0,
      totalProducts: 100,
      createdAt: new Date().toISOString(),
      product: { name: 'Test Product 1', sku: 'TP001', price: 10.99 },
      user: {
        id: 1,
        name: 'Admin User',
        email: 'admin@test.com',
        phoneNumber: '555-5555',
        role: 'ADMIN',
      },
      supplier: {
        id: 1,
        name: 'Supplier A',
        contactInfo: '123-456-7890',
        address: '123 Main St',
      },
    },
  ],
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@test.com',
      phoneNumber: '555-5555',
      role: 'ADMIN',
    },
    {
      id: 2,
      name: 'Manager User',
      email: 'manager@test.com',
      phoneNumber: '111-2222',
      role: 'MANAGER',
    },
  ],
};

let nextIds = {
  product: 3,
  category: 3,
  supplier: 3,
  transaction: 2,
  user: 3,
};

const paginate = (array, page = 1, limit = 10) => {
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / limit);
  const data = array.slice((page - 1) * limit, page * limit);
  return {
    meta: { totalPages, totalElements: totalItems, page, limit },
    data,
  };
};

const fakeApi = {
  get: (url, config) => {
    console.log(`%cFAKE API GET: ${url}`, 'color: #00AAbF', config);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (url === '/auth/login') {
            return reject(new Error('Login should be a POST request.'));
          }
          if (url === '/users/current') {
            const user = fakeDatabase.users[0];
            return resolve({ data: user });
          }

          if (url.startsWith('/products/')) {
            const id = parseInt(url.split('/')[2]);
            const product = fakeDatabase.products.find((p) => p.id === id);
            return resolve({ data: { product } });
          }
          if (url === '/products') {
            const { data, meta } = paginate(fakeDatabase.products);
            return resolve({ data: { products: data, meta } });
          }

          if (url === '/categories') {
            const { data, meta } = paginate(fakeDatabase.categories);
            return resolve({ data: { categories: data, meta } });
          }
          if (url.startsWith('/categories/')) {
            const id = parseInt(url.split('/')[2]);
            const category = fakeDatabase.categories.find((c) => c.id === id);
            return resolve({ data: { category } });
          }

          if (url === '/suppliers') {
            const { data, meta } = paginate(fakeDatabase.suppliers);
            return resolve({ data: { suppliers: data, meta } });
          }
          if (url.startsWith('/suppliers/')) {
            const id = parseInt(url.split('/')[2]);
            const supplier = fakeDatabase.suppliers.find((s) => s.id === id);
            return resolve({ data: { supplier } });
          }

          if (url.startsWith('/transactions/')) {
            const id = parseInt(url.split('/')[2]);
            const tx = fakeDatabase.transactions.find((t) => t.id === id);
            return resolve({ data: { transaction: tx } });
          }
          if (url === '/transactions') {
            const { data, meta } = paginate(fakeDatabase.transactions);
            return resolve({ data: { transactions: data, meta } });
          }
          if (url === '/transactions/by-month-year') {
            const { data, meta } = paginate(fakeDatabase.transactions);
            return resolve({ data: { transactions: data, meta } });
          }

          if (url === '/users/all') {
            return resolve({ data: { users: fakeDatabase.users } });
          }
          if (url.startsWith('/users/')) {
            const id = parseInt(url.split('/')[2]);
            const user = fakeDatabase.users.find((u) => u.id === id);
            return resolve({ data: { user } });
          }

          resolve({ data: {} });
        } catch (e) {
          reject(new Error(e.message));
        }
      }, FAKE_DELAY);
    });
  },

  post: (url, payload) => {
    console.log(`%cFAKE API POST: ${url}`, 'color: #00BF4F', payload);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (url === '/auth/login') {
            const role = payload.email.startsWith('admin')
              ? 'ADMIN'
              : 'MANAGER';
            const user =
              role === 'ADMIN' ? fakeDatabase.users[0] : fakeDatabase.users[1];
            return resolve({
              data: {
                token: `fake-${role}-token-12345`,
                role: role,
                user: user,
              },
            });
          }
          if (url === '/auth/register') {
            const newUser = { ...payload, id: nextIds.user++, role: 'MANAGER' };
            fakeDatabase.users.push(newUser);
            return resolve({ data: { message: 'Registration successful' } });
          }

          if (url === '/transactions') {
            const newId = nextIds.transaction++;
            const product = fakeDatabase.products.find(
              (p) => p.id === payload.productId
            );
            const supplier = fakeDatabase.suppliers.find(
              (s) => s.id === payload.supplierId
            );
            const newTx = {
              ...payload,
              id: newId,
              createdAt: new Date().toISOString(),
              status: 'PENDING',
              totalPrice: product.price * payload.quantity,
              totalProducts: payload.quantity,
              product,
              supplier,
              user: fakeDatabase.users[0],
            };
            fakeDatabase.transactions.unshift(newTx);
            return resolve({ data: { transaction: newTx } });
          }

          if (url === '/categories') {
            const newId = nextIds.category++;
            const newCat = { ...payload, id: newId };
            fakeDatabase.categories.unshift(newCat);
            return resolve({ data: { category: newCat } });
          }

          if (url === '/suppliers') {
            const newId = nextIds.supplier++;
            const newSupplier = { ...payload, id: newId };
            fakeDatabase.suppliers.unshift(newSupplier);
            return resolve({ data: { supplier: newSupplier } });
          }

          if (url === '/products') {
            const newId = nextIds.product++;
            const newProduct = {
              ...payload,
              id: newId,
              imageUrl: 'https://via.placeholder.com/300',
            };
            fakeDatabase.products.unshift(newProduct);
            return resolve({ data: { product: newProduct } });
          }

          resolve({ data: { success: true } });
        } catch (e) {
          reject(new Error(e.message));
        }
      }, FAKE_DELAY);
    });
  },

  put: (url, payload) => {
    console.log(`%cFAKE API PUT: ${url}`, 'color: #D9822B', payload);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (url.startsWith('/transactions/')) {
            const id = parseInt(url.split('/')[2]);
            const tx = fakeDatabase.transactions.find((t) => t.id === id);
            if (tx) tx.status = payload.status;
            return resolve({ data: { transaction: tx } });
          }
          if (url.startsWith('/users/update/')) {
            const id = parseInt(url.split('/')[3]);
            let user = fakeDatabase.users.find((u) => u.id === id);
            if (user) {
              user = { ...user, ...payload };
              fakeDatabase.users = fakeDatabase.users.map((u) =>
                u.id === id ? user : u
              );
              return resolve({ data: { user } });
            }
          }
          if (url.startsWith('/categories/')) {
            const id = parseInt(url.split('/')[2]);
            let cat = fakeDatabase.categories.find((c) => c.id === id);
            if (cat) {
              cat.name = payload.name;
              return resolve({ data: { category: cat } });
            }
          }

          resolve({ data: { success: true } });
        } catch (e) {
          reject(new Error(e.message));
        }
      }, FAKE_DELAY);
    });
  },

  delete: (url) => {
    console.log(`%cFAKE API DELETE: ${url}`, 'color: #D9482B');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (url.startsWith('/products/')) {
            const id = parseInt(url.split('/')[2]);
            fakeDatabase.products = fakeDatabase.products.filter(
              (p) => p.id !== id
            );
          }
          if (url.startsWith('/categories/')) {
            const id = parseInt(url.split('/')[2]);
            fakeDatabase.categories = fakeDatabase.categories.filter(
              (c) => c.id !== id
            );
          }
          if (url.startsWith('/suppliers/')) {
            const id = parseInt(url.split('/')[2]);
            fakeDatabase.suppliers = fakeDatabase.suppliers.filter(
              (s) => s.id !== id
            );
          }
          resolve({ data: { success: true } });
        } catch (e) {
          reject(new Error(e.message));
        }
      }, FAKE_DELAY);
    });
  },
};

export default fakeApi;
