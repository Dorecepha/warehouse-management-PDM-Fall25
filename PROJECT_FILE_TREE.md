# Warehouse Management System - Complete File Tree

## Project Root
```
warehouse-management-PDM-Fall25/
├── Backend/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── org/
│       │   │       └── pdm/
│       │   │           └── backend/
│       │   │               ├── BackendApplication.java
│       │   │               ├── controller/
│       │   │               │   ├── AuthController.java
│       │   │               │   ├── CategoryController.java
│       │   │               │   ├── ProductController.java
│       │   │               │   ├── SupplierController.java
│       │   │               │   ├── TransactionController.java
│       │   │               │   └── UserController.java
│       │   │               ├── enums/
│       │   │               │   ├── TransactionStatus.java
│       │   │               │   ├── TransactionType.java
│       │   │               │   └── UserRole.java
│       │   │               ├── exception/
│       │   │               │   ├── CustomAccessDenialHandler.java
│       │   │               │   ├── CustomAuthenticationEntryPoint.java
│       │   │               │   ├── GlobalExceptionHandler.java
│       │   │               │   ├── InvalidCredentialsException.java
│       │   │               │   ├── NameValueRequiredException.java
│       │   │               │   └── NotFoundException.java
│       │   │               ├── model/
│       │   │               │   ├── Category.java
│       │   │               │   ├── Product.java
│       │   │               │   ├── Supplier.java
│       │   │               │   ├── Transaction.java
│       │   │               │   └── User.java
│       │   │               ├── repository/
│       │   │               │   ├── CategoryRepository.java
│       │   │               │   ├── CustomCategoryRepository.java
│       │   │               │   ├── ProductRepository.java
│       │   │               │   ├── SupplierRepository.java
│       │   │               │   ├── TransactionRepository.java
│       │   │               │   ├── UserRepository.java
│       │   │               │   └── Impl/
│       │   │               │       ├── CategoryRepositoryImpl.java
│       │   │               │       ├── ProductRepositoryImpl.java
│       │   │               │       ├── SupplierRepositoryImpl.java
│       │   │               │       ├── TransactionRepositoryImpl.java
│       │   │               │       └── UserRepositoryImpl.java
│       │   │               ├── security/
│       │   │               │   ├── AuthFilter.java
│       │   │               │   ├── AuthUser.java
│       │   │               │   ├── CorsConfig.java
│       │   │               │   ├── CustomUserDetailsService.java
│       │   │               │   ├── DatabaseConfig.java
│       │   │               │   ├── JwtUtils.java
│       │   │               │   └── SecurityConfig.java
│       │   │               ├── service/
│       │   │               │   ├── CategoryService.java
│       │   │               │   ├── ProductService.java
│       │   │               │   ├── SupplierService.java
│       │   │               │   ├── TransactionService.java
│       │   │               │   ├── UserService.java
│       │   │               │   └── Impl/
│       │   │               │       ├── CategoryServiceImpl.java
│       │   │               │       ├── ProductServiceImpl.java
│       │   │               │       ├── SupplierServiceImpl.java
│       │   │               │       ├── TransactionServiceImpl.java
│       │   │               │       └── UserServiceImpl.java
│       │   │               └── wrappers/
│       │   │                   ├── LoginRequest.java
│       │   │                   ├── RegisterRequest.java
│       │   │                   ├── Response.java
│       │   │                   └── TransactionRequest.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│           └── java/
│               └── org/
│                   └── pdm/
│                       └── backend/
│                           └── BackendApplicationTests.java
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── README.md
│   ├── setup.ps1
│   ├── setup.sh
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── App.test.js
│       ├── index.js
│       ├── index.css
│       ├── logo.svg
│       ├── reportWebVitals.js
│       ├── setupTests.js
│       ├── components/
│       │   ├── AppLayout.jsx
│       │   ├── PaginationComponent.jsx
│       │   └── ProtectedRoute.jsx
│       ├── features/
│       │   ├── categories/
│       │   │   ├── api.js
│       │   │   ├── CategoryForm.jsx
│       │   │   └── schema.js
│       │   ├── products/
│       │   │   ├── api.js
│       │   │   ├── api - products.js
│       │   │   ├── ProductForm.jsx
│       │   │   └── schema.js
│       │   ├── suppliers/
│       │   │   ├── api.js
│       │   │   ├── schema.js
│       │   │   └── SupplierForm.jsx
│       │   ├── transactions/
│       │   │   ├── api.js
│       │   │   ├── PurchaseForm.jsx
│       │   │   ├── purchaseSchema.js
│       │   │   ├── SellForm.jsx
│       │   │   └── sellSchema.js
│       │   └── users/
│       │       ├── api.js
│       │       ├── ProfileForm.jsx
│       │       └── profileSchema.js
│       ├── lib/
│       │   └── axios.js
│       └── pages/
│           ├── CategoryPage.jsx
│           ├── DashboardPage.jsx
│           ├── LoginPage.jsx
│           ├── ProductCreatePage.jsx
│           ├── ProductEditPage.jsx
│           ├── ProductPage.jsx
│           ├── ProfilePage.jsx
│           ├── PurchasePage.jsx
│           ├── RegisterPage.jsx
│           ├── SellPage.jsx
│           ├── SupplierCreatePage.jsx
│           ├── SupplierEditPage.jsx
│           ├── SupplierPage.jsx
│           ├── TransactionDetailsPage.jsx
│           └── TransactionsPage.jsx
│
└── docs/
    └── windows-troubleshooting.md
```

## File Paths Reference

### Backend Java Files

**Controllers:**
- `Backend/src/main/java/org/pdm/backend/controller/AuthController.java`
- `Backend/src/main/java/org/pdm/backend/controller/CategoryController.java`
- `Backend/src/main/java/org/pdm/backend/controller/ProductController.java`
- `Backend/src/main/java/org/pdm/backend/controller/SupplierController.java`
- `Backend/src/main/java/org/pdm/backend/controller/TransactionController.java`
- `Backend/src/main/java/org/pdm/backend/controller/UserController.java`

**Models:**
- `Backend/src/main/java/org/pdm/backend/model/Category.java`
- `Backend/src/main/java/org/pdm/backend/model/Product.java`
- `Backend/src/main/java/org/pdm/backend/model/Supplier.java`
- `Backend/src/main/java/org/pdm/backend/model/Transaction.java`
- `Backend/src/main/java/org/pdm/backend/model/User.java`

**Repositories:**
- `Backend/src/main/java/org/pdm/backend/repository/CategoryRepository.java`
- `Backend/src/main/java/org/pdm/backend/repository/CustomCategoryRepository.java`
- `Backend/src/main/java/org/pdm/backend/repository/ProductRepository.java`
- `Backend/src/main/java/org/pdm/backend/repository/SupplierRepository.java`
- `Backend/src/main/java/org/pdm/backend/repository/TransactionRepository.java`
- `Backend/src/main/java/org/pdm/backend/repository/UserRepository.java`
- `Backend/src/main/java/org/pdm/backend/repository/Impl/CategoryRepositoryImpl.java`
- `Backend/src/main/java/org/pdm/backend/repository/Impl/ProductRepositoryImpl.java`
- `Backend/src/main/java/org/pdm/backend/repository/Impl/SupplierRepositoryImpl.java`
- `Backend/src/main/java/org/pdm/backend/repository/Impl/TransactionRepositoryImpl.java`
- `Backend/src/main/java/org/pdm/backend/repository/Impl/UserRepositoryImpl.java`

**Services:**
- `Backend/src/main/java/org/pdm/backend/service/CategoryService.java`
- `Backend/src/main/java/org/pdm/backend/service/ProductService.java`
- `Backend/src/main/java/org/pdm/backend/service/SupplierService.java`
- `Backend/src/main/java/org/pdm/backend/service/TransactionService.java`
- `Backend/src/main/java/org/pdm/backend/service/UserService.java`
- `Backend/src/main/java/org/pdm/backend/service/Impl/CategoryServiceImpl.java`
- `Backend/src/main/java/org/pdm/backend/service/Impl/ProductServiceImpl.java`
- `Backend/src/main/java/org/pdm/backend/service/Impl/SupplierServiceImpl.java`
- `Backend/src/main/java/org/pdm/backend/service/Impl/TransactionServiceImpl.java`
- `Backend/src/main/java/org/pdm/backend/service/Impl/UserServiceImpl.java`

**Security:**
- `Backend/src/main/java/org/pdm/backend/security/AuthFilter.java`
- `Backend/src/main/java/org/pdm/backend/security/AuthUser.java`
- `Backend/src/main/java/org/pdm/backend/security/CorsConfig.java`
- `Backend/src/main/java/org/pdm/backend/security/CustomUserDetailsService.java`
- `Backend/src/main/java/org/pdm/backend/security/DatabaseConfig.java`
- `Backend/src/main/java/org/pdm/backend/security/JwtUtils.java`
- `Backend/src/main/java/org/pdm/backend/security/SecurityConfig.java`

**Wrappers:**
- `Backend/src/main/java/org/pdm/backend/wrappers/LoginRequest.java`
- `Backend/src/main/java/org/pdm/backend/wrappers/RegisterRequest.java`
- `Backend/src/main/java/org/pdm/backend/wrappers/Response.java`
- `Backend/src/main/java/org/pdm/backend/wrappers/TransactionRequest.java`

**Enums:**
- `Backend/src/main/java/org/pdm/backend/enums/TransactionStatus.java`
- `Backend/src/main/java/org/pdm/backend/enums/TransactionType.java`
- `Backend/src/main/java/org/pdm/backend/enums/UserRole.java`

**Exceptions:**
- `Backend/src/main/java/org/pdm/backend/exception/CustomAccessDenialHandler.java`
- `Backend/src/main/java/org/pdm/backend/exception/CustomAuthenticationEntryPoint.java`
- `Backend/src/main/java/org/pdm/backend/exception/GlobalExceptionHandler.java`
- `Backend/src/main/java/org/pdm/backend/exception/InvalidCredentialsException.java`
- `Backend/src/main/java/org/pdm/backend/exception/NameValueRequiredException.java`
- `Backend/src/main/java/org/pdm/backend/exception/NotFoundException.java`

**Configuration:**
- `Backend/src/main/java/org/pdm/backend/BackendApplication.java`
- `Backend/src/main/resources/application.properties`

### Frontend React Files

**Components:**
- `frontend/src/components/AppLayout.jsx`
- `frontend/src/components/PaginationComponent.jsx`
- `frontend/src/components/ProtectedRoute.jsx`

**Features - Categories:**
- `frontend/src/features/categories/api.js`
- `frontend/src/features/categories/CategoryForm.jsx`
- `frontend/src/features/categories/schema.js`

**Features - Products:**
- `frontend/src/features/products/api.js`
- `frontend/src/features/products/api - products.js`
- `frontend/src/features/products/ProductForm.jsx`
- `frontend/src/features/products/schema.js`

**Features - Suppliers:**
- `frontend/src/features/suppliers/api.js`
- `frontend/src/features/suppliers/schema.js`
- `frontend/src/features/suppliers/SupplierForm.jsx`

**Features - Transactions:**
- `frontend/src/features/transactions/api.js`
- `frontend/src/features/transactions/PurchaseForm.jsx`
- `frontend/src/features/transactions/purchaseSchema.js`
- `frontend/src/features/transactions/SellForm.jsx`
- `frontend/src/features/transactions/sellSchema.js`

**Features - Users:**
- `frontend/src/features/users/api.js`
- `frontend/src/features/users/ProfileForm.jsx`
- `frontend/src/features/users/profileSchema.js`

**Pages:**
- `frontend/src/pages/CategoryPage.jsx`
- `frontend/src/pages/DashboardPage.jsx`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/ProductCreatePage.jsx`
- `frontend/src/pages/ProductEditPage.jsx`
- `frontend/src/pages/ProductPage.jsx`
- `frontend/src/pages/ProfilePage.jsx`
- `frontend/src/pages/PurchasePage.jsx`
- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/pages/SellPage.jsx`
- `frontend/src/pages/SupplierCreatePage.jsx`
- `frontend/src/pages/SupplierEditPage.jsx`
- `frontend/src/pages/SupplierPage.jsx`
- `frontend/src/pages/TransactionDetailsPage.jsx`
- `frontend/src/pages/TransactionsPage.jsx`

**Lib:**
- `frontend/src/lib/axios.js`

**Root Files:**
- `frontend/src/App.js`
- `frontend/src/App.css`
- `frontend/src/App.test.js`
- `frontend/src/index.js`
- `frontend/src/index.css`
- `frontend/src/reportWebVitals.js`
- `frontend/src/setupTests.js`

**Configuration:**
- `frontend/package.json`
- `frontend/postcss.config.js`
- `frontend/tailwind.config.js`
- `frontend/public/index.html`

### Documentation
- `docs/windows-troubleshooting.md`

