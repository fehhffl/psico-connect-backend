import Notification from '../models/Notification.js';
import { getIO } from '../services/socketService.js';

// @desc    Criar notificação
// @route   POST /api/notifications
// @access  Private
export const createNotification = async (req, res) => {
  try {
    const { recipient, type, title, message, relatedId, relatedModel, actionUrl } = req.body;

    if (!recipient || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios faltando'
      });
    }

    const notification = await Notification.create({
      recipient,
      sender: req.user._id,
      type,
      title,
      message,
      relatedId,
      relatedModel,
      actionUrl
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name avatar userType');

    // Enviar notificação em tempo real via Socket.io
    const io = getIO();
    io.to(recipient.toString()).emit('notification', populatedNotification);

    res.status(201).json({
      success: true,
      message: 'Notificação enviada com sucesso',
      data: populatedNotification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar notificação',
      error: error.message
    });
  }
};

// @desc    Buscar notificações do usuário
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const { read, limit = 50 } = req.query;

    let query = { recipient: req.user._id };

    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name avatar userType')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar notificações'
    });
  }
};

// @desc    Marcar notificação como lida
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id
      },
      { read: true },
      { new: true }
    ).populate('sender', 'name avatar userType');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar notificação como lida'
    });
  }
};

// @desc    Marcar todas as notificações como lidas
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'Todas as notificações foram marcadas como lidas'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar notificações como lidas'
    });
  }
};

// @desc    Deletar notificação
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Notificação deletada com sucesso'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar notificação'
    });
  }
};
