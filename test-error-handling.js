// Test Error Handling and Fallback mechanisms for story narration
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Test story for error handling
const testStory = `Once upon a time, there was a brave little mouse named Whiskers.`;

async function testErrorHandling() {
  console.log('🛡️ Testing Error Handling and Fallback Mechanisms...\n');
  
  try {
    // Step 1: Test with valid request (should work)
    console.log('Step 1: Test normal operation');
    const response1 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        characterId: 'friendly-bear'
      })
    });
    
    const result1 = await response1.json();
    console.log('✓ Status:', response1.status);
    console.log('✓ Success:', result1.success);
    console.log('✓ Voice used:', result1.voiceName);
    console.log('✓ Original voice:', result1.originalVoice || 'Same as used');
    console.log('✓ Has fallback message:', result1.message?.includes('fallback') || false);
    
    // Step 2: Test with invalid API key (should fail gracefully)
    console.log('\nStep 2: Test with invalid API key');
    const response2 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        characterId: 'friendly-bear',
        customApiKey: 'invalid-key-12345'
      })
    });
    
    const result2 = await response2.json();
    console.log('✓ Status:', response2.status);
    console.log('✓ Success:', result2.success);
    console.log('✓ Error message:', result2.error);
    console.log('✓ Is retryable:', result2.retryable);
    console.log('✓ User-friendly message:', !result2.error?.includes('API') || false);
    
    // Step 3: Test with invalid character ID (should fail with validation)
    console.log('\nStep 3: Test with invalid character ID');
    const response3 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        characterId: 'invalid-character-xyz'
      })
    });
    
    const result3 = await response3.json();
    console.log('✓ Status:', response3.status);
    console.log('✓ Success:', result3.success);
    console.log('✓ Error message:', result3.error);
    console.log('✓ Contains available characters:', result3.error?.includes('Available characters') || false);
    
    // Step 4: Test with invalid voice name (should fail with validation)
    console.log('\nStep 4: Test with invalid voice name');
    const response4 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        voiceName: 'invalid-voice-xyz'
      })
    });
    
    const result4 = await response4.json();
    console.log('✓ Status:', response4.status);
    console.log('✓ Success:', result4.success);
    console.log('✓ Error message:', result4.error);
    console.log('✓ Contains available voices:', result4.error?.includes('Available voices') || false);
    
    // Step 5: Test with empty story text (should fail with validation)
    console.log('\nStep 5: Test with empty story text');
    const response5 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: '',
        characterId: 'friendly-bear'
      })
    });
    
    const result5 = await response5.json();
    console.log('✓ Status:', response5.status);
    console.log('✓ Success:', result5.success);
    console.log('✓ Error message:', result5.error);
    console.log('✓ Validation error:', result5.error?.includes('required') || false);
    
    // Step 6: Test with malformed JSON (should fail gracefully)
    console.log('\nStep 6: Test with malformed JSON');
    const response6 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid json syntax'
    });
    
    const result6 = await response6.json();
    console.log('✓ Status:', response6.status);
    console.log('✓ Success:', result6.success);
    console.log('✓ Error message:', result6.error);
    console.log('✓ Handled gracefully:', response6.status >= 400 && response6.status < 500);
    
    // Step 7: Test fallback voice mechanism by trying different characters
    console.log('\nStep 7: Test fallback voice mechanism');
    const characters = ['friendly-bear', 'cheerful-bunny', 'wise-owl'];
    
    for (const char of characters) {
      const response = await fetch(`${BASE_URL}/api/story/narrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyText: `Test story for ${char}`,
          characterId: char
        })
      });
      
      const result = await response.json();
      console.log(`✓ Character ${char}: Status ${response.status}, Voice: ${result.voiceName || 'N/A'}`);
    }
    
    // Step 8: Test GET endpoint error handling
    console.log('\nStep 8: Test GET endpoint');
    const response8 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result8 = await response8.json();
    console.log('✓ GET Status:', response8.status);
    console.log('✓ GET Success:', result8.success);
    console.log('✓ Voices available:', result8.voices?.length || 0);
    console.log('✓ Characters available:', result8.characters?.length || 0);
    
    console.log('\n🎉 Error Handling testing completed!');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('✓ Normal operation:', result1.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Invalid API key handling:', !result2.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Invalid character validation:', !result3.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Invalid voice validation:', !result4.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Empty text validation:', !result5.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Malformed JSON handling:', !result6.success ? '✅ PASS' : '❌ FAIL');
    console.log('✓ GET endpoint:', result8.success ? '✅ PASS' : '❌ FAIL');
    
    // Error message quality check
    console.log('\n📝 Error Message Quality:');
    console.log('✓ User-friendly messages:', [result2, result3, result4, result5, result6].every(r => 
      r.error && !r.error.includes('undefined') && !r.error.includes('null')
    ) ? '✅ PASS' : '❌ FAIL');
    
    console.log('✓ Specific error guidance:', [result3, result4, result5].every(r => 
      r.error && (r.error.includes('Available') || r.error.includes('required'))
    ) ? '✅ PASS' : '❌ FAIL');
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
if (require.main === module) {
  testErrorHandling().then(success => {
    if (success) {
      console.log('\n✅ All error handling tests completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Some error handling tests failed');
      process.exit(1);
    }
  });
}

module.exports = testErrorHandling; 