/**
 * Verifies that all required environment variables are set.
 * Exits the process early if any vital variable is missing.
 */
module.exports = () => {
  const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
  const missingEnv = [];

  requiredEnv.forEach((env) => {
    if (!process.env[env]) {
      missingEnv.push(env);
    }
  });

  if (missingEnv.length > 0) {
    console.error('❌ CRITICAL ERROR: Missing vital environment variables:');
    missingEnv.forEach((env) => {
      console.error(`   - ${env}`);
    });
    console.error('Please configure them in your .env file.');
    process.exit(1);
  }

  console.log('✅ Environment configuration validated successfully.');
};
