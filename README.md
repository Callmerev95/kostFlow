# 🏛️ KostFlow – Premium Property Management System

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

**KostFlow** is a modern, high-end property management system designed for maximum operational efficiency and a premium user experience. Built with a focus on performance, security, and mobile-first accessibility.

---

## ✨ Core Features

- **🚀 Executive Dashboard**: Real-time visualization of occupancy rates and monthly revenue analytics.
- **🏠 Unit Management**: Comprehensive control over room availability, pricing, and facility detailing.
- **👥 Tenant Tracking**: Integrated tenant database with automated move-in/move-out workflows.
- **💳 Financial Automation**: Automated transaction logging and professional invoice generation.
- **📲 WhatsApp Integration**: One-click automated billing and payment reminders directly to tenants' phones.
- **📱 PWA Ready**: Progressive Web App support for a native-like experience on mobile devices.
- **🔐 Enterprise Security**: Industry-standard data protection using Supabase encryption and Row Level Security (RLS).

---

## 💻 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Type Checking)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a Glassmorphism design language.
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/).
- **ORM**: [Prisma](https://www.prisma.io/).
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/).
- **Notifications**: [Sonner](https://sonner.stevenly.me/) for minimalist, high-performance toasts.

---

## 🛠️ Local Installation

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/username/kost-flow.git](https://github.com/username/kost-flow.git)
   cd kost-flow
   ```
2. **Install Dependensi**
   ```bash
   npm install
   ```
3. **Environment Configuration Create a `.env` file in the root directory and add the following credentials:**
   ```code snippet
   DATABASE_URL="your_postgresql_url"
   DIRECT_URL="your_direct_url"
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   ```
4. **Database Setup (Prisma)**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📐 Project Structure

```text
src/
├── actions/      # Server Actions (Business Logic)
├── app/          # Next.js App Router (Pages & Layouts)
├── components/   # Reusable UI & Shared Logic
├── lib/          # External Library Configs (Prisma, Supabase, Utils)
└── types/        # TypeScript Definitions & Interfaces
```

## 📝 Development Notes

This project is built following Clean Code principles and Atomic Design patterns. It prioritizes lightweight performance with a luxury visual aesthetic

## 🤝 Contribution

This project is open-source for educational purposes. If you wish to contribute, please fork the repository and submit a pull request.

**built with ☕ and 💻 by [Callmerev]**
