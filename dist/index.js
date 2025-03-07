"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = __importDefault(require("./db/client"));
const schema_1 = __importDefault(require("./inputSchema/schema"));
const haversine_1 = require("./distance/haversine");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("Server status: Healthy");
});
app.post('/addSchool', (req, res) => {
    const payload = req.body;
    const { success } = schema_1.default.safeParse(payload);
    if (!success) {
        res.status(400).json({
            msg: "Invalid input, try again"
        });
        return;
    }
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)'; // ? to prevent sql injection attack
    const values = [payload.name, payload.address, payload.latitude, payload.longitude];
    client_1.default.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        const insertId = results.insertId;
        res.status(201).json({
            message: 'School added successfully',
            data: {
                id: insertId,
                SchoolName: payload.name,
            }
        });
    });
});
app.get('/listSchools', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    const userLatitude = parseFloat(params.latitude);
    const userLongitude = parseFloat(params.longitude);
    if (!userLatitude || !userLongitude) {
        res.status(400).json({
            msg: "User latitude and longitudes are required."
        });
        return;
    }
    const query = "SELECT * FROM schools";
    client_1.default.query(query, (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        const schools = results; // Type assertion
        // Calculate distance for each school
        const sortedSchools = schools
            .map((school) => (Object.assign(Object.assign({}, school), { distance: (0, haversine_1.distance)(userLatitude, userLongitude, school.latitude, school.longitude) })))
            .sort((a, b) => a.distance - b.distance); // Sort by nearest
        res.json({ schools: sortedSchools });
    });
}));
app.listen(4000);
