require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Seed Admin User
  const existingAdmin = await prisma.user.findFirst({ where: { email: 'admin@school.com' } });
  if (!existingAdmin) {
    const password = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@school.com',
        password,
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log('Admin user seeded!');
  } else {
    console.log('Admin already exists');
  }

  // Seed Faculty User
  const existingFaculty = await prisma.user.findFirst({ where: { email: 'faculty@school.com' } });
  if (!existingFaculty) {
    const password = await bcrypt.hash('faculty123', 10);
    await prisma.user.create({
      data: {
        email: 'faculty@school.com',
        password,
        name: 'Faculty',
        role: 'FACULTY',
      },
    });
    console.log('Faculty user seeded!');
  } else {
    console.log('Faculty already exists');
  }

  // Seed Student User
  const existingStudent = await prisma.user.findFirst({ where: { email: 'student@school.com' } });
  if (!existingStudent) {
    const password = await bcrypt.hash('student123', 10);
    await prisma.user.create({
      data: {
        email: 'student@school.com',
        password,
        name: 'Student',
        role: 'STUDENT',
      },
    });
    console.log('Student user seeded!');
  } else {
    console.log('Student already exists');
  }

  // Seed Department - Computer Science
  const departmentCS = await prisma.department.upsert({
    where: { name: 'Computer Science' },
    update: {},
    create: {
      name: 'Computer Science',
    },
  });
  console.log('Department seeded:', departmentCS.name);

  // Seed Department - Engineering
  const departmentEng = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: {
      name: 'Engineering',
    },
  });
  console.log('Department seeded:', departmentEng.name);

  // Seed Program - Computer Science
  const existingProgramCS = await prisma.program.findFirst({
    where: { name: 'Bachelor of Science in Computer Science' },
  });

  let programCS; // Declare program variable here

  if (!existingProgramCS) {
    programCS = await prisma.program.create({
      data: {
        name: 'Bachelor of Science in Computer Science',
        level: 'College',
        departmentId: departmentCS.id,
      },
    });
    console.log('Program seeded:', programCS.name);
  } else {
    console.log('Program already exists:', existingProgramCS.name);
    programCS = existingProgramCS; // Assign existingProgram to program
  }

  // Seed Program - Civil Engineering
  const existingProgramCE = await prisma.program.findFirst({
    where: { name: 'Bachelor of Science in Civil Engineering' },
  });

  let programCE; // Declare program variable here

  if (!existingProgramCE) {
    programCE = await prisma.program.create({
      data: {
        name: 'Bachelor of Science in Civil Engineering',
        level: 'College',
        departmentId: departmentEng.id,
      },
    });
    console.log('Program seeded:', programCE.name);
  } else {
    console.log('Program already exists:', existingProgramCE.name);
    programCE = existingProgramCE; // Assign existingProgram to program
  }

  // Seed Course - Computer Science
  const courseCS101 = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      programId: programCS.id,
    },
  });
  console.log('Course seeded:', courseCS101.title);

  const courseCS201 = await prisma.course.upsert({
    where: { code: 'CS201' },
    update: {},
    create: {
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      programId: programCS.id,
    },
  });
  console.log('Course seeded:', courseCS201.title);

  const courseCS301 = await prisma.course.upsert({
    where: { code: 'CS301' },
    update: {},
    create: {
      code: 'CS301',
      title: 'Database Management Systems',
      programId: programCS.id,
    },
  });
  console.log('Course seeded:', courseCS301.title);

  // Seed Course - Civil Engineering
  const courseCE101 = await prisma.course.upsert({
    where: { code: 'CE101' },
    update: {},
    create: {
      code: 'CE101',
      title: 'Introduction to Civil Engineering',
      programId: programCE.id,
    },
  });
  console.log('Course seeded:', courseCE101.title);

  const courseCE201 = await prisma.course.upsert({
    where: { code: 'CE201' },
    update: {},
    create: {
      code: 'CE201',
      title: 'Structural Analysis',
      programId: programCE.id,
    },
  });
  console.log('Course seeded:', courseCE201.title);

  const courseCE301 = await prisma.course.upsert({
    where: { code: 'CE301' },
    update: {},
    create: {
      code: 'CE301',
      title: 'Construction Management',
      programId: programCE.id,
    },
  });
  console.log('Course seeded:', courseCE301.title);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
