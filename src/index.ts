import express, {Request, Response} from 'express';
import client from './db/client';
import schema from './inputSchema/schema';
import mysql from 'mysql2/promise';
import { distance } from './distance/haversine';
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json())

app.get('/',(req: Request, res: Response)=>{
    res.send("Server status: Healthy");
})

app.post('/addSchool',(req: Request, res: Response) =>{

    const payload = req.body
    const { success } = schema.safeParse(payload);
    if (!success){
        res.status(400).json({
            msg: "Invalid input, try again"
        });
        return;
    }


    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)'; // ? to prevent sql injection attack
    const values = [payload.name, payload.address, payload.latitude, payload.longitude];

    client.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const insertId = (results as mysql.ResultSetHeader).insertId;
    res.status(201).json({ 
      message: 'School added successfully', 
      data: {
        id: insertId,
        SchoolName: payload.name,
      }
    });
  });
});

app.get('/listSchools', async (req: Request, res: Response) => {
  const params = req.query
  const userLatitude = parseFloat(params.latitude as string)
  const userLongitude = parseFloat(params.longitude as string)
  if (!userLatitude || !userLongitude){
    res.status(400).json({
      msg: "User latitude and longitudes are required."
    })
    return;
  }
  const query = "SELECT * FROM schools";
  client.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const schools = results as any[]; // Type assertion

    // Calculate distance for each school
    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance: distance(userLatitude, userLongitude, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance - b.distance); // Sort by nearest

    res.json({ schools: sortedSchools });
  });
})


app.listen(4000);

