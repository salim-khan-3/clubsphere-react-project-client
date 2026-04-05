# ClubSphere – Membership & Event Management

![ClubSphere](https://clubsphere-fullstack-project.netlify.app)

## 🌐 Live URL
**[https://clubsphere-fullstack-project.netlify.app](https://clubsphere-fullstack-project.netlify.app)**

## 🎯 Project Purpose
ClubSphere is a full-stack MERN web application that helps people discover, join, and manage local clubs. Club managers can create and manage clubs and events, members can join clubs and pay membership fees, and an admin oversees the entire platform.

## ✨ Key Features

- 🔐 **Firebase Authentication** — Email/Password + Google OAuth login
- 👑 **Role-based Dashboards** — Admin, Club Manager, Member
- 💳 **Stripe Payment Integration** — Paid memberships & event registrations
- 📊 **Admin Analytics Dashboard** — Revenue charts with Recharts
- 🔍 **Server-side Search, Filter & Sort** — With pagination
- ⭐ **Reviews & Ratings** — Members can review clubs
- 🔖 **Bookmarks/Wishlist** — Save clubs for later
- 📢 **Club Announcements** — Managers can post updates to members
- 📱 **Fully Responsive** — Mobile, tablet & desktop

## 🛠 Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| react | UI library |
| react-router-dom | Client-side routing |
| @tanstack/react-query | Data fetching & caching |
| react-hook-form | Form management & validation |
| framer-motion | Animations |
| tailwindcss | Utility-first CSS |
| @stripe/react-stripe-js | Stripe payment UI |
| firebase | Authentication |
| axios | HTTP client |
| recharts | Charts & graphs |
| react-hot-toast | Toast notifications |
| sweetalert2 | Confirmation dialogs |
| lucide-react | Icons |

## 📁 Folder Structure
client/
├── public/
│   └── _redirects
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/        # Navbar, Footer, Cards, Spinner
│   │   ├── home/          # HeroSection, FeaturedClubs, etc.
│   │   └── dashboard/     # StatCard, DashboardHeader, etc.
│   ├── contexts/          # AuthContext, ThemeContext
│   ├── layouts/           # MainLayout, DashboardLayout
│   ├── pages/
│   │   ├── public/        # Home, Clubs, Events, Login, Register
│   │   └── dashboard/
│   │       ├── admin/     # AdminOverview, ManageUsers, etc.
│   │       ├── manager/   # ManagerOverview, MyClubs, etc.
│   │       └── member/    # MemberOverview, MyMemberships, etc.
│   ├── routes/            # PrivateRoute, AdminRoute, ManagerRoute
│   └── utils/             # firebase.js, axiosInstance.js
├── .env.example
└── netlify.toml
