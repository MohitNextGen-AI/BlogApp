# Vercel Deployment Instructions

## Database Setup

1. Create a PostgreSQL database using one of these services:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Supabase](https://supabase.com/)
   - [Railway](https://railway.app/)
   - [Neon](https://neon.tech/)

2. Get your database connection string from your chosen provider.

## Environment Variables

Add the following environment variables in your Vercel project settings:

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" section
3. Add the following variables:

```
DATABASE_URL=your_postgres_connection_string
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

## Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Database Migration

After deployment, you need to run the database migrations:

1. Install the Vercel CLI: `npm i -g vercel`
2. Run the following command to execute migrations:
   ```
   vercel env pull .env.production.local
   npx prisma db push
   ```

## Troubleshooting

If you encounter database connection issues:
1. Check that your DATABASE_URL is correct
2. Ensure your database is accessible from Vercel's servers
3. Verify that your database user has the necessary permissions 