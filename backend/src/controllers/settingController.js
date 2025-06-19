const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- Barangays ---
exports.getBarangays = async (req, res) => {
  const barangays = await prisma.barangay.findMany();
  res.json({ barangays });
};

exports.createBarangay = async (req, res) => {
  const { name } = req.body;
  const barangay = await prisma.barangay.create({ data: { name } });
  res.status(201).json({ barangay });
};

exports.updateBarangay = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const barangay = await prisma.barangay.update({
    where: { id: Number(id) },
    data: { name }
  });
  res.json({ barangay });
};

exports.deleteBarangay = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.barangay.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete barangay' });
  }
};

// --- Report Types ---
exports.getReportTypes = async (req, res) => {
  const reportTypes = await prisma.reportType.findMany();
  res.json({ reportTypes });
};

exports.createReportType = async (req, res) => {
  const { name, shortName } = req.body;
  const reportType = await prisma.reportType.create({ data: { name, shortName } });
  res.status(201).json({ reportType });
};

exports.updateReportType = async (req, res) => {
  const { id } = req.params;
  const { name, shortName } = req.body;
  const reportType = await prisma.reportType.update({
    where: { id: Number(id) },
    data: { name, shortName }
  });
  res.json({ reportType });
};

exports.deleteReportType = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.reportType.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete report type' });
  }
};

// --- Privacy Policy ---
exports.getPrivacyPolicy = async (req, res) => {
  const sections = await prisma.privacyPolicy.findMany();
  res.json({ privacyPolicy: sections });
};

exports.updatePrivacyPolicy = async (req, res) => {
  const { updates } = req.body; // { section: content, ... }
  // Upsert each section
  const results = [];
  for (const section in updates) {
    const content = updates[section];
    const upserted = await prisma.privacyPolicy.upsert({
      where: { section },
      update: { content },
      create: { section, content }
    });
    results.push(upserted);
  }
  res.json({ privacyPolicy: results });
};

// --- Terms of Service ---
exports.getTermsOfService = async (req, res) => {
  const sections = await prisma.termsOfService.findMany();
  res.json({ termsOfService: sections });
};

exports.updateTermsOfService = async (req, res) => {
  const { updates } = req.body; // { section: content, ... }
  const results = [];
  for (const section in updates) {
    const content = updates[section];
    const upserted = await prisma.termsOfService.upsert({
      where: { section },
      update: { content },
      create: { section, content }
    });
    results.push(upserted);
  }
  res.json({ termsOfService: results });
};