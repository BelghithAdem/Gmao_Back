// api/controllers/MessageController.js
const fs = require('fs');
const path = require('path');

module.exports = {
  create: async function(req, res) {
    try {
      const message = await Message.create({
        id_user: req.body.id_user,
        user: req.body.user,
        role: req.body.role,
        text: req.body.text,
      }).fetch();

      return res.status(201).json({ message });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  
  find: async function(req, res) {
    try {
      const messages = await Message.find();
      return res.status(200).json({ messages });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  delete: async function(req, res) {
    try {
      const deletedMessage = await Message.destroyOne({ id: req.query.id });
      if (!deletedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
      return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Notification pour le nombre de messages non lus
  count: async function(req, res) {
    try {
      const count = await Message.count();
      return res.status(200).json({ count });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  
};
