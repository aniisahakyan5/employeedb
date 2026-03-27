import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // 1. SAFE SETUP: Create table and columns if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        position VARCHAR(150) NOT NULL,
        department VARCHAR(100) NOT NULL,
        dept_priority INT DEFAULT 100,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        birthday VARCHAR(20),
        vehicle_plate VARCHAR(50)
      );
    `;

    // 2. Insert initial data using the NEW 8 departments and their priorities
    await sql`
      INSERT INTO employees (name, surname, position, department, dept_priority, phone, email, birthday, vehicle_plate)
      VALUES 
        ('Artak', 'Sargsyan', 'CEO', 'Executive', 1, '374 91 123456', 'artak.sargsyan@movato.com', 'January 1', '01-XX-001'),
        ('Aram', 'Baghdasaryan', 'CTO', 'Executive', 1, '374 93591459', 'aram.baghdasaryan@movato.com', 'January 21', '77-AB-777'),
        ('Arevik', 'Martirosyan', 'Arev', 'Executive', 1, '374 94800385', 'arevik.martirosyan@movato.com', 'August 13'),
        ('Artashes', 'Amiryan', 'Backend Developer', 'Engineering', 2, '374 96 661611', 'artashes.amiryan@movato.com', 'April 19'),
        ('Davit', 'Manukyan', 'Backend Developer', 'Engineering', 2, '374 98131020', 'davit.manukyan@movato.com', ''),
        ('Seryozha', 'Harutyunyan', 'Mobile Developer', 'Engineering', 2, '374 98693679', 'seryozha.harutyunyan@movato.com', 'November 20'),
        ('Serine', 'Tovmasyan', 'Frontend Developer', 'Engineering', 2, '374 94013198', 'serine.tovmasyan@movato.com', 'January 31'),
        ('Knarik', 'Hovhannisyan', 'QA', 'Engineering', 2, '374 93444380', 'knarik.hovhannisyan@movato.com', 'November 17'),
        ('Karen', 'Vardanyan', 'DevOps', 'Engineering', 2, '374 94471298', 'karen.vardanyan@movato.com', 'July 15'),
        ('Ani', 'Isahakyan', 'Business Analyst', 'Marketing', 5, '374 91030901', 'ani.isahakyan@movato.com', 'September 1'),
        ('Aram', 'Khachatryan', 'IT Support Specialist', 'Local Operations', 8, '374 55722800', 'aram.khachatryan@movato.com', 'June 8'),
        ('Khachatur', 'Arukyan', 'UI/UX', 'Local Operations', 8, '374 44416116', 'khachatur.arukyan@movato.com', 'October 29')
      ON CONFLICT (email) DO NOTHING;
    `;

    return response.status(200).json({ 
      message: 'Database recreated from scratch with the new 8-department hierarchy! Refresh your main page now.' 
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
