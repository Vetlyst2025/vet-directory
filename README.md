# 🐾 Madison Vet Finder

A modern, full-featured veterinary clinic directory and lead generation platform for Madison, WI.

## 🌟 Features

- **99+ Verified Clinic Listings** - Comprehensive directory of Madison-area veterinary clinics
- **Smart Search & Filters** - Search by name, filter by city and clinic type
- **Individual Clinic Pages** - Detailed profiles with hours, services, ratings, and maps
- **Appointment Request System** - Simple lead forms that email clinics directly
- **Featured Listings** - Premium placement for partner clinics
- **Mobile Responsive** - Beautiful design on all devices
- **SEO Optimized** - Individual pages for each clinic with proper metadata

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend API
- **Hosting**: Vercel
- **Package Manager**: Bun

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Supabase account
- Resend account (for emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/madison-vet-finder.git
cd madison-vet-finder

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Resend credentials

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

## 🗄️ Database Setup

The database schema is in `SUPABASE_SETUP.md`. Key tables:

- `clinics_madison_wi` - Clinic listings with full details
- `appointment_requests` - Lead capture and tracking

## 📧 Email Notifications

When a pet owner requests an appointment:
1. Form data is saved to Supabase
2. Email sent to clinic via Resend API
3. Clinic receives appointment request details

## 🎨 Design System

- **Colors**: Blue (trust), Green (health), Purple (premium)
- **Typography**: Clean, modern, accessible
- **Components**: shadcn/ui for consistency
- **Icons**: Lucide React

## 📱 Pages

- `/` - Main directory with search and filters
- `/clinic/[slug]` - Individual clinic profile pages
- `/admin/appointments` - Admin dashboard (future)

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick deploy to Vercel:**

```bash
npx vercel --prod
```

## 📈 Roadmap

- [ ] Admin dashboard for clinics
- [ ] Payment integration for featured listings
- [ ] Expand to other Wisconsin cities
- [ ] Mobile app
- [ ] Review system
- [ ] Online booking integration

## 🤝 Contributing

This is a private MVP. Contact the owner for collaboration opportunities.

## 📄 License

Proprietary - All rights reserved

## 📞 Contact

For business inquiries: practicemanager@healthypetvetclinic.com

---

**Built with ❤️ for pet owners and veterinary clinics in Madison, WI**
# Vetlyst Clinic Directory - Updated Thu Oct 16 10:51:06 AM CDT 2025
