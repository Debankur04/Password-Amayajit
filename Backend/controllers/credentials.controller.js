const CredentialsModel = require('../models/Credentials');

const addCredentials = async (req, res) => {
  try {
    const { url, username, password } = req.body;

    if (!username || !url || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const newCredential = new CredentialsModel({ url, username, password });
    const saved = await newCredential.save();

    res.json({
      success: true,
      credential: {
        url: saved.url,
        username: saved.username,
        password: saved.password,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateCredentials = async (req, res) => {
  try {
    const { url, username, password } = req.body;

    if (!username || !url || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const updated = await CredentialsModel.findOneAndUpdate(
      { url },
      { $set: { username, password } },
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: "Credential not found" });
    }

    res.json({
      success: true,
      credential: {
        url: updated.url,
        username: updated.username,
        password: updated.password,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const readCredentials = async (req, res) => {
  try {
    const credentials = await CredentialsModel.find();
    res.json({ success: true, credentials });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteCredentials = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.json({ success: false, message: "Missing URL" });
    }

    const deleted = await CredentialsModel.findOneAndDelete({ url });

    if (!deleted) {
      return res.json({ success: false, message: "Credential not found" });
    }

    res.json({ success: true, message: "Credential deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  addCredentials,
  updateCredentials,
  readCredentials,
  deleteCredentials,
};
