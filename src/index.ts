import { Prisma, PrismaClient, SubmissionStatus } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { log } from 'console';
import { randomUUID } from 'crypto';
import express from 'express'
const cors = require('cors');


const prisma = new PrismaClient().$extends(withAccelerate())

const app = express()
// Enable CORS for all routes
app.use(cors({
  origin: [
    'http://localhost:3000',  // React default
    'http://localhost:3001',  // Create React App
    'http://localhost:5173',  // Vite default
    'http://localhost:8080',  // Vue CLI default
    // Add your client's port here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//     'http://localhost:5173',
//     'https://yourdomain.com'
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.get(`/user`, async (req, res) => {
  const  email =  req.query.mail as string | undefined;
  const  branchId =  req.query.branchId as string | undefined;
 console.log('ok1')
  console.log(email);
  if(!!email){
    res.json(await prisma.user.findMany({

      }));
  }else{
    console.log('ok2')
    res.json(await prisma.user.findMany({
      where:         {branchId}    

  }));
  }
})

app.post(`/user`, async (req, res) => {
  const  user =  req.body
  console.log(user);
   await prisma.user.create({data:user});
  try{
      //await prisma.user.create({data:user});
  }catch
  {

  }
  
  res.json()
})

//------------------

app.get(`/franchises`, async (req, res) => {
  var x=  await prisma.franchise.findMany({include:{branches:{include: {settings: {include:{shiftTemplates:true}}}}}});
  res.status(200).json(x);
})
app.post(`/franchises`, async (req, res) => {
  const  franchise =  req.body
  delete franchise.branches;
  console.log(franchise);
  await prisma.franchise.create({data:franchise});
  res.json()
})
//-------------
//------------------
app.get(`/branches`, async (req, res) => {
    const  branchId =  req.query.branchId as string | undefined;
    var x = undefined;
    if(!!branchId)
    {
       x =  await prisma.branch.findFirst({ 
        where:{
          id:branchId
       },
       include:{
        settings: {include:{shiftTemplates:true}},

        
      }});
    }
    else{
      x =  await prisma.branch.findMany({ include:{
        settings: {include:{shiftTemplates:true}},

        
      }});
    }

  res.status(200).json(x);
})


app.post(`/branches`, async (req, res) => {
  const  branch =  req.body
  branch.settings.shiftTemplates = {create : branch.settings.shiftTemplates}
  branch.settings = {create : branch.settings}
  branch.settings.schedulingPreferences = {create : branch.settings.schedulingPreferences}
  
  console.log(branch);
  await prisma.branch.create({data:branch});
  res.json()
})
//-------------

app.get(`/availabilitySubmissions`, async (req, res) => {
  const  managerId =  req.query.id as string | undefined;
  var availabilitySubmissions=  await prisma.workerAvailabilitySubmission.findMany({
    where:{
      managerId
    }
  });
  res.status(200).json(availabilitySubmissions);
})

app.get(`/availabilitySubmissionscount`, async (req, res) => {
  const  managerId =  req.query.managerId as string | undefined;
  const  status =  req.query.status as SubmissionStatus | undefined;
  var count=  await prisma.workerAvailabilitySubmission.count({
    where:{
      managerId,
      status 
    }
  });
  res.status(200).json(count);
})

app.post(`/availabilitySubmissions`, async (req, res) => {
  
  const  availability =  req.body
  var timeInMillis = Date.parse(availability.weekStartDate);
    console.log(availability);
    availability.weekStartDate = new Date(availability.weekStartDate);
    //availability.status = availability.status.toUpperCase();
  await prisma.workerAvailabilitySubmission.create({data:availability});
  res.json()
})

app.put(`/availabilitySubmissions`, async (req, res) => {
  const submissionId =   req.query.submissionId as string | undefined;
  const status = req.query.status as SubmissionStatus;
 console.log(submissionId + ' '+ status)
 await prisma.workerAvailabilitySubmission.update({
  where: {
    id: submissionId,
  },
  data: {
    status: status,
  },
});
  res.json()
})
//-------------------

app.post(`/schedule`, async (req, res) => {
  
  const  schedule =  req.body
   var timeInMillis = Date.parse(schedule.weekStartDate);
  schedule.weekStartDate = new Date(schedule.weekStartDate);
  schedule.shifts.forEach((x: any) => {
    x.date  = new Date(x.date);
  });
  //todo
  //schedule.branchId = 'Test Branch';
  schedule.shifts = {create : schedule.shifts}
  console.log(schedule);
  //   //availability.status = availability.status.toUpperCase();
  await prisma.schedule.create({data:schedule});
  res.json()
})


app.delete(`/schedules`, async (req, res) => {
  const scheduleId =   req.query.scheduleId as string | undefined;
  console.log('delete schedule ' + scheduleId);
  var x=  await prisma.schedule.delete({
    where: {
      id:scheduleId
    }});
  res.status(200).json();
})

app.get(`/schedules`, async (req, res) => {
  const branchId =   req.query.submissionId as string | undefined;
  console.log('xxx');
  var x=  await prisma.schedule.findMany({
    where: {
      branchId
    },
     include:{
    shifts: true
  }});
  res.status(200).json(x);
})
//-------------------

app.post(`/shifttemplate`, async (req, res) => {
  
  const  shiftTemplate =  req.body
    delete shiftTemplate.jobTitleRequirements;
    //availability.weekStartDate = new Date(availability.weekStartDate);
    //availability.status = availability.status.toUpperCase();
  await prisma.shiftTemplate.create({data:shiftTemplate});
  res.json()
})

app.delete(`/shifttemplate`, async (req, res) => {
   const id =   req.query.id as string | undefined;
   console.log(id);
   await prisma.shiftTemplate.delete({
  where: {
    id: id,
  }});
    res.status(200).json();
})

app.put(`/shifttemplate`, async (req, res) => {
  
  const  shiftTemplate =  req.body
   const id =   req.query.id as string | undefined;
  //var timeInMillis = Date.parse(availability.weekStartDate);
    console.log(shiftTemplate);
    //todo
    delete shiftTemplate.jobTitleRequirements;
    //availability.weekStartDate = new Date(availability.weekStartDate);
    //availability.status = availability.status.toUpperCase();
  await prisma.shiftTemplate.update({
  where: {
    id: id,
  },
  data: {
    name : shiftTemplate.name,
    startTime : shiftTemplate.startTime,
     endTime : shiftTemplate.endTime,
      requiredWorkers : shiftTemplate.requiredWorkers,
       priority : shiftTemplate.priority,
        days : shiftTemplate.days,
  }});
  res.json()
})
//-----------------------------
const dayNameToNumber: { [key: string]: number } = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6
};

app.put(`/settings`, async (req, res) => {
  const  setting =  req.body
  const id =   req.query.id as string | undefined;
  const branchId =   req.query.branchId as string | undefined;
  const dayName = setting.weekStartDay
 console.log(id + ' '+ setting.weekStartDay)



// Convert day name to number
const targetDayNum = dayNameToNumber[dayName.toLowerCase()];

if (targetDayNum === undefined) {
  throw new Error(`Invalid day name: ${dayName}`);
}
 await prisma.branchSettings.update({
  where: {
    id: id,
  },
  data: {
    openingHours: setting.openingHours,
    weekStartDay: setting.weekStartDay
  },
});

await prisma.$executeRaw`
  UPDATE "Schedule"
   SET "weekStartDate" = "weekStartDate"::date - EXTRACT(DOW FROM "weekStartDate")::integer + ${targetDayNum}::integer
  WHERE "branchId" = ${branchId}
`;


  res.json()
})
//-----------------------------

app.get(`/schedulingPreferences`, async (req, res) => {
  const  settingsId =  req.query.settingsId as string | undefined;
  var schedulingPreference=  await prisma.schedulingPreference.findFirst({
    where:{
      settingsId
    }
  });
  res.status(200).json(schedulingPreference);
})
app.put(`/schedulingPreferences`, async (req, res) => {
  const  schedulingPreference =  req.body
  const id =   req.query.id as string | undefined;
 console.log(id + ' '+ schedulingPreference)
 try{
  await prisma.schedulingPreference.update({
    where: {
      id: id,
    },
    data: {
      maxHoursPerWeek: schedulingPreference.maxHoursPerWeek,
      maxConsecutiveDays: schedulingPreference.maxConsecutiveDays,
      minRestHours: schedulingPreference.minRestHours,
      allowOvertime: schedulingPreference.allowOvertime,
      preferExperiencedWorkers: schedulingPreference.preferExperiencedWorkers,
      balanceWorkload: schedulingPreference.balanceWorkload,
      prioritizeSkillMatch: schedulingPreference.prioritizeSkillMatch,
      sendScheduleNotifications: schedulingPreference.sendScheduleNotifications,
    },
  });
 }catch{
      schedulingPreference.id = randomUUID();
      await prisma.schedulingPreference.create({data:schedulingPreference})
 }

  res.json()
})
const server = app.listen(8080, () =>
  console.log(`
🚀 Server ready at: http://localhost:8080
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
)
