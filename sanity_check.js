/**
 * VOXFLOW NEURAL SANITY CHECK
 * Verifies Production Environment Integrity
 */

const requiredVars = [
    { name: 'NEXT_PUBLIC_API_URL', prefix: 'http' },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', prefix: 'http' },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', minLength: 20 },
    { name: 'NEXTAUTH_SECRET', minLength: 10 },
];

const checkEnv = () => {
    console.log("\n🚀 INITIALIZING NEURAL SANITY CHECK...\n");
    let failures = 0;

    requiredVars.forEach(v => {
        const val = process.env[v.name];
        if (!val) {
            console.error(`❌ FAILURE: ${v.name} is missing.`);
            failures++;
        } else if (v.prefix && !val.startsWith(v.prefix)) {
            console.error(`❌ FAILURE: ${v.name} must start with "${v.prefix}".`);
            failures++;
        } else if (v.minLength && val.length < v.minLength) {
            console.error(`❌ FAILURE: ${v.name} is too short (min ${v.minLength} chars).`);
            failures++;
        } else {
            console.log(`✅ SUCCESS: ${v.name} is valid.`);
        }
    });

    if (failures === 0) {
        console.log("\n✨ SYSTEM INTEGRITY: 100% OPERATIONAL. READY FOR LAUNCH.\n");
    } else {
        console.log(`\n⚠️ CRITICAL: ${failures} errors detected. Fix before deployment.\n`);
        process.exit(1);
    }
};

checkEnv();
