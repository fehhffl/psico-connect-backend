import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    select: false
  },
  userType: {
    type: String,
    enum: ['paciente', 'psicologo'],
    required: [true, 'Tipo de usuário é obrigatório']
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },

  // Campos específicos para psicólogos
  crp: {
    type: String,
    required: function() {
      return this.userType === 'psicologo';
    },
    unique: true,
    sparse: true
  },
  specialties: [{
    type: String
  }],
  description: {
    type: String,
    maxlength: 1000
  },
  experience: {
    type: String
  },
  availability: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },

  // Campos específicos para pacientes
  birthDate: {
    type: Date
  },
  emergencyContact: {
    name: String,
    phone: String
  },

  // Campos comuns
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obter dados públicos do usuário
userSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
