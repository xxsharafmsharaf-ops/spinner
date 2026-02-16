# Quick Setup Guide

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Test Netlify Functions locally:**
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```
   This will start both the frontend and Netlify Functions.

## Database Setup

### Option 1: Netlify DB (Recommended)

1. Go to your Netlify dashboard
2. Navigate to your site → Database
3. Create a new database
4. Run the SQL schema from `database/schema.sql`
5. Update `netlify/functions/spin.ts` to use Netlify DB (see `netlify/functions/db-example.ts`)

### Option 2: External Database

You can use any SQL database (PostgreSQL, MySQL, SQLite). Update the database connection in `netlify/functions/spin.ts`.

## Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your Git repository to Netlify
   - Or use Netlify CLI: `netlify deploy --prod`

3. **Configure environment:**
   - No environment variables needed for basic setup
   - Database connection will be handled automatically by Netlify DB

## Important Notes

- The database functions in `spin.ts` are currently stubbed out
- You need to implement the actual database queries (see `db-example.ts`)
- IP-based protection requires a working database connection
- For development, spins are allowed (database check returns false)

## Troubleshooting

### Build Issues
If you encounter build errors, try:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Netlify Functions Not Working
- Ensure `netlify.toml` is in the root directory
- Check that functions are in `netlify/functions/`
- Verify Node.js version in `netlify.toml` matches your environment

### Database Connection
- Make sure your database is accessible from Netlify Functions
- Check database credentials and connection strings
- Verify the schema matches `database/schema.sql`
