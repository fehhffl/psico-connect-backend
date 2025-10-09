import User from '../models/User.js';

// @desc    Buscar todos os psicólogos
// @route   GET /api/users/psychologists
// @access  Private
export const getPsychologists = async (req, res) => {
  try {
    const { specialty, search, limit = 20 } = req.query;

    let query = { userType: 'psicologo', isActive: true };

    // Filtrar por especialidade
    if (specialty) {
      query.specialties = { $in: [specialty] };
    }

    // Buscar por nome ou descrição
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const psychologists = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: psychologists.length,
      data: psychologists
    });
  } catch (error) {
    console.error('Get psychologists error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar psicólogos'
    });
  }
};

// @desc    Buscar todos os pacientes (apenas para psicólogos)
// @route   GET /api/users/patients
// @access  Private (Psicólogos)
export const getPatients = async (req, res) => {
  try {
    const { search, limit = 20 } = req.query;

    let query = { userType: 'paciente', isActive: true };

    // Buscar por nome
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const patients = await User.find(query)
      .select('name email phone avatar createdAt')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pacientes'
    });
  }
};

// @desc    Buscar perfil de usuário por ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário'
    });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'description', 'specialties',
      'experience', 'availability', 'birthDate', 'emergencyContact'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil',
      error: error.message
    });
  }
};

// @desc    Desativar conta
// @route   DELETE /api/users/account
// @access  Private
export const deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    res.json({
      success: true,
      message: 'Conta desativada com sucesso'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao desativar conta'
    });
  }
};

// @desc    Obter todas as especialidades disponíveis
// @route   GET /api/users/specialties
// @access  Public
export const getSpecialties = async (req, res) => {
  try {
    const specialties = await User.distinct('specialties', {
      userType: 'psicologo',
      isActive: true
    });

    res.json({
      success: true,
      data: specialties.filter(s => s) // Remove valores vazios
    });
  } catch (error) {
    console.error('Get specialties error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar especialidades'
    });
  }
};
