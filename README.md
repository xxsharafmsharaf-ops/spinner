# Vienna Spin Wheel 🎡

A premium interactive spin wheel application for marketing campaigns, built with React, TypeScript, and Netlify Functions.

## Features

- 🎨 **Premium Design**: Luxury minimal UI with rose gold and beige theme
- 🌍 **Arabic RTL Support**: Full right-to-left layout with elegant Arabic typography
- 🎯 **One-Time Spin**: IP-based anti-cheat protection
- 🎁 **Weighted Prizes**: Configurable prize probability system
- 🎉 **Confetti Animation**: Celebratory animations on win
- 📱 **Mobile-First**: Responsive design for all devices
- 🔒 **Secure**: Server-side validation and IP tracking

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Netlify Functions (serverless)
- **Database**: Netlify DB (or compatible SQL database)
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Netlify account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vienna-spinne
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. For local Netlify Functions testing:
```bash
npm install -g netlify-cli
netlify dev
```

## Project Structure

```
vienna-spinne/
├── src/
│   ├── components/       # React components
│   │   ├── SpinnerWheel.tsx
│   │   ├── SpinButton.tsx
│   │   ├── LeadFormModal.tsx
│   │   ├── ResultModal.tsx
│   │   └── ConfettiLayer.tsx
│   ├── config/
│   │   └── prizes.ts     # Prize configuration
│   ├── lib/
│   │   ├── utils.ts      # Utility functions
│   │   └── validation.ts # Zod schemas
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── netlify/
│   └── functions/
│       └── spin.ts       # Netlify serverless function
├── database/
│   └── schema.sql        # Database schema
├── netlify.toml          # Netlify configuration
└── package.json
```

## Configuration

### Prizes

Edit `src/config/prizes.ts` to customize prizes:

```typescript
export const prizes: Prize[] = [
  {
    id: '1',
    label: 'عرض الاخوات',
    weight: 10,  // Higher weight = more likely
    category: 'family',
  },
  // ... more prizes
];
```

### Database Setup

1. Create a database using Netlify DB or your preferred SQL database
2. Run the schema from `database/schema.sql`
3. Update the database connection in `netlify/functions/spin.ts`

## Deployment to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
```bash
netlify deploy --prod
```

Or connect your repository to Netlify for automatic deployments.

### Environment Variables

No environment variables required for basic setup. Database connection will be handled by Netlify DB.

## Development

### Local Development

- Frontend: `npm run dev` (runs on http://localhost:5173)
- Netlify Functions: `netlify dev` (runs on http://localhost:8888)

### Building

```bash
npm run build
```

Output will be in the `dist` directory.

## Security Features

1. **IP-based Protection**: Prevents multiple spins from the same IP
2. **LocalStorage Guard**: Client-side check to prevent UI abuse
3. **Server Validation**: All validation happens server-side
4. **CORS Protection**: Proper CORS headers configured

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  'rose-gold': { /* ... */ },
  'beige': { /* ... */ },
}
```

### Typography

Arabic fonts are loaded from Google Fonts (Cairo, Tajawal). Update `index.html` to change fonts.

## License

Private project for Vienna Cafe & Restaurant.

## Support

For issues or questions, please contact the development team.
