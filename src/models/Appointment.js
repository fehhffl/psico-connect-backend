import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  psychologist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 50, // minutos
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  meetingLink: {
    type: String
  },
  cancelReason: {
    type: String
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Índices para buscas eficientes
appointmentSchema.index({ psychologist: 1, scheduledDate: 1 });
appointmentSchema.index({ patient: 1, scheduledDate: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
