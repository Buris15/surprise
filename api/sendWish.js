import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { wish, username } = req.body;

        if (!wish || !username) {
            return res.status(400).json({ message: 'Missing wish or username.' });
        }

        console.log("Received wish:", wish);
        console.log("From user:", username);

        // Save to JSON file
        const filePath = path.join(process.cwd(), 'wishes.json');
        const existingWishes = fs.existsSync(filePath) ?
            JSON.parse(fs.readFileSync(filePath, 'utf8')) :
            [];

        existingWishes.push({ username, wish });
        fs.writeFileSync(filePath, JSON.stringify(existingWishes, null, 2));

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'thecraftedline@gmail.com',
                pass: 'pgve kldn meni xnpy'
            }
        });

        const mailOptions = {
            from: 'thecraftedline@gmail.com',
            to: 'adlacs2017@gmail.com',
            subject: 'New Wish Received!',
            text: `A new wish from ${username}:\n\n${wish}`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Wish sent!' });
        } catch (error) {
            console.error('Email error:', error);
            res.status(500).json({ message: 'Email failed.' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
