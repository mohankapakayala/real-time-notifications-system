# Real-Time Notification System

A modern, responsive real-time notification management system built with Next.js, React, and TypeScript. This application provides a comprehensive dashboard for managing notifications with real-time updates, analytics, filtering, and search capabilities.

## Features

- 🔔 **Real-Time Notifications**: Simulated real-time notification generation with automatic updates
- 📊 **Analytics Dashboard**: Visual analytics with bar charts and pie charts showing notification trends
- 🔍 **Advanced Filtering**: Filter notifications by read/unread status, search, and sort options
- 📱 **Responsive Design**: Fully responsive UI optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX**: Clean, intuitive interface with smooth animations and transitions
- 🔐 **Notification Management**: Mark as read/unread, delete individual or all notifications
- 📄 **Pagination**: Efficient pagination for large notification lists
- 🔎 **Sidebar Search**: Quick search functionality to filter navigation menu items
- ♿ **Accessibility**: Built with accessibility best practices in mind
- 🧪 **Testing**: Unit tests with Vitest and React Testing Library

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mohankapakayala/real-time-notifications-system.git
cd real-time-notifications-system/real-time-notifications
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server (after building)
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run unit tests with Vitest
- `npm run analyze` - Analyze bundle size

## Project Structure

```
real-time-notifications/
├── app/
│   ├── api/
│   │   └── notifications/     # API routes for notifications
│   ├── components.css         # Component-specific CSS classes
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main page component
│   ├── robots.ts              # Robots.txt generator
│   └── sitemap.ts             # Sitemap generator
├── components/
│   ├── Analytics.tsx          # Analytics charts component
│   ├── BellIcon.tsx           # Notification bell icon
│   ├── Card.tsx                # Reusable card component
│   ├── NotificationDropdown.tsx # Notification dropdown
│   ├── NotificationList.tsx    # Notification list with filters
│   └── Sidebar.tsx             # Navigation sidebar
├── contexts/
│   └── NotificationContext.tsx # Global notification state
├── hooks/
│   ├── useClickOutside.ts      # Click outside hook
│   └── useDebounce.ts          # Debounce hook
├── constants/
│   └── index.ts                # App constants
├── types/
│   └── index.ts                # TypeScript type definitions
├── utils/
│   └── index.ts                # Utility functions
└── __tests__/
    └── Sidebar.test.tsx        # Unit tests
```

## Key Features Explained

### Real-Time Notifications

The application simulates real-time notifications by automatically generating new notifications at random intervals (10-30 seconds). Notifications are stored in localStorage for persistence.

### Analytics Dashboard

- **Bar Chart**: Shows notification counts per day for the last 7 days
- **Pie Chart**: Displays read vs unread notification distribution
- Dynamic updates based on actual notification data

### Notification Management

- Filter by: All, Unread, Read
- Sort by: Newest First, Oldest First, Unread First
- Search notifications by message content
- Mark individual notifications as read/unread
- Delete individual or all notifications
- Pagination for efficient browsing

### Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile devices
- Touch-friendly interactions
- Optimized layouts for all screen sizes

## Testing

Run tests with:

```bash
npm run test
```

Tests are written using Vitest and React Testing Library, focusing on component behavior and user interactions.

## SEO

The application includes:

- Dynamic sitemap generation (`/sitemap.xml`)
- Robots.txt configuration (`/robots.txt`)
- Optimized metadata for search engines

## Deployment

### Deploy on Vercel

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Other Platforms

This Next.js application can be deployed on any platform that supports Node.js:

- [Netlify](https://www.netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Created by [Mohankapakayala](https://github.com/mohankapakayala)

---

Built with ❤️ using Next.js and React
