const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const dashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const student = await prisma.user.findUnique({
      where: { id: userId },
    });
    const activeCertificates = await prisma.certificate.count({
      where: {
        studentId: userId,
        status: "ACTIVE",
      },
    });
    const totalCertificates = await prisma.certificate.count({
      where: { studentId: userId },
    });
    const certificates = await prisma.certificate.findMany({
      where: { studentId: userId },
    });
    const lastissuedCertificate = await prisma.certificate.findFirst({
      where: { studentId: userId },
      orderBy: { issueDate: "desc" },
    });
    const requests = await prisma.request.findMany({
      where: { studentId: userId },
    });
    res.status(200).json({
      fullName: student.fullName,
      activeCertificates,
      totalCertificates,
      certificates,
      lastissuedCertificate,
      requests,
    });
  } catch (err) {
    res.status(500).json({ error: "an error occurred in the server" });
  }
};

const requests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { documentType, reason, delivery, priority } = req.body;
    if (!documentType || !reason || !delivery || !priority) {
      return res
        .status(400)
        .json({ message: "All Informations are required " });
    }
    await prisma.request.create({
      data: {
        studentId: userId,
        documentType,
        reason,
        delivery,
        priority,
      },
    });
    res.status(200).json({ message: "Request created succesfully" });
  } catch (err) {
    res.status(500).json({ error: "an error occurred in the server" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const student = await prisma.user.findUnique({
      where: { id: userId },
    });
    const { currentPassword, newPassword } = req.body;
    // check if the current password is correct
    const identical = await bcrypt.compare(currentPassword, student.password);
    if (!identical) {
      return res.status(400).json({ message: "Current password is false" });
    }
    // hash the new password and update it in the database
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: newHashedPassword,
      },
    });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "an error occured in the server" });
  }
};
module.exports = { dashboard, requests, changePassword };
