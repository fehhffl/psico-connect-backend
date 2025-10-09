import User from '../models/User.js';
import { generateToken } from '../config/auth.js';

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, userType, crp, phone } = req.body;

    // Validações
    if (!name || !email || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça todos os campos obrigatórios'
      });
    }

    if (userType === 'psicologo' && !crp) {
      return res.status(400).json({
        success: false,
        message: 'CRP é obrigatório para psicólogos'
      });
    }

    // Verificar se email já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Verificar se CRP já existe (para psicólogos)
    if (userType === 'psicologo') {
      const crpExists = await User.findOne({ crp });
      if (crpExists) {
        return res.status(400).json({
          success: false,
          message: 'CRP já cadastrado'
        });
      }
    }

    // Criar usuário
    const userData = {
      name,
      email,
      password,
      userType,
      phone
    };

    if (userType === 'psicologo') {
      userData.crp = crp;
    }

    const user = await User.create(userData);

    // Gerar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário',
      error: error.message
    });
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça email e senha'
      });
    }

    // Buscar usuário com senha
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar tipo de usuário
    if (userType && user.userType !== userType) {
      return res.status(401).json({
        success: false,
        message: `Este email está cadastrado como ${user.userType === 'paciente' ? 'Paciente' : 'Psicólogo'}`
      });
    }

    // Verificar senha
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se conta está ativa
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message
    });
  }
};

// @desc    Obter usuário atual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do usuário'
    });
  }
};

// @desc    Atualizar senha
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça a senha atual e a nova senha'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // Verificar senha atual
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Senha atualizada com sucesso'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar senha'
    });
  }
};
