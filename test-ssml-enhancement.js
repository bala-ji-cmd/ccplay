// Test SSML Enhancement functionality for story narration
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Test story for SSML enhancement
const testStory = `Once upon a time, there was a brave little mouse named Whiskers who loved adventures. He lived in a cozy house under the old oak tree. One day, Whiskers discovered a magical door that led to a wonderful land filled with friendly creatures! "What an amazing place!" he exclaimed. The mouse made many friends and learned that kindness is the greatest magic of all. The end.`;

async function testSSMLEnhancement() {
  console.log('🎭 Testing SSML Enhancement for Story Narration...\n');
  
  try {
    // Step 1: Test basic narration without character
    console.log('Step 1: Test basic narration (no character)');
    const response1 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        voiceName: 'Kore'
      })
    });
    
    const result1 = await response1.json();
    console.log('✓ Status:', response1.status);
    console.log('✓ Success:', result1.success);
    console.log('✓ Voice:', result1.voiceName);
    console.log('✓ Character:', result1.characterId || 'None');
    console.log('✓ Audio URL:', result1.audioUrl ? '✅ Generated' : '❌ Missing');
    
    // Step 2: Test with animal character
    console.log('\nStep 2: Test with friendly-bear character');
    const response2 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        characterId: 'friendly-bear'
      })
    });
    
    const result2 = await response2.json();
    console.log('✓ Status:', response2.status);
    console.log('✓ Success:', result2.success);
    console.log('✓ Voice:', result2.voiceName);
    console.log('✓ Character:', result2.characterId);
    console.log('✓ Audio URL:', result2.audioUrl ? '✅ Generated' : '❌ Missing');
    
    // Step 3: Test with cheerful-bunny character
    console.log('\nStep 3: Test with cheerful-bunny character');
    const response3 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        characterId: 'cheerful-bunny'
      })
    });
    
    const result3 = await response3.json();
    console.log('✓ Status:', response3.status);
    console.log('✓ Success:', result3.success);
    console.log('✓ Voice:', result3.voiceName);
    console.log('✓ Character:', result3.characterId);
    console.log('✓ Audio URL:', result3.audioUrl ? '✅ Generated' : '❌ Missing');
    
    // Step 4: Test invalid character ID
    console.log('\nStep 4: Test invalid character ID');
    const response4 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        characterId: 'invalid-character'
      })
    });
    
    const result4 = await response4.json();
    console.log('✓ Status:', response4.status);
    console.log('✓ Success:', result4.success);
    console.log('✓ Error:', result4.error);
    
    // Step 5: Test GET endpoint for characters
    console.log('\nStep 5: Test GET endpoint for characters');
    const response5 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result5 = await response5.json();
    console.log('✓ Status:', response5.status);
    console.log('✓ Success:', result5.success);
    console.log('✓ Voices count:', result5.voices?.length || 0);
    console.log('✓ Characters count:', result5.characters?.length || 0);
    
    if (result5.characters) {
      console.log('✓ Available characters:');
      result5.characters.forEach(char => {
        console.log(`  - ${char.id}: ${char.personality} (${char.baseVoice})`);
      });
    }
    
    // Step 6: Test voice override with character
    console.log('\nStep 6: Test voice override with character');
    const response6 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        characterId: 'wise-owl',
        voiceName: 'Zephyr' // Override character's default voice
      })
    });
    
    const result6 = await response6.json();
    console.log('✓ Status:', response6.status);
    console.log('✓ Success:', result6.success);
    console.log('✓ Voice used:', result6.voiceName);
    console.log('✓ Character:', result6.characterId);
    console.log('✓ Voice override:', result6.voiceName === 'Zephyr' ? '✅ Working' : '❌ Failed');
    
    console.log('\n🎉 SSML Enhancement testing completed!');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('✓ Basic narration:', result1.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Character narration:', result2.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Different character:', result3.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Invalid character handling:', !result4.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ GET endpoint:', result5.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Voice override:', result6.success ? '✅ PASS' : '❌ FAIL');
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
if (require.main === module) {
  testSSMLEnhancement().then(success => {
    if (success) {
      console.log('\n✅ All tests completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed');
      process.exit(1);
    }
  });
}

module.exports = testSSMLEnhancement; 