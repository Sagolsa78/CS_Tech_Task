const AdminUser = require("../DB/AdminUser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await AdminUser.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

   
    const admin = new AdminUser({ email, password });
    await admin.save();
   

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: { id: admin._id, email: admin.email }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Inva credentials" });

   
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({
      success: true,
      token,
      user: { id: admin._id, email: admin.email }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
