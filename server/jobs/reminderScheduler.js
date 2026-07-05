const cron = require('node-cron');
const { processReminders } = require('../services/reminderService');

// 1. Log initialization status when the scheduler module is loaded
console.log('⏰ Reminder Scheduler Started');

// 2. Schedule the background task execution to trigger once every minute
cron.schedule('* * * * *', async () => {
  try {
    console.log('Checking reminders...');
    
    // 3. Execute the reminder matching engine logic
    await processReminders();
  } catch (error) {
    console.error('❌ Exception in background reminder scheduler:', error.message);
  }
});
