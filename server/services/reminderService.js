const User = require('../models/User');
const { sendEmail } = require('./emailService');
const { getUpcomingContests } = require('./contestService');

function formatDate(ms) {
  return new Date(ms).toLocaleString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
  }) + ' IST';
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}
function getPlatformName(platform) {
  switch (platform) {
    case 'leetcode':
      return 'LeetCode';
    case 'codeforces':
      return 'Codeforces';
    case 'codechef':
      return 'CodeChef';
    default:
      return platform;
  }
}

// @desc    Orchestrates the matching engine to check and send contest reminders
// @access  Internal Background Job
const processReminders = async () => {
  try {
    console.log('⏰ Starting contest reminder matching engine cycle...');

    // 1. Load users with email reminders enabled and at least one saved contest
    const users = await User.find({
      'reminderSettings.emailEnabled': true,
      'savedContests.0': { $exists: true }
    });

    if (users.length === 0) {
      console.log('No candidate users with active reminders.');
      return { success: true, count: 0 };
    }

    // 2. Fetch latest upcoming contests from the Contest Service
    const upcomingContests = await getUpcomingContests();

    if (upcomingContests.length === 0) {
      console.log('No upcoming contests found to match.');
      return { success: true, count: 0 };
    }

    // Faster contest lookup using Map
    const contestMap = new Map();

    for (const contest of upcomingContests) {
      contestMap.set(contest.id, contest);
    }

    let sentCount = 0;

    // 3. Match saved contests for each candidate user
    for (const user of users) {
      for (const savedContest of user.savedContests) {
        const contestId = savedContest.contestId;

        // 4. Find the contest details by contestId
        const contest = contestMap.get(contestId);
        if (!contest) continue; // Skip if contest is not in the upcoming schedule

        // 5. Check if the reminder has already been sent to this user
        const alreadySent = user.remindersSent?.find(
          reminder => reminder.contestId === contestId
        );

        if (alreadySent) {
          continue;
        }

        // 6. Compute minutes remaining until the contest starts
        const msRemaining = contest.startTime - Date.now();
        const minutesRemaining = msRemaining / (1000 * 60);

        // 7. Verify if the contest start time falls within the user's warning window
        // Checks if minutesRemaining is <= minutesBefore and > minutesBefore - 1
        const windowLimit = user.reminderSettings.minutesBefore;
        if (minutesRemaining <= windowLimit && minutesRemaining > windowLimit - 1) {

          // 8. Generate HTML email structure
          const subject = `🏆 CP Scheduler | ${contest.name} starts in ${Math.round(minutesRemaining)} minutes`;
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
              <h2 style="color: #4a90e2; margin-top: 0;">📅 Upcoming Contest Alert</h2>
              <p>Hello <strong>${user.fullName}</strong>,</p>
              <p>This is a scheduled reminder for your saved contest:</p>
              
              <div style="background-color: #f7f9fc; border-left: 4px solid #4a90e2; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #333;">${contest.name}</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 4px 0; color: #666; width: 100px;">Platform:</td>
                    <td style="padding: 4px 0; font-weight: bold; text-transform: capitalize;">${contest.platform}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #666;">Starts at:</td>
                    <td style="padding: 4px 0; font-weight: bold; color: #d0021b;">${formatDate(contest.startTime)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #666;">Duration:</td>
                    <td style="padding: 4px 0;">${formatDuration(contest.duration)}</td>
                  </tr>
                </table>
              </div>

              ${contest.url ? `
                <div style="text-align: center; margin: 25px 0;">
                  <a href="${contest.url}" target="_blank" style="background-color: #4a90e2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">
                    Register on ${getPlatformName(contest.platform)} →
                  </a>
                </div>
              ` : ''}

              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
                You are receiving this because you enabled email notifications for saved contests.
                You can manage your notification thresholds on your profile dashboard.
              </p>
            </div>
          `;

          // 9. Send email notification
          await sendEmail(user.email, subject, html);

          // 10. Append contestId to remindersSent to prevent duplicates
          await User.findByIdAndUpdate(
            user._id,
            {
              $addToSet: {
                remindersSent: {
                  contestId,
                  sentAt: new Date()
                }
              }
            }
          );

          // 11. Log success
          console.log(`
=========================================
📧 Reminder Sent Successfully

User      : ${user.email}
Contest   : ${contest.name}
Platform  : ${getPlatformName(contest.platform)}
Time Left : ${Math.round(minutesRemaining)} minutes
=========================================
`);
          sentCount++;
        }
      }
    }

    console.log(`✅ Reminder matching engine cycle completed. Sent: ${sentCount} emails.`);
    return { success: true, count: sentCount };

  } catch (error) {
    console.error('❌ Error inside reminder matching engine:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  processReminders
};
