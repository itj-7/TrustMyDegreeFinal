const prisma = require('../config/prisma');

// get the code from the URL
const verifyCertificate = async (req, res) => {
  try {
    const { uniqueCode } = req.params;

    //sepecify the field to return do not return personal data
    
    const certificate = await prisma.certificate.findUnique({
      where: { uniqueCode },
      include: {
        student: {
          select: {
            fullName: true,
            matricule: true,
            placeOfBirth: true,
            dateOfBirth: true 
          }
        }
      }
    });

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        message: 'Certificate not found'
      });
    }

    if (certificate.status === 'REVOKED') {
      return res.status(400).json({
        valid: false,
        message: 'Certificate has been revoked'
      });
    }
     // for statistics page
    await prisma.verification.create({
      data: {
        certificateId: certificate.id,
        ipAddress: req.ip
      }
    });

    res.json({
      valid: true,
      message: 'Certificate is valid',
      certificate: {
        uniqueCode: certificate.uniqueCode,
        type: certificate.type,
        specialty: certificate.specialty,
        mention: certificate.mention,
        faculty: certificate.faculty,
        issueDate: certificate.issueDate,
        status: certificate.status,
        student: certificate.student
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message }); 
  }
};

module.exports = { verifyCertificate };