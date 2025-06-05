import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const wishesFile = path.join(process.cwd(), 'wishes.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { wish, username } = req.body;
    if (!wish || !username) {
      return res.status(400).json({ message: 'Wish and username required' });
    }

    // Read existing wishes or start with empty array
    let wishes = [];
    try {
      const data = fs.readFileSync(wishesFile, 'utf8');
      wishes = JSON.parse(data);
    } catch (e) {
      // File might not exist yet, ignore error
    }

    // Add new wish
    wishes.push({ username, wish });

    // Save updated wishes back to file
    fs.writeFileSync(wishesFile, JSON.stringify(wishes, null, 2));

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'thecraftedline@gmail.com',
        pass: 'pgve kldn meni xnpy' // use your app password here
      }
    });

    const mailOptions = {
      from: 'thecraftedline@gmail.com',
      to: 'adlacs2017@gmail.com',
      subject: 'New Wish Received!',
      text: `From: ${username}\n\nWish: ${wish}`
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Wish saved and emailed!' });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ message: 'Wish saved but email failed.' });
    }

  } else if (req.method === 'GET') {
    // Return all saved wishes
    try {
      const data = fs.readFileSync(wishesFile, 'utf8');
      const wishes = JSON.parse(data);
      res.status(200).json(wishes);
    } catch (e) {
      res.status(200).json([]); // no wishes yet
    }

  } else if (req.method === 'DELETE') {
    const { index } = req.body;
    if (typeof index !== 'number') {
      return res.status(400).json({ message: 'Index number is required for deletion' });
    }

    try {
      const data = fs.readFileSync(wishesFile, 'utf8');
      let wishes = JSON.parse(data);

      if (index < 0 || index >= wishes.length) {
        return res.status(400).json({ message: 'Index out of range' });
      }

      wishes.splice(index, 1); // remove the wish

      fs.writeFileSync(wishesFile, JSON.stringify(wishes, null, 2));

      res.status(200).json({ message: 'Wish deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ message: 'Failed to delete wish' });
    }

  } else {
    res.status(405).end(); // Method not allowed for other methods
  }
}
