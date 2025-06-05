import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const filePath = path.join(process.cwd(), 'wishes.json');
        if (fs.existsSync(filePath)) {
            const wishes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.status(200).json(wishes);
        } else {
            res.status(200).json([]); // Empty list
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}