const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

router.post('/send', async (req, res) => {
  try {
    const { sessionId, sender, message } = req.body;

    if (!sessionId || !sender || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newMessage = new Chat({
      sessionId,
      sender,
      message,
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const chatMessages = await Chat.find({ sessionId }).sort('timestamp');

    res.status(200).json({ success: true, chatMessages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
