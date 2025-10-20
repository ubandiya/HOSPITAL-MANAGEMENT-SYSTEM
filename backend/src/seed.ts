import prisma from './config/database';
import { hashPassword } from './utils/hash';

async function main() {
  console.log('Starting database seed...');

  // Create roles
  console.log('Creating roles...');

  const roles = [
    {
      name: 'super_admin',
      permissions: {
        all: true,
      },
    },
    {
      name: 'admin',
      permissions: {
        users: ['create', 'read', 'update', 'delete'],
        staff: ['create', 'read', 'update', 'delete'],
        departments: ['create', 'read', 'update', 'delete'],
        reports: ['read', 'export'],
      },
    },
    {
      name: 'doctor',
      permissions: {
        patients: ['create', 'read', 'update'],
        appointments: ['read', 'update'],
        medicalRecords: ['create', 'read', 'update'],
        prescriptions: ['create', 'read', 'update'],
        labOrders: ['create', 'read'],
      },
    },
    {
      name: 'nurse',
      permissions: {
        patients: ['read', 'update'],
        appointments: ['read'],
        medicalRecords: ['read', 'update'],
        admissions: ['read', 'update'],
        vitalSigns: ['create', 'read', 'update'],
      },
    },
    {
      name: 'receptionist',
      permissions: {
        patients: ['create', 'read', 'update'],
        appointments: ['create', 'read', 'update', 'delete'],
        admissions: ['create', 'read'],
      },
    },
    {
      name: 'pharmacist',
      permissions: {
        prescriptions: ['read'],
        medications: ['create', 'read', 'update'],
        pharmacy: ['create', 'read', 'update'],
      },
    },
    {
      name: 'lab_technician',
      permissions: {
        labOrders: ['read', 'update'],
        labResults: ['create', 'read', 'update'],
        labTests: ['read'],
      },
    },
    {
      name: 'billing_staff',
      permissions: {
        invoices: ['create', 'read', 'update'],
        payments: ['create', 'read'],
        reports: ['read', 'export'],
      },
    },
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
  }

  console.log('Roles created successfully!');

  // Create default admin user
  console.log('Creating default admin user...');

  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'super_admin' },
  });

  if (superAdminRole) {
    const hashedPassword = await hashPassword('Admin@123');

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@hospital.local' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@hospital.local',
        passwordHash: hashedPassword,
        roleId: superAdminRole.id,
        isActive: true,
      },
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@hospital.local');
    console.log('Password: Admin@123');
    console.log('⚠️  Please change this password after first login!');

    // Create staff profile for admin
    await prisma.staff.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        firstName: 'System',
        lastName: 'Administrator',
        gender: 'Other',
        phone: '0000000000',
        status: 'active',
      },
    });
  }

  // Create sample departments
  console.log('Creating sample departments...');

  const departments = [
    { name: 'General Medicine', description: 'General medical consultations and treatments' },
    { name: 'Cardiology', description: 'Heart and cardiovascular system' },
    { name: 'Pediatrics', description: 'Child healthcare' },
    { name: 'Orthopedics', description: 'Bone and musculoskeletal system' },
    { name: 'Emergency', description: 'Emergency and trauma care' },
    { name: 'Radiology', description: 'Medical imaging and diagnostics' },
    { name: 'Laboratory', description: 'Clinical laboratory and pathology' },
    { name: 'Pharmacy', description: 'Medication dispensing and management' },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
  }

  console.log('Departments created successfully!');

  // Create sample lab tests
  console.log('Creating sample lab tests...');

  const labTests = [
    {
      testName: 'Complete Blood Count (CBC)',
      testCode: 'LAB-CBC-001',
      category: 'Hematology',
      description: 'Comprehensive blood cell analysis',
      price: 500.0,
    },
    {
      testName: 'Blood Glucose (Fasting)',
      testCode: 'LAB-GLU-001',
      category: 'Biochemistry',
      description: 'Fasting blood sugar level',
      normalRange: '70-100 mg/dL',
      unit: 'mg/dL',
      price: 200.0,
    },
    {
      testName: 'Lipid Profile',
      testCode: 'LAB-LIP-001',
      category: 'Biochemistry',
      description: 'Cholesterol and triglycerides test',
      price: 800.0,
    },
    {
      testName: 'Thyroid Function Test (TFT)',
      testCode: 'LAB-THY-001',
      category: 'Endocrinology',
      description: 'T3, T4, and TSH levels',
      price: 1200.0,
    },
    {
      testName: 'Urine Routine',
      testCode: 'LAB-URI-001',
      category: 'Urinalysis',
      description: 'Comprehensive urine analysis',
      price: 300.0,
    },
  ];

  for (const test of labTests) {
    await prisma.labTest.upsert({
      where: { testCode: test.testCode },
      update: {},
      create: test,
    });
  }

  console.log('Lab tests created successfully!');

  // Create sample medications
  console.log('Creating sample medications...');

  const medications = [
    {
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      manufacturer: 'Generic Pharma',
      category: 'Analgesic',
      dosageForm: 'Tablet',
      strength: '500mg',
      unitPrice: 2.0,
      stockQuantity: 1000,
      reorderLevel: 100,
    },
    {
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      manufacturer: 'Antibio Inc',
      category: 'Antibiotic',
      dosageForm: 'Capsule',
      strength: '250mg',
      unitPrice: 5.0,
      stockQuantity: 500,
      reorderLevel: 50,
    },
    {
      name: 'Omeprazole',
      genericName: 'Omeprazole',
      manufacturer: 'GastroMed',
      category: 'Antacid',
      dosageForm: 'Capsule',
      strength: '20mg',
      unitPrice: 8.0,
      stockQuantity: 300,
      reorderLevel: 30,
    },
  ];

  for (const med of medications) {
    await prisma.medication.create({
      data: med,
    });
  }

  console.log('Medications created successfully!');

  // Create sample wards
  console.log('Creating sample wards...');

  const wards = [
    { name: 'General Ward A', wardType: 'general', floorNumber: 1, capacity: 20 },
    { name: 'General Ward B', wardType: 'general', floorNumber: 2, capacity: 20 },
    { name: 'ICU', wardType: 'icu', floorNumber: 3, capacity: 10 },
    { name: 'Private Ward', wardType: 'private', floorNumber: 4, capacity: 15 },
  ];

  for (const ward of wards) {
    const createdWard = await prisma.ward.create({
      data: ward,
    });

    // Create beds for each ward
    for (let i = 1; i <= ward.capacity; i++) {
      await prisma.bed.create({
        data: {
          bedNumber: `${ward.name}-${i.toString().padStart(2, '0')}`,
          wardId: createdWard.id,
          bedType: ward.wardType,
          status: 'available',
          dailyCharge: ward.wardType === 'icu' ? 2000.0 : ward.wardType === 'private' ? 1500.0 : 500.0,
        },
      });
    }
  }

  console.log('Wards and beds created successfully!');

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - ${roles.length} roles created`);
  console.log(`   - 1 admin user created`);
  console.log(`   - ${departments.length} departments created`);
  console.log(`   - ${labTests.length} lab tests created`);
  console.log(`   - ${medications.length} medications created`);
  console.log(`   - ${wards.length} wards created`);
  console.log('\n🔐 Default Admin Credentials:');
  console.log('   Email: admin@hospital.local');
  console.log('   Password: Admin@123');
  console.log('   ⚠️  IMPORTANT: Change this password after first login!\n');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
