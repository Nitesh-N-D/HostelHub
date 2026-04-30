const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let ioInstance = null;

const registerSocketServer = (httpServer, allowedOrigins) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true
    }
  });

  ioInstance.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Socket token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id role name email');

      if (!user) {
        return next(new Error('Socket user not found'));
      }

      socket.user = user;
      return next();
    } catch (error) {
      return next(new Error('Socket authentication failed'));
    }
  });

  ioInstance.on('connection', (socket) => {
    socket.join(`user:${socket.user._id.toString()}`);

    socket.on('disconnect', () => {
      socket.leave(`user:${socket.user._id.toString()}`);
    });
  });

  return ioInstance;
};

const emitNotification = (userId, notification) => {
  if (!ioInstance || !userId) return;
  ioInstance.to(`user:${userId.toString()}`).emit('notification:new', notification);
};

module.exports = {
  registerSocketServer,
  emitNotification
};
