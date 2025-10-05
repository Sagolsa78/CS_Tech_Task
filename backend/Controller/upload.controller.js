const { Readable } = require("stream");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const Agent = require("../DB/Agents");
const Contact = require("../DB/Contact");
const UploadBatch = require("../DB/UploadBatch");

/**
 * Helper: Parse CSV buffer
 */
function parseCSVBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString("utf8"));
    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

/**
 * Helper: Normalize rows for your dataset
 * Expected headers: Index, Customer Id, First Name, Last Name, Company, City, Country
 */
function normalizeRows(rows) {
  return rows
    .map((row) => {
      const firstName =
        row["First Name"]?.trim() ||
        row["first name"]?.trim() ||
        row["Firstname"]?.trim() ||
        "";
      const phone =
        row["Customer Id"]?.trim() ||
        row["CustomerID"]?.trim() ||
        row["customer id"]?.trim() ||
        "";
      const notes =
        row["Company"]?.trim() ||
        row["company"]?.trim() ||
        row["Organization"]?.trim() ||
        "";

      return { firstName, phone, notes };
    })
    .filter((r) => r.firstName && r.phone); // Only keep valid entries
}

/**
 * Helper: Distribute items equally among agents
 * If not divisible by 5, extra items go to first few agents
 */
function distributeItems(rows, agents) {
  const assignments = [];
  let agentIndex = 0;

  rows.forEach((row) => {
    const agentId = agents[agentIndex % agents.length]._id;
    assignments.push({ ...row, agent: agentId });
    agentIndex++;
  });

  return assignments;
}

/**
 * Controller: Upload and distribute contacts
 */
exports.uploadList = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filename = req.file.originalname.toLowerCase();
    const allowedExt = [".csv", ".xlsx", ".xls"];
    if (!allowedExt.some((ext) => filename.endsWith(ext))) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Allowed: CSV, XLS, XLSX" });
    }

    // Fetch exactly 5 agents
    const agents = await Agent.find().limit(5);
    if (agents.length !== 5) {
      return res
        .status(400)
        .json({ message: "Exactly 5 agents are required for distribution" });
    }

    // Parse file based on extension
    let records = [];
    if (filename.endsWith(".csv")) {
      records = await parseCSVBuffer(req.file.buffer);
    } else {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = XLSX.utils.sheet_to_json(sheet);
    }

    // Normalize and validate rows
    const validRows = normalizeRows(records);
    if (!validRows.length) {
      return res.status(400).json({ message: "No valid rows found in the file" });
    }

    // Create upload batch record
    const batch = new UploadBatch({
      originalFileName: req.file.originalname,
      processedAt: new Date(),
    });
    await batch.save();

    // Distribute contacts among 5 agents equally
    const distributedRows = distributeItems(validRows, agents);

    // Prepare MongoDB documents
    const contactsToSave = distributedRows.map((row) => ({
      firstName: row.firstName,
      phone: row.phone,
      notes: row.notes,
      agent: row.agent,
      batch: batch._id,
    }));

    // Save all contacts
    await Contact.insertMany(contactsToSave);

    res.json({
      message: "List uploaded and distributed successfully",
      totalContacts: contactsToSave.length,
      agents: agents.map((a) => ({ id: a._id, name: a.name })),
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Controller: Fetch distributed contacts for all agents
 */
exports.getDistributedLists = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("agent", "name email")
      .sort({ agent: 1 });

    res.json({
      message: "Distributed contact lists fetched successfully",
      data: contacts,
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: err.message });
  }
};
