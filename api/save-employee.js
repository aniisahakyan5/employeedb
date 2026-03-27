import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { id, name, surname, position, department, phone, email, birthday } = request.body;

    if (id) {
      // Update existing employee
      await sql`
        UPDATE employees 
        SET name = ${name}, surname = ${surname}, position = ${position}, 
            department = ${department}, phone = ${phone}, email = ${email}, 
            birthday = ${birthday}
        WHERE id = ${id};
      `;
      return response.status(200).json({ message: 'Employee updated successfully' });
    } else {
      // Add new employee
      await sql`
        INSERT INTO employees (name, surname, position, department, phone, email, birthday)
        VALUES (${name}, ${surname}, ${position}, ${department}, ${phone}, ${email}, ${birthday});
      `;
      return response.status(201).json({ message: 'Employee added successfully' });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
