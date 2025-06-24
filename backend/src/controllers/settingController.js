const prisma = require('../lib/prisma');
const { convertToNumber } = require('../utils/helpers');

// --- Barangays ---
exports.getBarangays = async (req, res) => {
  try {
    const barangays = await prisma.barangay.findMany();
    res.json({ barangays });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch barangays', error: error.message });
  }
};

exports.createBarangay = async (req, res) => {
  try {
    const { name } = req.body;
    const barangay = await prisma.barangay.create({ data: { name } });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'BARANGAY_CREATED',
        userId: req.user.id,
        details: `Created new barangay "${name}" (ID: ${barangay.id})`
      }
    });
    
    res.status(201).json({ barangay });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create barangay', error: error.message });
  }
};

exports.updateBarangay = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // Get original barangay for logging
    const originalBarangay = await prisma.barangay.findUnique({
      where: { id: Number(id) }
    });
    
    const barangay = await prisma.barangay.update({
      where: { id: Number(id) },
      data: { name }
    });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'BARANGAY_UPDATED',
        userId: req.user.id,
        details: `Updated barangay ID ${id} from "${originalBarangay.name}" to "${name}"`
      }
    });
    
    res.json({ barangay });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update barangay', error: error.message });
  }
};

exports.deleteBarangay = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get barangay details for logging
    const barangay = await prisma.barangay.findUnique({
      where: { id: Number(id) }
    });
    
    await prisma.barangay.delete({ where: { id: Number(id) } });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'BARANGAY_DELETED',
        userId: req.user.id,
        details: `Deleted barangay "${barangay.name}" (ID: ${id})`
      }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete barangay', error: error.message });
  }
};

// --- Report Types ---
exports.getReportTypes = async (req, res) => {
  try {
    const reportTypes = await prisma.reportType.findMany();
    res.json({ reportTypes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report types', error: error.message });
  }
};

exports.createReportType = async (req, res) => {
  try {
    const { name, shortName } = req.body;
    const reportType = await prisma.reportType.create({ data: { name, shortName } });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'REPORT_TYPE_CREATED',
        userId: req.user.id,
        details: `Created new report type "${name}" with shortName "${shortName}" (ID: ${reportType.id})`
      }
    });
    
    res.status(201).json({ reportType });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create report type', error: error.message });
  }
};

exports.updateReportType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, shortName } = req.body;
    
    // Get original report type for logging
    const originalType = await prisma.reportType.findUnique({
      where: { id: Number(id) }
    });
    
    const reportType = await prisma.reportType.update({
      where: { id: Number(id) },
      data: { name, shortName }
    });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'REPORT_TYPE_UPDATED',
        userId: req.user.id,
        details: `Updated report type ID ${id} from "${originalType.name}" (${originalType.shortName}) to "${name}" (${shortName})`
      }
    });
    
    res.json({ reportType });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update report type', error: error.message });
  }
};

exports.deleteReportType = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get report type details for logging
    const reportType = await prisma.reportType.findUnique({
      where: { id: Number(id) }
    });
    
    await prisma.reportType.delete({ where: { id: Number(id) } });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'REPORT_TYPE_DELETED',
        userId: req.user.id,
        details: `Deleted report type "${reportType.name}" (${reportType.shortName}, ID: ${id})`
      }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete report type', error: error.message });
  }
};

// --- Privacy Policy ---
exports.getPrivacyPolicy = async (req, res) => {
  try {
    const privacyPolicy = await prisma.privacyPolicy.findMany({
      orderBy: { order: 'asc' }
    });
    res.json({ privacyPolicy });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch privacy policy', error: error.message });
  }
};

exports.createPrivacyPolicySection = async (req, res) => {
  try {
    const { title, content, order } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    // Check content length
    if (content.length > 65535) {
      return res.status(400).json({ 
        message: 'Content is too long. Maximum length is 65535 characters.' 
      });
    }
    
    // Handle order assignment
    let sectionOrder = order;
    
    // If order is specified, check for existing entry with that order
    if (sectionOrder !== undefined) {
      const existingWithOrder = await prisma.privacyPolicy.findFirst({
        where: { order: sectionOrder }
      });
      
      // If another section already has this order, find the next available order
      if (existingWithOrder) {
        // Find all orders to determine the next available
        const allSections = await prisma.privacyPolicy.findMany({
          orderBy: { order: 'asc' }
        });
        
        // Create a set of existing orders for quick lookup
        const existingOrders = new Set(allSections.map(section => section.order));
        
        // Find the next available order number
        while (existingOrders.has(sectionOrder)) {
          sectionOrder++;
        }
      }
    } 
    // If no order provided, use highest order + 1
    else {
      const highestOrder = await prisma.privacyPolicy.findFirst({
        orderBy: { order: 'desc' }
      });
      sectionOrder = highestOrder ? highestOrder.order + 1 : 1;
    }
    
    const section = await prisma.privacyPolicy.create({
      data: { 
        title, 
        content, 
        order: sectionOrder,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'PRIVACY_POLICY_CREATED',
        userId: req.user.id,
        details: `Created new privacy policy section "${title}" (ID: ${section.id}, Order: ${section.order})`
      }
    });
    
    res.status(201).json({ section });
  } catch (error) {
    console.error('Error creating privacy policy section:', error);
    res.status(500).json({ message: 'Failed to create privacy policy section', error: error.message });
  }
};

exports.updatePrivacyPolicySection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, order } = req.body;
    
    // Get original section for logging
    const originalSection = await prisma.privacyPolicy.findUnique({
      where: { id: Number(id) }
    });
    
    // Check content length if it's being updated
    if (content && content.length > 65535) {
      return res.status(400).json({ 
        message: 'Content is too long. Maximum length is 65535 characters.' 
      });
    }
    
    // Handle order updates
    let sectionOrder = order;
    
    // If order is being changed and specified in the request
    if (sectionOrder !== undefined && sectionOrder !== originalSection.order) {
      // Check if another section already has this order
      const existingWithOrder = await prisma.privacyPolicy.findFirst({
        where: { 
          order: sectionOrder,
          id: { not: Number(id) } // Exclude current section
        }
      });
      
      // If another section already has this order, find the next available order
      if (existingWithOrder) {
        // Find all orders to determine the next available
        const allSections = await prisma.privacyPolicy.findMany({
          where: { id: { not: Number(id) } }, // Exclude current section
          orderBy: { order: 'asc' }
        });
        
        // Create a set of existing orders for quick lookup
        const existingOrders = new Set(allSections.map(section => section.order));
        
        // Find the next available order number
        while (existingOrders.has(sectionOrder)) {
          sectionOrder++;
        }
      }
    }
    
    const section = await prisma.privacyPolicy.update({
      where: { id: Number(id) },
      data: { 
        title, 
        content,
        order: sectionOrder,
        updatedAt: new Date() // Ensure updatedAt is set on every update
      }
    });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'PRIVACY_POLICY_UPDATED',
        userId: req.user.id,
        details: `Updated privacy policy section ID ${id} from "${originalSection.title}" to "${title}"`
      }
    });
    
    res.json({ section });
  } catch (error) {
    console.error('Error updating privacy policy section:', error);
    res.status(500).json({ message: 'Failed to update privacy policy section', error: error.message });
  }
};

exports.deletePrivacyPolicySection = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if section exists
    const existingSection = await prisma.privacyPolicy.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingSection) {
      return res.status(404).json({ message: 'Privacy policy section not found' });
    }

    // Delete the section
    await prisma.privacyPolicy.delete({
      where: { id: Number(id) }
    });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'PRIVACY_POLICY_SECTION_DELETED',
        userId: req.user.id,
        details: `Deleted privacy policy section "${existingSection.title}" (ID: ${id})`
      }
    });
    
    // Get remaining sections ordered by their current order
    const remainingSections = await prisma.privacyPolicy.findMany({
      orderBy: { order: 'asc' }
    });
    
    // If there are remaining sections, reorder them sequentially from 1
    if (remainingSections.length > 0) {
      await prisma.$transaction(
        remainingSections.map((section, index) => 
          prisma.privacyPolicy.update({
            where: { id: section.id },
            data: { 
              order: index + 1,
              updatedAt: new Date()
            }
          })
        )
      );
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting privacy policy section:', error);
    res.status(500).json({ message: 'Failed to delete privacy policy section', error: error.message });
  }
};

// --- Terms of Service ---
exports.getTermsOfService = async (req, res) => {
  try {
    const termsOfService = await prisma.termsOfService.findMany({
      orderBy: { order: 'asc' }
    });
    res.json({ termsOfService });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch terms of service', error: error.message });
  }
};

exports.createTermsOfServiceSection = async (req, res) => {
  try {
    const { title, content, order } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    // Check content length - the exact limit depends on your schema
    if (content.length > 65535) {
      return res.status(400).json({ 
        message: 'Content is too long. Maximum length is 65535 characters.' 
      });
    }
    
    // Handle order assignment
    let sectionOrder = order;
    
    // If order is specified, check for existing entry with that order
    if (sectionOrder !== undefined) {
      const existingWithOrder = await prisma.termsOfService.findFirst({
        where: { order: sectionOrder }
      });
      
      // If another section already has this order, find the next available order
      if (existingWithOrder) {
        // Find all orders to determine the next available
        const allSections = await prisma.termsOfService.findMany({
          orderBy: { order: 'asc' }
        });
        
        // Create a set of existing orders for quick lookup
        const existingOrders = new Set(allSections.map(section => section.order));
        
        // Find the next available order number
        while (existingOrders.has(sectionOrder)) {
          sectionOrder++;
        }
      }
    } 
    // If no order provided, use highest order + 1
    else {
      const highestOrder = await prisma.termsOfService.findFirst({
        orderBy: { order: 'desc' }
      });
      sectionOrder = highestOrder ? highestOrder.order + 1 : 1;
    }
    
    const section = await prisma.termsOfService.create({
      data: { 
        title, 
        content, 
        order: sectionOrder,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'TERMS_OF_SERVICE_CREATED',
        userId: req.user.id,
        details: `Created new terms of service section "${title}" (ID: ${section.id}, Order: ${section.order})`
      }
    });
    
    res.status(201).json({ section });
  } catch (error) {
    console.error('Error creating terms of service section:', error);
    res.status(500).json({ message: 'Failed to create terms of service section', error: error.message });
  }
};

exports.updateTermsOfServiceSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, order } = req.body;
    
    // Get original section for logging
    const originalSection = await prisma.termsOfService.findUnique({
      where: { id: Number(id) }
    });
    
    // Check content length if it's being updated
    if (content && content.length > 65535) {
      return res.status(400).json({ 
        message: 'Content is too long. Maximum length is 65535 characters.' 
      });
    }
    
    // Handle order updates
    let sectionOrder = order;
    
    // If order is being changed and specified in the request
    if (sectionOrder !== undefined && sectionOrder !== originalSection.order) {
      // Check if another section already has this order
      const existingWithOrder = await prisma.termsOfService.findFirst({
        where: { 
          order: sectionOrder,
          id: { not: Number(id) } // Exclude current section
        }
      });
      
      // If another section already has this order, find the next available order
      if (existingWithOrder) {
        // Find all orders to determine the next available
        const allSections = await prisma.termsOfService.findMany({
          where: { id: { not: Number(id) } }, // Exclude current section
          orderBy: { order: 'asc' }
        });
        
        // Create a set of existing orders for quick lookup
        const existingOrders = new Set(allSections.map(section => section.order));
        
        // Find the next available order number
        while (existingOrders.has(sectionOrder)) {
          sectionOrder++;
        }
      }
    }
    
    const section = await prisma.termsOfService.update({
      where: { id: Number(id) },
      data: { 
        title, 
        content,
        order: sectionOrder,
        updatedAt: new Date() // Ensure updatedAt is set on every update
      }
    });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'TERMS_OF_SERVICE_UPDATED',
        userId: req.user.id,
        details: `Updated terms of service section ID ${id} from "${originalSection.title}" to "${title}"`
      }
    });
    
    res.json({ section });
  } catch (error) {
    console.error('Error updating terms of service section:', error);
    res.status(500).json({ message: 'Failed to update terms of service section', error: error.message });
  }
};

exports.deleteTermsOfServiceSection = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if section exists
    const existingSection = await prisma.termsOfService.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingSection) {
      return res.status(404).json({ message: 'Terms of service section not found' });
    }
    
    // Delete the section
    await prisma.termsOfService.delete({
      where: { id: Number(id) }
    });

    // Create log entry
    await prisma.log.create({
      data: {
        action: 'TERMS_OF_SERVICE_SECTION_DELETED',
        userId: req.user.id,
        details: `Deleted terms of service section "${existingSection.title}" (ID: ${id})`
      }
    });
    
    // Get remaining sections ordered by their current order
    const remainingSections = await prisma.termsOfService.findMany({
      orderBy: { order: 'asc' }
    });
    
    // If there are remaining sections, reorder them sequentially from 1
    if (remainingSections.length > 0) {
      await prisma.$transaction(
        remainingSections.map((section, index) => 
          prisma.termsOfService.update({
            where: { id: section.id },
            data: { 
              order: index + 1,
              updatedAt: new Date()
            }
          })
        )
      );
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting terms of service section:', error);
    res.status(500).json({ message: 'Failed to delete terms of service section', error: error.message });
  }
};

// --- Reorder sections ---
exports.reorderPrivacyPolicySections = async (req, res) => {
  try {
    const { sections } = req.body; // Array of { id, order }
    
    if (!Array.isArray(sections)) {
      return res.status(400).json({ message: 'Sections must be an array' });
    }
    
    // Update all sections in a transaction
    const updates = await prisma.$transaction(
      sections.map(section => 
        prisma.privacyPolicy.update({
          where: { id: Number(section.id) },
          data: { 
            order: section.order,
            updatedAt: new Date() // Ensure updatedAt is set on reordering
          }
        })
      )
    );
    
    res.json({ updated: updates.length });
  } catch (error) {
    console.error('Error reordering privacy policy sections:', error);
    res.status(500).json({ message: 'Failed to reorder privacy policy sections', error: error.message });
  }
};

exports.reorderTermsOfServiceSections = async (req, res) => {
  try {
    const { sections } = req.body; // Array of { id, order }
    
    if (!Array.isArray(sections)) {
      return res.status(400).json({ message: 'Sections must be an array' });
    }
    
    // Update all sections in a transaction
    const updates = await prisma.$transaction(
      sections.map(section => 
        prisma.termsOfService.update({
          where: { id: Number(section.id) },
          data: { 
            order: section.order,
            updatedAt: new Date() // Ensure updatedAt is set on reordering
          }
        })
      )
    );
    
    res.json({ updated: updates.length });
  } catch (error) {
    console.error('Error reordering terms of service sections:', error);
    res.status(500).json({ message: 'Failed to reorder terms of service sections', error: error.message });
  }
};

// --- Valid ID Types ---
exports.getValidIDTypes = async (req, res) => {
  try {
    const validIDTypes = await prisma.validIDType.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ validIDTypes });
  } catch (error) {
    console.error('Error fetching valid ID types:', error);
    res.status(500).json({ message: 'Failed to fetch valid ID types', error: error.message });
  }
};

exports.getActiveValidIDTypes = async (req, res) => {
  try {
    const validIDTypes = await prisma.validIDType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json({ validIDTypes });
  } catch (error) {
    console.error('Error fetching active valid ID types:', error);
    res.status(500).json({ message: 'Failed to fetch active valid ID types', error: error.message });
  }
};

// Update the createValidIDType function
exports.createValidIDType = async (req, res) => {
  try {
    const { name, description, isActive = true } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    // Check if ID type already exists
    const existingType = await prisma.validIDType.findFirst({
      where: {
        name: {
          equals: name
        }
      }
    });
    
    if (existingType) {
      return res.status(400).json({ message: 'A valid ID type with this name already exists' });
    }
    
    // Create with description if provided
    const validIDType = await prisma.validIDType.create({
      data: { 
        name,
        description,
        isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    // Create log entry
    await prisma.log.create({
      data: {
        action: 'VALID_ID_TYPE_CREATED',
        userId: req.user.id,
        details: `Created new valid ID type "${name}" (ID: ${validIDType.id}, Active: ${isActive})`
      }
    });
    
    res.status(201).json({ validIDType });
  } catch (error) {
    console.error('Error creating valid ID type:', error);
    res.status(500).json({ message: 'Failed to create valid ID type', error: error.message });
  }
};

// Update the updateValidIDType function
exports.updateValidIDType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    
    // Check if ID type exists
    const existingType = await prisma.validIDType.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingType) {
      return res.status(404).json({ message: 'Valid ID type not found' });
    }
    
    // Check if name already exists 
    if (name && name.toLowerCase() !== existingType.name.toLowerCase()) {
      const nameExists = await prisma.validIDType.findFirst({
        where: { 
          name: { equals: name },
          id: { not: Number(id) } // Exclude current record
        }
      });
      
      if (nameExists) {
        return res.status(400).json({ message: 'A valid ID type with this name already exists' });
      }
    }
    
    // Update data object
    const updateData = {
      updatedAt: new Date()
    };
    
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const validIDType = await prisma.validIDType.update({
      where: { id: Number(id) },
      data: updateData
    });
    
    res.json({ validIDType });
  } catch (error) {
    console.error('Error updating valid ID type:', error);
    res.status(500).json({ message: 'Failed to update valid ID type', error: error.message });
  }
};

// Update the deleteValidIDType function
exports.deleteValidIDType = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Add better ID parsing with error handling
    const idNumber = convertToNumber(id);
    
    if (idNumber === null) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    // Check if ID type exists
    const existingType = await prisma.validIDType.findUnique({
      where: { id: idNumber }
    });
    
    if (!existingType) {
      return res.status(404).json({ message: 'Valid ID type not found' });
    }
    
    // Delete the ID type
    await prisma.validIDType.delete({
      where: { id: idNumber }
    });
    
    // Log success for debugging
    console.log(`Successfully deleted ValidIDType with id ${idNumber}`);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting valid ID type:', error);
    res.status(500).json({ message: 'Failed to delete valid ID type', error: error.message });
  }
};

exports.toggleValidIDTypeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ID type exists
    const existingType = await prisma.validIDType.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingType) {
      return res.status(404).json({ message: 'Valid ID type not found' });
    }
    
    // Toggle active status
    const validIDType = await prisma.validIDType.update({
      where: { id: Number(id) },
      data: { 
        isActive: !existingType.isActive,
        updatedAt: new Date()
      }
    });
    
    res.json({ validIDType });
  } catch (error) {
    console.error('Error toggling valid ID type status:', error);
    res.status(500).json({ message: 'Failed to toggle valid ID type status', error: error.message });
  }
};