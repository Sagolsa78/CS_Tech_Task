const Agent = require("../DB/Agents");
const bcrypt = require("bcryptjs");

exports.createAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const existing = await Agent.findOne({ email });
    if (existing) return res.status(400).json({ message: "Agent already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const agent = new Agent({ name, email, mobile, password: hashed });
    await agent.save();

    res.status(201).json({ message: "Agent created", agent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const updated = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Agent not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const deleted = await Agent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Agent not found" });
    res.json({ message: "Agent deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
