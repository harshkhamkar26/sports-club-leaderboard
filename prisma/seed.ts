import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Create Admins
  const passwordHash = await bcrypt.hash("password123", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@uaiu.edu" },
    update: {},
    create: {
      email: "admin@uaiu.edu",
      name: "System Admin",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  const harshPasswordHash = await bcrypt.hash("Harsh@890", 10);
  await prisma.admin.upsert({
    where: { email: "harshkhamkar26@gmail.com" },
    update: { passwordHash: harshPasswordHash },
    create: {
      email: "harshkhamkar26@gmail.com",
      name: "Harsh Khamkar",
      passwordHash: harshPasswordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Created Admin:", admin.email);

  // 2. Create Schools
  const schoolsData = [
    { name: "School of Engineering", code: "ENG", color: "#3B82F6" },
    { name: "School of Business", code: "BUS", color: "#F59E0B" },
    { name: "School of AI & Future Technologies", code: "AIF", color: "#8B5CF6" },
    { name: "School of Design", code: "DSN", color: "#EC4899" },
    { name: "School of Law", code: "LAW", color: "#10B981" },
    { name: "School of Liberal Arts", code: "ART", color: "#F97316" },
  ];

  const createdSchools: Record<string, string> = {};
  for (const s of schoolsData) {
    const school = await prisma.school.upsert({
      where: { code: s.code },
      update: { name: s.name, color: s.color },
      create: s,
    });
    createdSchools[s.code] = school.id;
  }
  console.log("Created 6 Schools.");

  // 3. Create Departments
  const departmentsData = [
    { name: "Computer Science", code: "CS", schoolCode: "ENG" },
    { name: "Electronics Engineering", code: "ECE", schoolCode: "ENG" },
    { name: "Business Administration", code: "MBA", schoolCode: "BUS" },
    { name: "Data Science", code: "DS", schoolCode: "AIF" },
    { name: "AI Research", code: "AIR", schoolCode: "AIF" },
    { name: "Product Design", code: "PD", schoolCode: "DSN" },
    { name: "Fashion Design", code: "FDN", schoolCode: "DSN" },
    { name: "Law", code: "LAW", schoolCode: "LAW" },
    { name: "English Literature", code: "ELT", schoolCode: "ART" },
    { name: "Psychology", code: "PSY", schoolCode: "ART" },
  ];

  const createdDepartments: Record<string, string> = {};
  for (const d of departmentsData) {
    const dept = await prisma.department.upsert({
      where: { schoolId_code: { schoolId: createdSchools[d.schoolCode], code: d.code } },
      update: {},
      create: {
        name: d.name,
        code: d.code,
        schoolId: createdSchools[d.schoolCode],
      },
    });
    createdDepartments[d.code] = dept.id;
  }
  console.log("Created 10 Departments.");

  // 4. Create Houses
  const housesData = [
    { name: "Red House", color: "RED" },
    { name: "Blue House", color: "BLUE" },
    { name: "Green House", color: "GREEN" },
    { name: "Yellow House", color: "YELLOW" },
  ];

  const createdHouses: Record<string, string> = {};
  for (const h of housesData) {
    const house = await prisma.house.upsert({
      where: { name: h.name },
      update: { color: h.color },
      create: h,
    });
    createdHouses[h.name] = house.id;
  }
  console.log("Created 4 Houses.");

  // 5. Create Sports
  const sportsData = [
    { name: "Basketball", icon: "sports_basketball", gender: "MIXED", unit: "points" },
    { name: "Football", icon: "sports_soccer", gender: "MIXED", unit: "goals" },
    { name: "Tennis", icon: "sports_tennis", gender: "MIXED", unit: "games" },
    { name: "Athletics", icon: "directions_run", gender: "MIXED", unit: "seconds" },
    { name: "Swimming", icon: "pool", gender: "MIXED", unit: "seconds" },
    { name: "Volleyball", icon: "sports_volleyball", gender: "MIXED", unit: "points" },
    { name: "Badminton", icon: "sports_tennis", gender: "MIXED", unit: "games" },
    { name: "Table Tennis", icon: "sports_table_tennis", gender: "MIXED", unit: "games" },
    { name: "Chess", icon: "sports_chess", gender: "MIXED", unit: "points" },
  ];

  const createdSports: Record<string, string> = {};
  for (const s of sportsData) {
    const sport = await prisma.sport.upsert({
      where: { name: s.name },
      update: { icon: s.icon, gender: s.gender, unit: s.unit },
      create: s,
    });
    createdSports[s.name] = sport.id;
  }
  console.log("Created 9 Sports.");

  // 6. Create Students (45 students)
  const firstNames = ["Harsh", "Elena", "Marcus", "Aisha", "Tyler", "Sarah", "Rohan", "David", "Jessica", "James", "Maria", "John", "Linda", "Robert", "Emily", "Michael", "Emma", "William", "Olivia", "Richard", "Sophia", "Joseph", "Isabella", "Thomas", "Mia", "Charles", "Charlotte", "Daniel", "Amelia", "Matthew", "Evelyn", "Anthony", "Abigail", "Donald", "Harper", "Steven", "Lily", "Paul", "Ella", "Andrew", "Chloe", "Joshua", "Victoria", "Kenneth", "Grace", "Kevin"];
  const lastNames = ["Khamkar", "Rostova", "Vance", "Khan", "Smith", "Jenkins", "Patel", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"];

  const schoolCodes = ["ENG", "BUS", "AIF", "DSN", "LAW", "ART"];
  const departmentCodes = ["CS", "ECE", "MBA", "DS", "AIR", "PD", "FDN", "LAW", "ELT", "PSY"];
  const sportNames = ["Basketball", "Football", "Tennis", "Athletics", "Swimming", "Volleyball", "Badminton", "Table Tennis", "Chess"];
  const genders = ["MALE", "FEMALE", "MALE", "FEMALE", "MALE", "FEMALE"];
  const houses = ["Red House", "Blue House", "Green House", "Yellow House"];

  // Clear existing students first
  await prisma.student.deleteMany({});

  for (let i = 0; i < 45; i++) {
    const schoolCode = schoolCodes[i % schoolCodes.length];
    const deptCode = departmentCodes[i % departmentCodes.length];
    const sportName = sportNames[i % sportNames.length];
    const gender = genders[i % genders.length];
    const houseName = houses[i % houses.length];

    await prisma.student.create({
      data: {
        rollNumber: `UAI-2024-${String(i + 1).padStart(3, '0')}`,
        name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        className: schoolCodes[i % schoolCodes.length],
        house: houseName,
        gender,
        schoolId: createdSchools[schoolCode],
        departmentId: createdDepartments[deptCode],
        sportId: createdSports[sportName],
      },
    });
  }

  // Ensure Harsh Khamkar is top dog
  await prisma.student.updateMany({
    where: { rollNumber: "UAI-2024-001" },
    data: {
      name: "Harsh Khamkar",
      schoolId: createdSchools["AIF"],
      departmentId: createdDepartments["DS"],
      sportId: createdSports["Basketball"],
      gender: "MALE",
    },
  });

  await prisma.student.updateMany({
    where: { rollNumber: "UAI-2024-002" },
    data: {
      name: "Elena Rostova",
      schoolId: createdSchools["BUS"],
      departmentId: createdDepartments["MBA"],
      sportId: createdSports["Tennis"],
      gender: "FEMALE",
    },
  });

  await prisma.student.updateMany({
    where: { rollNumber: "UAI-2024-003" },
    data: {
      name: "Marcus Vance",
      schoolId: createdSchools["ENG"],
      departmentId: createdDepartments["CS"],
      sportId: createdSports["Football"],
      gender: "MALE",
    },
  });

  const allStudents = await prisma.student.findMany();
  console.log("Created 45 Students.");

  // 7. Create Events (20 events)
  const eventsData = [];
  const sports = ["Basketball", "Football", "Tennis", "Athletics", "Swimming", "Volleyball", "Badminton", "Table Tennis", "Chess"];
  const categories = ["Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles"];
  const venues = ["Main University Arena", "Olympic Pool", "Court 3", "Track Stadium", "Gymnasium", "Indoor Arena"];

  for (let i = 0; i < 20; i++) {
    const sport = sports[i % sports.length];
    const type = ["Finals", "Semi-Finals", "Qualifiers", "Championship"][i % 4];
    const category = categories[i % categories.length];
    const venue = venues[i % venues.length];
    const date = new Date(2024, 9, i + 1); // Oct 2024

    eventsData.push({
      name: `${sport} ${type}`,
      date,
      sportId: createdSports[sport],
      category,
      venue,
      startTime: new Date(date.getTime() + 10 * 60 * 60 * 1000), // 10 AM
      endTime: new Date(date.getTime() + 12 * 60 * 60 * 1000), // 12 PM
      status: i < 15 ? "ENDED" : i < 18 ? "SCHEDULED" : "LIVE",
      broadcastUrl: i >= 17 ? "https://example-stream.com/embed/basketball-qf" : null,
      thumbnail: i >= 17 ? "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop" : null,
      commentary: i >= 17 ? "Live commentary by UAI Sports Club" : null,
    });
  }

  for (const e of eventsData) {
    await prisma.event.upsert({
      where: { name_date: { name: e.name, date: e.date } },
      update: {
        sportId: e.sportId,
        category: e.category,
        venue: e.venue,
        startTime: e.startTime,
        endTime: e.endTime,
        status: e.status,
        broadcastUrl: e.broadcastUrl,
        thumbnail: e.thumbnail,
        commentary: e.commentary,
      },
      create: e,
    });
  }
  const allEvents = await prisma.event.findMany();
  console.log("Created 20 Events.");

  // 8. Create PointEntries
  await prisma.pointEntry.deleteMany({});

  const pointEntriesData = [];
  const harsh = allStudents.find(s => s.name === "Harsh Khamkar");
  const elena = allStudents.find(s => s.name === "Elena Rostova");
  const marcus = allStudents.find(s => s.name === "Marcus Vance");

  // Give Harsh 385 points across 6 events
  if (harsh) {
    for (let i = 0; i < 6; i++) {
      pointEntriesData.push({
        studentId: harsh.id,
        eventId: allEvents[i].id,
        points: i === 0 ? 85 : 60,
        position: i < 4 ? 1 : 2,
        enteredById: admin.id,
      });
    }
  }

  // Give Elena 360 points
  if (elena) {
    for (let i = 0; i < 5; i++) {
      pointEntriesData.push({
        studentId: elena.id,
        eventId: allEvents[i + 5].id,
        points: 72,
        position: 1,
        enteredById: admin.id,
      });
    }
  }

  // Random points for the rest
  for (let i = 0; i < 150; i++) {
    const student = allStudents[Math.floor(Math.random() * allStudents.length)];
    const event = allEvents[Math.floor(Math.random() * allEvents.length)];

    const exists = pointEntriesData.find(p => p.studentId === student.id && p.eventId === event.id);
    if (!exists && student.name !== "Harsh Khamkar" && student.name !== "Elena Rostova") {
      pointEntriesData.push({
        studentId: student.id,
        eventId: event.id,
        points: Math.floor(Math.random() * 50) + 10,
        position: Math.floor(Math.random() * 3) + 1,
        enteredById: admin.id,
      });
    }
  }

  await prisma.pointEntry.createMany({
    data: pointEntriesData,
  });
  console.log(`Created ${pointEntriesData.length} Point Entries.`);

  // 9. Create EventParticipants (first-class participation records)
  await prisma.eventParticipant.deleteMany({});

  const participantData: {
    studentId: string;
    eventId: string;
    status: string;
    placement: number | null;
    points: number;
    participationDate: Date;
  }[] = [];
  for (const event of allEvents) {
    // Each event has 8 participants
    const shuffled = [...allStudents].sort(() => 0.5 - Math.random());
    const participants = shuffled.slice(0, 8);

    participants.forEach((student, idx) => {
      const status = idx < 6 ? "PARTICIPATED" : idx === 6 ? "WITHDRAWN" : "ABSENT";
      const placement = idx < 3 ? idx + 1 : null;
      const points = placement === 1 ? 50 : placement === 2 ? 30 : placement === 3 ? 15 : 10;

      participantData.push({
        studentId: student.id,
        eventId: event.id,
        status,
        placement,
        points,
        participationDate: event.date,
      });
    });
  }

  await prisma.eventParticipant.createMany({
    data: participantData,
  });
  console.log(`Created ${participantData.length} Event Participants.`);

  // 10. Create Award Categories and Awards
  await prisma.awardCategory.deleteMany({});
  await prisma.award.deleteMany({});

  const awardCategories = [
    { name: "Sportsman of the Year", description: "Top male athlete of the season", gender: "MALE" },
    { name: "Sportswoman of the Year", description: "Top female athlete of the season", gender: "FEMALE" },
    { name: "Team of the Year", description: "Best performing team", gender: "MIXED" },
    { name: "School Championship", description: "Best overall school", gender: "MIXED" },
    { name: "Most Improved", description: "Most improved athlete", gender: "MIXED" },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of awardCategories) {
    const category = await prisma.awardCategory.create({ data: cat });
    createdCategories[cat.name] = category.id;
  }

  // Create awards
  if (harsh) {
    await prisma.award.create({
      data: {
        name: "Sportsman of the Year 2026-2027",
        description: "Season champion with 385 points across 6 events",
        year: 2025,
        awardCategoryId: createdCategories["Sportsman of the Year"],
        studentId: harsh.id,
        schoolId: harsh.schoolId,
        points: 385,
      },
    });
  }

  if (elena) {
    await prisma.award.create({
      data: {
        name: "Sportswoman of the Year 2026-2027",
        description: "Season champion with 360 points across 5 events",
        year: 2025,
        awardCategoryId: createdCategories["Sportswoman of the Year"],
        studentId: elena.id,
        schoolId: elena.schoolId,
        points: 360,
      },
    });
  }

  // School championship awards
  const schoolRankings = await getSchoolRankings();
  for (let i = 0; i < Math.min(3, schoolRankings.length); i++) {
    const school = schoolRankings[i];
    await prisma.award.create({
      data: {
        name: `${i === 0 ? "🏆 Champion" : i === 1 ? "🥈 Runner-Up" : "🥉 Third Place"} - ${school.name}`,
        description: `School Championship ${i === 0 ? "1st" : i === 1 ? "2nd" : "3rd"} Place`,
        year: 2025,
        awardCategoryId: createdCategories["School Championship"],
        schoolId: school.id,
        points: school.totalPoints,
      },
    });
  }

  console.log("Created Award Categories and Awards.");

  // 11. Create a Live Broadcast
  const liveEvent = allEvents.find(e => e.status === "LIVE");
  if (liveEvent) {
    await prisma.broadcast.upsert({
      where: { id: "broadcast-live-001" },
      update: {},
      create: {
        id: "broadcast-live-001",
        eventId: liveEvent.id,
        title: "INTER-COLLEGE BASKETBALL CHAMPIONSHIP",
        description: "Quarter Finals - Live from Main University Arena",
        streamUrl: "https://iframe.videodelivery.com/v/01h4jzj2ks0f0q2v7q3m4n5o6p",
        thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop",
        status: "LIVE",
        startedAt: new Date(),
        viewerCount: 0,
        chatEnabled: true,
        cheerEnabled: true,
        instagramGateEnabled: true,
      },
    });
    console.log("Created Live Broadcast.");
  }

  // 12. Create some sample cheers
  const liveBroadcast = await prisma.broadcast.findUnique({ where: { id: "broadcast-live-001" } });
  if (liveBroadcast) {
    const cheerTypes = ["CLAP", "FIRE", "GO", "CHAMPIONS", "SUPPORT"];
    for (let i = 0; i < 50; i++) {
      await prisma.cheer.create({
        data: {
          broadcastId: liveBroadcast.id,
          sessionId: `session-${Math.random().toString(36).substring(7)}`,
          type: cheerTypes[Math.floor(Math.random() * cheerTypes.length)],
        },
      });
    }
    console.log("Created 50 sample cheers.");
  }

  console.log("Database seed completed successfully.");
}

// Helper: get school rankings
async function getSchoolRankings() {
  const schools = await prisma.school.findMany({
    include: {
      students: {
        include: {
          pointEntries: true,
        },
      },
    },
  });

  return schools
    .map((school) => {
      const totalPoints = school.students.reduce(
        (sum, s) => sum + s.pointEntries.reduce((ps, pe) => ps + pe.points, 0),
        0
      );
      return {
        id: school.id,
        name: school.name,
        code: school.code,
        color: school.color,
        logoUrl: school.logoUrl,
        totalPoints: Math.round(totalPoints),
        athleteCount: school.students.length,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
