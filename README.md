# 📱 E-Commerce Phone Store - Fullstack Platform

🔗 **Live Demo:** [Experience the project here](https://ecommerce-phone-one.vercel.app/)

🔑 **Admin Demo Account:** `demoadmin@gmail.com` | **Password:** `123456`  *(Note: View-only access)*
---

## 📸 Project Preview

<div align="center">
  <img src="https://res.cloudinary.com/dcvkq98gc/image/upload/v1779608142/Screenshot_269_c8a9wg.png" width="48%">
  <img src="https://res.cloudinary.com/dcvkq98gc/image/upload/v1779608142/Screenshot_277_okhmfz.png" width="48%">
</div>

<div align="center">
   <img src="[link-anh-mobile-view.png](https://res.cloudinary.com/dcvkq98gc/image/upload/v1779608142/Screenshot_271_jntpgh.png)" width="48%">
  <img src="[link-anh-gio-hang.png](https://res.cloudinary.com/dcvkq98gc/image/upload/v1779608306/Screenshot_273_anurhw.png)" width="48%">
</div>
---

## 🚀 Technologies Used

### **Backend (Java/Spring Boot)**
- **Core:** Java, Spring Boot, Spring Data JPA
- **Security:** Spring Security, JWT (Access & Refresh Token), BCrypt, Google OAuth 2.0
- **Database:** PostgreSQL
- **Third-party APIs:** Cloudinary (Image management), Brevo API (Email service)
- **Other:** Spring Mail, Spring Boot Starter Validation, @Async (Non-blocking operations)

### **Frontend (React/Vite)**
- **Core:** React, Vite, JavaScript
- **Styling:** Tailwind CSS (Modern UI/UX with glass-morphism effects)
- **State Management & Routing:** Zustand, React Router DOM, Axios
- **UI/UX Components:** Lucide React, SweetAlert2, React Hot Toast
- **Data Visualization:** Recharts (Admin Dashboard analytics)
- **Utilities:** @dnd-kit (Drag & Drop sorting)

---

## ✨ Key Features

### 🛒 **For Customers (Client)**
- **Secure Authentication:** Standard login with BCrypt hashing and Google OAuth 2.0 integration.
- **Smart Shopping:** Advanced product filtering (by brand, price, specifications) and responsive cart management.
- **Seamless Checkout:** Optimized checkout flow with multiple shipping options and a public tracking system via custom order codes (`ORD-XXXXX`).
- **Real-time Notifications:** Automated, asynchronous HTML email notifications for order confirmations ensuring a non-blocking user experience.
- **User Profile:** Manage personal information, track delivery status, and view order history.
- **Product Reviews:** Post-purchase rating and review system.

### 🔐 **For Administrators (Admin Dashboard)**
- **Advanced Analytics:** Interactive revenue charts, user growth, and order reports visualized using Recharts.
- **Role-Based Access Control (RBAC):** Secure permission-based routing and actions utilizing Spring Security and JWT.
- **Catalog Management:** Dynamic CRUD operations for products, variants, and categories with drag-and-drop sorting capabilities.
- **Media Handling:** Automated cloud-based image upload, storage, and optimization via Cloudinary API.
- **Order Processing:** Track order statuses, confirm processing, and update delivery pipelines.
- **Community Moderation:** Comprehensive management of customer reviews and ratings.
