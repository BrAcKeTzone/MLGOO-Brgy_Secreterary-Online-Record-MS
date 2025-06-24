const prisma = require('../lib/prisma');
const { deleteMultipleImages } = require('../utils/cloudinary');
const path = require('path');

/**
 * Get all reports with pagination and filtering
 */
exports.getAllReports = async (req, res) => {
  try {
    const {
      search,
      reportType,
      status,
      barangay,
      year,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query conditions
    let whereConditions = {};

    // Apply search filter
    if (search) {
      whereConditions.OR = [
        { reportName: { contains: search } },
        { comments: { contains: search } }
      ];
    }

    // Apply report type filter
    if (reportType && reportType !== 'all') {
      whereConditions.reportType = reportType;
    }

    // Apply status filter
    if (status && status !== 'all') {
      whereConditions.status = status;
    }

    // Apply barangay filter
    if (barangay && barangay !== 'all') {
      whereConditions.barangayId = parseInt(barangay);
    }

    // Apply year filter
    if (year && year !== 'all') {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

      whereConditions.submittedDate = {
        gte: startDate,
        lt: endDate
      };
    }

    // For BARANGAY_SECRETARY, only show reports from their assigned barangay
    if (req.user.role === 'BARANGAY_SECRETARY') {
      whereConditions.barangayId = req.user.barangayId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get reports with pagination
    const [reports, totalCount] = await Promise.all([
      prisma.report.findMany({
        where: whereConditions,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          reportType: true,
          reportName: true,
          status: true,
          submittedDate: true,
          barangay: {
            select: {
              id: true,
              name: true
            }
          },
          submittedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          fileName: true,
          fileSize: true,
          comments: true,
          attachments: true,
          updatedAt: true
        },
        orderBy: {
          submittedDate: 'desc'
        }
      }),
      prisma.report.count({ where: whereConditions })
    ]);

    // Format reports for frontend response
    const formattedReports = reports.map(report => ({
      id: report.id.toString(),
      reportType: report.reportType,
      reportName: report.reportName,
      status: report.status,
      submittedDate: report.submittedDate,
      barangayId: report.barangay.id.toString(),
      barangayName: report.barangay.name,
      submittedBy: {
        id: report.submittedBy.id.toString(),
        name: `${report.submittedBy.firstName} ${report.submittedBy.lastName}`,
        email: report.submittedBy.email
      },
      fileName: report.fileName,
      fileSize: report.fileSize,
      comments: report.comments,
      attachments: report.attachments,
      updatedAt: report.updatedAt
    }));

    res.json({
      reports: formattedReports,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      message: 'Failed to fetch reports',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a specific report by ID
 */
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const reportId = parseInt(id);

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        reportType: true,
        reportName: true,
        status: true,
        submittedDate: true,
        barangay: {
          select: {
            id: true,
            name: true
          }
        },
        submittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        fileName: true,
        fileSize: true,
        comments: true,
        attachments: true,
        updatedAt: true
      }
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has access to this report
    if (req.user.role === 'BARANGAY_SECRETARY' && req.user.barangayId !== report.barangay.id) {
      return res.status(403).json({ message: 'You do not have access to this report' });
    }

    const formattedReport = {
      id: report.id.toString(),
      reportType: report.reportType,
      reportName: report.reportName,
      status: report.status,
      submittedDate: report.submittedDate,
      barangayId: report.barangay.id.toString(),
      barangayName: report.barangay.name,
      submittedBy: {
        id: report.submittedBy.id.toString(),
        name: `${report.submittedBy.firstName} ${report.submittedBy.lastName}`,
        email: report.submittedBy.email
      },
      fileName: report.fileName,
      fileSize: report.fileSize,
      comments: report.comments,
      attachments: report.attachments,
      updatedAt: report.updatedAt
    };

    res.json({ report: formattedReport });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      message: 'Failed to fetch report details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new report
 */
exports.createReport = async (req, res) => {
  try {
    const { 
      reportType, 
      reportName, 
      comments, 
      attachments 
    } = req.body;

    console.log("Received report submission:", {
      reportType,
      reportName,
      commentsLength: comments ? comments.length : 0,
      attachmentsCount: attachments ? attachments.length : 0
    });

    // Validate required fields
    if (!reportType || !reportName) {
      return res.status(400).json({ message: 'Report type and name are required' });
    }

    // Validate comments length - temporary solution until schema is updated
    if (comments && comments.length > 500) { // Assuming the current limit is around 255 chars
      return res.status(400).json({ message: 'Comments must be less than 500 characters' });
    }

    // Validate attachments
    if (!attachments || !Array.isArray(attachments) || attachments.length === 0) {
      return res.status(400).json({ message: 'At least one attachment is required' });
    }

    // Verify all attachments have required fields
    const validateAttachments = attachments.every(attachment => 
      attachment.url && attachment.public_id && 
      (attachment.fileName || attachment.originalname)
    );
    
    if (!validateAttachments) {
      return res.status(400).json({ message: 'All attachments must have url, public_id and fileName/originalname' });
    }

    // Ensure user is a BARANGAY_SECRETARY and has an assigned barangay
    if (req.user.role !== 'BARANGAY_SECRETARY') {
      return res.status(403).json({ message: 'Only Barangay Secretaries can submit reports' });
    }

    if (!req.user.barangayId) {
      return res.status(400).json({ message: 'You must have an assigned barangay to submit a report' });
    }

    // Fetch all report types for debugging
    const allReportTypes = await prisma.reportType.findMany();
    console.log("Available report types:", allReportTypes.map(rt => ({id: rt.id, name: rt.name, shortName: rt.shortName})));
    console.log("Trying to match:", reportType);

    // Try to find the report type based on ID first
    let reportTypeCheck = null;
    
    // If reportType is a number or string number, try finding by ID
    if (!isNaN(parseInt(reportType))) {
      reportTypeCheck = await prisma.reportType.findUnique({
        where: { id: parseInt(reportType) }
      });
    }
    
    // If not found by ID, try finding by shortName or name
    if (!reportTypeCheck) {
      reportTypeCheck = await prisma.reportType.findFirst({
        where: { 
          OR: [
            { shortName: reportType },
            { name: reportType }
          ]
        }
      });
    }

    if (!reportTypeCheck) {
      // If we couldn't find the report type, return detailed error
      return res.status(400).json({ 
        message: 'Invalid report type', 
        debug: { 
          providedType: reportType,
          availableTypes: allReportTypes.map(rt => ({
            id: rt.id, 
            name: rt.name, 
            shortName: rt.shortName
          }))
        }
      });
    }
    
    console.log("Matched report type:", reportTypeCheck);

    // Ensure attachments have the proper fileName format
    const formattedAttachments = attachments.map(attachment => {
      const fileNameToUse = attachment.fileName || attachment.originalname;
      const fileExt = attachment.fileExt || path.extname(fileNameToUse);
      const baseName = path.basename(fileNameToUse, fileExt);
      
      // Use existing formatted filename if it already follows our pattern
      if (baseName.includes(`_${reportTypeCheck.shortName}_`)) {
        return attachment;
      }
      
      // Format the filename if it doesn't already have the right format
      const dateStr = new Date().toISOString().split('T')[0];
      const formattedFileName = `${dateStr}_${reportTypeCheck.shortName}_${baseName}${fileExt}`;
      
      return {
        ...attachment,
        fileName: formattedFileName,
        fileExt: fileExt,
        contentType: attachment.contentType || attachment.mimetype
      };
    });

    // Calculate total file size
    const totalFileSize = formattedAttachments.reduce((sum, attachment) => sum + (parseInt(attachment.fileSize || attachment.size) || 0), 0);

    // Create report record
    const report = await prisma.report.create({
      data: {
        reportType: reportTypeCheck.shortName, // Use the standardized short name
        reportName,
        status: 'PENDING', // Default status
        submittedDate: new Date(),
        barangayId: req.user.barangayId,
        userId: req.user.id, // From authenticated user
        fileName: Array.isArray(formattedAttachments) && formattedAttachments.length > 0 ? 
          formattedAttachments[0].fileName : 'attachment',
        fileSize: totalFileSize,
        comments,
        attachments: formattedAttachments // Store the array of formatted attachment details
      },
      include: {
        barangay: true,
        submittedBy: true
      }
    });

    // Create log entry for successful report submission
    await prisma.log.create({
      data: {
        action: 'REPORT_SUBMITTED',
        userId: req.user.id,
        details: `User ${report.submittedBy.firstName} ${report.submittedBy.lastName} submitted report "${reportName}" (${reportTypeCheck.shortName}) from Barangay ${report.barangay.name}`
      }
    });

    res.status(201).json({
      message: 'Report submitted successfully',
      report: {
        id: report.id.toString(),
        reportType: report.reportType,
        reportName: report.reportName,
        status: report.status,
        submittedDate: report.submittedDate,
        barangayId: report.barangay.id.toString(),
        barangayName: report.barangay.name,
        submittedBy: {
          id: report.submittedBy.id.toString(),
          name: `${report.submittedBy.firstName} ${report.submittedBy.lastName}`,
          email: report.submittedBy.email
        },
        fileName: report.fileName,
        fileSize: report.fileSize,
        comments: report.comments,
        attachments: formattedAttachments
      }
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      message: 'Failed to create report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update report status (approve, reject)
 */
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;
    const reportId = parseInt(id);

    // Validate status
    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    // Only MLGOO_STAFF can update report status
    if (req.user.role !== 'MLGOO_STAFF') {
      return res.status(403).json({ message: 'Only MLGOO staff can update report status' });
    }

    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        barangay: true,
        submittedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!existingReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Update the report status
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        comments: comments || existingReport.comments, // Update comments if provided
        updatedAt: new Date()
      },
      include: {
        barangay: true,
        submittedBy: true
      }
    });

    // Create notification for the report submitter
    const notificationType = status === 'APPROVED' ? 'success' : 'alert';
    const notificationTitle = status === 'APPROVED' 
      ? 'Report Approved' 
      : 'Report Needs Revision';
    
    const notificationMessage = status === 'APPROVED'
      ? `Your report "${updatedReport.reportName}" has been approved.`
      : `Your report "${updatedReport.reportName}" has been rejected and needs revision. ${comments ? `Comments: ${comments}` : ''}`;

    // Create the notification in the database
    await prisma.notification.create({
      data: {
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
        priority: 'high',
        sentTo: {
          connect: { id: existingReport.submittedBy.id }
        }
      }
    });

    // Create log entry for this action
    await prisma.log.create({
      data: {
        action: `REPORT_${status}`,
        userId: req.user.id,
        details: `${status === 'APPROVED' ? 'Approved' : 'Rejected'} report "${updatedReport.reportName}" from ${existingReport.barangay.name}`
      }
    });

    res.json({
      message: `Report ${status.toLowerCase()} successfully`,
      report: {
        id: updatedReport.id.toString(),
        reportType: updatedReport.reportType,
        reportName: updatedReport.reportName,
        status: updatedReport.status,
        submittedDate: updatedReport.submittedDate,
        barangayId: updatedReport.barangay.id.toString(),
        barangayName: updatedReport.barangay.name,
        submittedBy: {
          id: updatedReport.submittedBy.id.toString(),
          name: `${updatedReport.submittedBy.firstName} ${updatedReport.submittedBy.lastName}`,
          email: updatedReport.submittedBy.email
        },
        fileName: updatedReport.fileName,
        fileSize: updatedReport.fileSize,
        comments: updatedReport.comments,
        attachments: updatedReport.attachments,
        updatedAt: updatedReport.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({
      message: 'Failed to update report status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete a report
 */
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const reportId = parseInt(id);

    // Check if report exists
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        barangay: true,
        submittedBy: true
      }
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to delete this report
    if (req.user.role === 'BARANGAY_SECRETARY') {
      // Barangay secretaries can only delete their own reports
      if (report.submittedBy.id !== req.user.id) {
        return res.status(403).json({ message: 'You can only delete your own reports' });
      }
      
      // Can only delete pending reports
      if (report.status !== 'PENDING') {
        return res.status(403).json({ 
          message: 'You can only delete pending reports. Contact MLGOO staff to delete approved or rejected reports.' 
        });
      }
    } // MLGOO_STAFF can delete any report

    // Delete files from cloudinary
    if (report.attachments && Array.isArray(report.attachments)) {
      const publicIds = report.attachments
        .filter(attachment => attachment.public_id)
        .map(attachment => attachment.public_id);

      if (publicIds.length > 0) {
        try {
          await deleteMultipleImages(publicIds);
        } catch (cloudinaryError) {
          console.error('Error deleting files from Cloudinary:', cloudinaryError);
          // Continue with report deletion even if file deletion fails
        }
      }
    }

    // Delete the report
    await prisma.report.delete({
      where: { id: reportId }
    });

    res.json({ 
      message: 'Report deleted successfully',
      deletedReport: {
        id: report.id.toString(),
        reportName: report.reportName,
        reportType: report.reportType
      }
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      message: 'Failed to delete report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get reports by barangay
 */
exports.getReportsByBarangay = async (req, res) => {
  try {
    const { barangayId } = req.params;
    const { 
      year, 
      reportType, 
      status,
      page = 1,
      limit = 10 
    } = req.query;

    const barId = parseInt(barangayId);
    
    // Build query conditions
    let whereConditions = { barangayId: barId };

    // Apply report type filter
    if (reportType && reportType !== 'all') {
      whereConditions.reportType = reportType;
    }

    // Apply status filter
    if (status && status !== 'all') {
      whereConditions.status = status;
    }

    // Apply year filter
    if (year && year !== 'all') {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

      whereConditions.submittedDate = {
        gte: startDate,
        lt: endDate
      };
    }

    // If user is BARANGAY_SECRETARY, ensure they can only access their assigned barangay
    if (req.user.role === 'BARANGAY_SECRETARY' && req.user.barangayId !== barId) {
      return res.status(403).json({ message: 'You can only access reports from your assigned barangay' });
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get reports with pagination
    const [reports, totalCount] = await Promise.all([
      prisma.report.findMany({
        where: whereConditions,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          reportType: true,
          reportName: true,
          status: true,
          submittedDate: true,
          barangay: {
            select: {
              id: true,
              name: true
            }
          },
          submittedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          fileName: true,
          fileSize: true,
          comments: true,
          attachments: true,
          updatedAt: true
        },
        orderBy: {
          submittedDate: 'desc'
        }
      }),
      prisma.report.count({ where: whereConditions })
    ]);

    // Format reports for frontend
    const formattedReports = reports.map(report => ({
      id: report.id.toString(),
      reportType: report.reportType,
      reportName: report.reportName,
      status: report.status,
      submittedDate: report.submittedDate,
      barangayId: report.barangay.id.toString(),
      barangayName: report.barangay.name,
      submittedBy: {
        id: report.submittedBy.id.toString(),
        name: `${report.submittedBy.firstName} ${report.submittedBy.lastName}`
      },
      fileName: report.fileName,
      fileSize: report.fileSize,
      comments: report.comments,
      attachments: report.attachments,
      updatedAt: report.updatedAt
    }));

    // Get barangay details
    const barangay = await prisma.barangay.findUnique({
      where: { id: barId },
      select: {
        id: true,
        name: true
      }
    });

    if (!barangay) {
      return res.status(404).json({ message: 'Barangay not found' });
    }

    res.json({
      barangay: {
        id: barangay.id.toString(),
        name: barangay.name
      },
      reports: formattedReports,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching barangay reports:', error);
    res.status(500).json({
      message: 'Failed to fetch reports for this barangay',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a report 
 */
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportName, comments, attachments } = req.body;
    const reportId = parseInt(id);

    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        submittedBy: true
      }
    });

    if (!existingReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to update this report
    if (req.user.role === 'BARANGAY_SECRETARY') {
      // Barangay secretaries can only update their own reports
      if (existingReport.submittedBy.id !== req.user.id) {
        return res.status(403).json({ message: 'You can only update your own reports' });
      }
      
      // Can only update pending reports
      if (existingReport.status !== 'PENDING') {
        return res.status(403).json({ message: 'You can only update pending reports' });
      }
    }

    // Log details for debugging
    console.log("Update request:", {
      reportId,
      reportName,
      commentsLength: comments ? comments.length : 0,
      hasAttachments: !!attachments,
      attachmentsCount: attachments ? attachments.length : 0
    });

    // Prepare update data
    const updateData = {};
    if (reportName) updateData.reportName = reportName;
    if (comments !== undefined) updateData.comments = comments;
    
    // Handle attachments update - important for replacing attachments
    if (attachments && Array.isArray(attachments)) {
      // Log the attachments structure for debugging
      console.log("Received attachments:", JSON.stringify(attachments, null, 2));

      // Ensure attachments have proper structure
      const validAttachments = attachments.filter(att => 
        att && (att.url || att.secure_url) && (att.public_id || att.originalname)
      );

      if (validAttachments.length === 0 && attachments.length > 0) {
        return res.status(400).json({ message: 'Invalid attachment format' });
      }

      // Format the attachments for storage
      const formattedAttachments = validAttachments.map(attachment => {
        // Use consistent property names for storage
        return {
          url: attachment.url || attachment.secure_url,
          public_id: attachment.public_id || '',
          fileName: attachment.fileName || attachment.originalname,
          fileSize: attachment.fileSize || attachment.size || 0,
          contentType: attachment.contentType || attachment.mimetype,
          fileExt: attachment.fileExt || path.extname(attachment.fileName || attachment.originalname || '')
        };
      });
      
      // Calculate total file size
      const totalFileSize = formattedAttachments.reduce((sum, attachment) => 
        sum + (parseInt(attachment.fileSize) || 0), 0);
      
      updateData.attachments = formattedAttachments;
      updateData.fileSize = totalFileSize;
      
      // Update the main fileName if there are new attachments
      if (formattedAttachments.length > 0) {
        updateData.fileName = formattedAttachments[0].fileName;
      }
    }

    updateData.updatedAt = new Date();

    // Update the report
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: updateData,
      include: {
        barangay: true,
        submittedBy: true
      }
    });

    res.json({
      message: 'Report updated successfully',
      report: {
        id: updatedReport.id.toString(),
        reportType: updatedReport.reportType,
        reportName: updatedReport.reportName,
        status: updatedReport.status,
        submittedDate: updatedReport.submittedDate,
        barangayId: updatedReport.barangay.id.toString(),
        barangayName: updatedReport.barangay.name,
        submittedBy: {
          id: updatedReport.submittedBy.id.toString(),
          name: `${updatedReport.submittedBy.firstName} ${updatedReport.submittedBy.lastName}`
        },
        fileName: updatedReport.fileName,
        fileSize: updatedReport.fileSize,
        comments: updatedReport.comments,
        attachments: updatedReport.attachments,
        updatedAt: updatedReport.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      message: 'Failed to update report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};