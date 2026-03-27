import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // 1. Create the table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        position VARCHAR(150) NOT NULL,
        department VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        birthday VARCHAR(20)
      );
    `;

    // 2. Check if the table is empty
    const existing = await sql`SELECT 1 FROM employees LIMIT 1;`;
    
    // 3. Insert initial data if empty
    if (existing.length === 0) {
      await sql`
        INSERT INTO employees (name, surname, position, department, phone, email, birthday)
        VALUES 
          ('Aram', 'Baghdasaryan', 'CTO', 'Executive & Management', '374 93591459', 'aram.baghdasaryan@movato.com', 'January 21'),
          ('Arevik', 'Martirosyan', 'Arev', 'Executive & Management', '374 94800385', 'arevik.martirosyan@movato.com', 'August 13'),
          ('Artashes', 'Amiryan', 'Backend Developer', 'Engineering', '374 96 661611', 'artashes.amiryan@movato.com', 'April 19'),
          ('Davit', 'Manukyan', 'Backend Developer', 'Engineering', '374 98131020', 'davit.manukyan@movato.com', ''),
          ('Seryozha', 'Harutyunyan', 'Mobile Developer', 'Engineering', '374 98693679', 'seryozha.harutyunyan@movato.com', 'November 20'),
          ('Serine', 'Tovmasyan', 'Frontend Developer', 'Engineering', '374 94013198', 'serine.tovmasyan@movato.com', 'January 31'),
          ('Knarik', 'Hovhannisyan', 'QA', 'QA & DevOps', '374 93444380', 'knarik.hovhannisyan@movato.com', 'November 17'),
          ('Karen', 'Vardanyan', 'DevOps', 'QA & DevOps', '374 94471298', 'karen.vardanyan@movato.com', 'July 15'),
          ('Ani', 'Isahakyan', 'Business Analyst', 'Product & Design', '374 91030901', 'ani.isahakyan@movato.com', 'September 1'),
          ('Khachatur', 'Arukyan', 'UI/UX', 'Product & Design', '374 44416116', 'khachatur.arukyan@movato.com', 'October 29'),
          ('Aram', 'Khachatryan', 'IT Support Specialist', 'IT Support', '374 55722800', 'aram.khachatryan@movato.com', 'June 8')
        ON CONFLICT (email) DO NOTHING;
      `;
    }

    return response.status(200).json({ message: 'Database setup successfully completed for Neon! You can now access your directory page.' });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
