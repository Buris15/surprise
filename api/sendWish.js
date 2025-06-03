import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { wish } = req.body;
        console.log("Received wish:", wish);


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'thecraftedline@gmail.com', // your sender Gmail
                pass: 'pgve kldn meni xnpy' // your Gmail app password
            }
        });

        const mailOptions = {
            from: 'thecraftedline@gmail.com',
            to: 'adlacs2017@gmail.com', // where you want to receive the wish emails
            subject: 'New Wish Received!',
            text: `A new wish was posted:\n\n${wish}`
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