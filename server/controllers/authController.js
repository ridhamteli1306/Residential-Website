const { User, Unit } = require('../database');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || user.password !== password) { // Simple check, use bcrypt in production
            return res.status(401).json({ message: 'Incorrect email address or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const register = async (req, res) => {
    const { name, email, password, role, phone, unitNumber } = req.body;
    try {
        let assignedUnitId = null;
        if ((role === 'resident' || role === 'visitor') && unitNumber) {
            const unit = await Unit.findOne({ where: { number: unitNumber.toUpperCase() } });
            if (unit) {
                assignedUnitId = unit.id;
            }
        }

        const user = await User.create({ name, email, password, role, phone, unitId: assignedUnitId });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // In a real application, you would generate a reset token, save it to the user record,
        // and send an email with a link like /reset-password?token=XYZ.
        // For this prototype, we'll just simulate it.
        const user = await User.findOne({ where: { email } });

        // We always return a success message for security (prevent email enumeration)
        res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, phone } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.phone = phone || user.phone;

        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

module.exports = { login, register, getUsers, forgotPassword, deleteUser, updateUser };
