import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  try {
    // Vercel securely provides process.env.DATABASE_URL if configured in Settings > Environment Variables
    const sql = neon(process.env.DATABASE_URL);
    
    // The neon function returns rows directly as an array
    const rows = await sql`SELECT * FROM employees ORDER BY id ASC;`;
    
    return response.status(200).json(rows);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
