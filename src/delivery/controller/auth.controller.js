module.exports = (authService) => {
    const {login} = authService();
    const loginAccount = async (req, res) => {
        const payload = req.body;
        const token = await login(payload);
        res.status(201).json({ token: token });
    }
    return {
        loginAccount
    }
}