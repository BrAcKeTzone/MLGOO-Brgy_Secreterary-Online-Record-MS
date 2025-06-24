const prisma = require('../src/lib/prisma');

async function main() {
  console.log('Starting database seeding...');

  // Seed barangays
  const barangaysData = [
    { name: 'Abong-Abong' },
    { name: 'Baganian' },
    { name: 'Baya-Baya' },
    { name: 'Capisan' },
    { name: 'Concepcion' },
    { name: 'Culabay' },
    { name: 'Dona Josefina' },
    { name: 'Lumbia' },
    { name: 'Mabuhay' },
    { name: 'Malim' },
    { name: 'Manicaan' },
    { name: 'New Oroquieta' },
    { name: 'Poblacion' },
    { name: 'San Francisco' },
    { name: 'Tultolan' }
  ];

  console.log('Seeding barangays...');
  await Promise.all(
    barangaysData.map(async (barangay) => {
      await prisma.barangay.upsert({
        where: { name: barangay.name },
        update: {},
        create: barangay
      });
    })
  );

  // Seed report types
  const reportTypesData = [
    {
      name: 'Katarungang Pambarangay (KP) Report',
      shortName: 'KP Report'
    },
    {
      name: 'Minutes of Barangay Council Regular Session',
      shortName: 'Council Minutes'
    },
    {
      name: 'Monthly Accomplishment Report',
      shortName: 'Monthly Report'
    },
    {
      name: 'Kasambahay Reports',
      shortName: 'Kasambahay'
    },
    {
      name: 'Barangay Road Cleaning Operations (BaRCO) Report',
      shortName: 'BaRCO Report'
    },
    {
      name: 'Barangay Violence Against Women (BVAW) Report',
      shortName: 'BVAW Report'
    },
    {
      name: 'Barangay Full Disclosure Policy (BFDP) Report',
      shortName: 'BFDP Report'
    }
  ];

  console.log('Seeding report types...');
  await Promise.all(
    reportTypesData.map(async (reportType) => {
      await prisma.reportType.upsert({
        where: { 
          name_shortName: {
            name: reportType.name,
            shortName: reportType.shortName
          }
        },
        update: {},
        create: reportType
      });
    })
  ).catch(e => {
    // Handle error if name_shortName composite unique constraint doesn't exist
    console.log('Using alternative method for report types...');
    return Promise.all(
      reportTypesData.map(async (reportType) => {
        const exists = await prisma.reportType.findFirst({
          where: { 
            name: reportType.name,
            shortName: reportType.shortName
          }
        });
        
        if (!exists) {
          await prisma.reportType.create({
            data: reportType
          });
        }
      })
    );
  });

  // Seed valid ID types
  const validIDTypesData = [
    {
      name: 'Driver\'s License',
      description: 'Government-issued driver\'s license',
      isActive: true
    },
    {
      name: 'Passport',
      description: 'Government-issued passport',
      isActive: true
    },
    {
      name: 'National ID',
      description: 'Philippine National ID',
      isActive: true
    },
    {
      name: 'SSS ID',
      description: 'Social Security System ID',
      isActive: true
    },
    {
      name: 'PhilHealth ID',
      description: 'PhilHealth Insurance Card',
      isActive: true
    },
    {
      name: 'Voter\'s ID',
      description: 'COMELEC Voter\'s ID',
      isActive: true
    },
    {
      name: 'Postal ID',
      description: 'Philippine Postal ID',
      isActive: true
    },
    {
      name: 'PRC ID',
      description: 'Professional Regulation Commission ID',
      isActive: true
    },
    {
      name: 'Barangay ID',
      description: 'Barangay-issued identification card',
      isActive: true
    },
    {
      name: 'TIN ID',
      description: 'Tax Identification Number ID',
      isActive: true
    }
  ];

  console.log('Seeding valid ID types...');
  await Promise.all(
    validIDTypesData.map(async (validIDType) => {
      await prisma.validIDType.upsert({
        where: { name: validIDType.name },
        update: {},
        create: {
          ...validIDType,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    })
  );

  // Seed privacy policy from optionsPrivacyPolicy.js
  const privacyPolicyData = [
    {
      title: 'Information Collection',
      content: 'We collect information you provide directly to us, such as your name, email, and other contact details. We may also collect information about your interactions with our services, including usage data and preferences. Additionally, we may collect information from third-party sources to verify your identity and enhance our services.',
      order: 1
    },
    {
      title: 'Use of Information',
      content: 'We use your information to provide and improve our services, communicate with you, and ensure the security of our platform. We may also use your information to personalize your experience, send you important updates and notifications, and conduct research to improve our services. We will not share your personal information with third parties without your consent, except as necessary to provide our services or as required by law.',
      order: 2
    },
    {
      title: 'Data Security',
      content: 'We implement robust security measures to protect your information from unauthorized access, disclosure, alteration, and destruction. These measures include encryption, secure storage, and regular security audits. We also require our employees and contractors to adhere to strict confidentiality policies. While we strive to ensure the highest level of security, no system can be completely secure, and we cannot guarantee the absolute security of your information.',
      order: 3
    },
    {
      title: 'Data Retention',
      content: 'We retain your information for as long as necessary to provide our services and fulfill our legal obligations. This may include retaining your information for the duration of your account with us and for a reasonable period afterward to resolve any disputes or comply with legal requirements.',
      order: 4
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, correct, and delete your personal information. You may also have the right to restrict or object to the processing of your information. To exercise these rights, please contact us through the contact information provided on our website. We will respond to your request within a reasonable time frame.',
      order: 5
    },
    {
      title: 'Changes to Privacy Policy',
      content: 'We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy on our website and, if necessary, through other means such as email. Your continued use of our services after the effective date of the updated Privacy Policy constitutes your acceptance of the changes.',
      order: 6
    }
  ];

  console.log('Seeding privacy policy sections...');
  await Promise.all(
    privacyPolicyData.map(async (section) => {
      const existingSection = await prisma.privacyPolicy.findFirst({
        where: { title: section.title }
      });
      
      if (!existingSection) {
        await prisma.privacyPolicy.create({
          data: {
            ...section,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    })
  );

  // Seed terms of service from optionsTermsOfService.js
  const termsOfServiceData = [
    {
      title: 'Acceptable Use',
      content: 'You agree to use our platform only for lawful purposes and in a manner that does not infringe the rights of others. You must comply with all applicable laws and regulations. You may not use our platform to upload, post, or transmit any content that is defamatory, discriminatory, harmful, or otherwise inappropriate. You are responsible for the content you create, upload, or share on our platform.',
      order: 1
    },
    {
      title: 'Account Security',
      content: 'You are responsible for maintaining the security of your account and password. You must keep your password confidential and not share it with others. You must notify us immediately if you suspect any unauthorized use of your account. We reserve the right to suspend or terminate your account if we suspect any security breach or unauthorized activity.',
      order: 2
    },
    {
      title: 'Limitation of Liability',
      content: 'We are not liable for any damages arising from your use of our platform, including but not limited to direct, indirect, incidental, consequential, or punitive damages. This limitation of liability applies to the fullest extent permitted by law. We do not guarantee that our platform will be uninterrupted, error-free, or secure, and we are not responsible for any loss or damage resulting from the use of our platform.',
      order: 3
    },
    {
      title: 'Intellectual Property',
      content: 'All content on our platform, including text, graphics, logos, and software, is the property of our company or our licensors and is protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or reproduce any content from our platform without our prior written consent.',
      order: 4
    },
    {
      title: 'Termination',
      content: 'We reserve the right to terminate or suspend your access to our platform at any time, with or without cause, and without prior notice. Upon termination, you must cease all use of our platform and delete any content obtained from our platform.',
      order: 5
    },
    {
      title: 'Changes to Terms of Service',
      content: 'We may update our Terms of Service from time to time to reflect changes in our services or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Terms of Service on our website and, if necessary, through other means such as email. Your continued use of our services after the effective date of the updated Terms of Service constitutes your acceptance of the changes.',
      order: 6
    }
  ];

  console.log('Seeding terms of service sections...');
  await Promise.all(
    termsOfServiceData.map(async (section) => {
      const existingSection = await prisma.termsOfService.findFirst({
        where: { title: section.title }
      });
      
      if (!existingSection) {
        await prisma.termsOfService.create({
          data: {
            ...section,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
    })
  );

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });