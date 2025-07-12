// Validate audio caching functionality after bucket creation
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Test story for consistent hashing
const testStory = `Once upon a time, there was a brave little mouse named Whiskers who loved adventures.`;

async function validateAudioCaching() {
  console.log('🔍 Validating TTS Audio Caching...\n');
  
  try {
    // Step 1: Test first narration (should generate and cache)
    console.log('Step 1: Generate and cache audio');
    const start1 = Date.now();
    const response1 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        voiceName: 'Kore'
      })
    });
    
    const result1 = await response1.json();
    const duration1 = Date.now() - start1;
    
    console.log('✓ Status:', response1.status);
    console.log('✓ Success:', result1.success);
    console.log('✓ Cached:', result1.cached);
    console.log('✓ Duration:', duration1 + 'ms');
    console.log('✓ Audio URL:', result1.audioUrl ? '✅ Generated' : '❌ Missing');
    console.log('✓ Message:', result1.message);
    
    if (!result1.success) {
      console.error('❌ First generation failed:', result1.error);
      return false;
    }
    
    // Step 2: Test cache hit (should be much faster)
    console.log('\nStep 2: Test cache retrieval');
    const start2 = Date.now();
    const response2 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        voiceName: 'Kore'
      })
    });
    
    const result2 = await response2.json();
    const duration2 = Date.now() - start2;
    
    console.log('✓ Status:', response2.status);
    console.log('✓ Success:', result2.success);
    console.log('✓ Cached:', result2.cached);
    console.log('✓ Duration:', duration2 + 'ms');
    console.log('✓ Audio URL:', result2.audioUrl ? '✅ Retrieved' : '❌ Missing');
    console.log('✓ Message:', result2.message);
    
    // Step 3: Performance analysis
    console.log('\nStep 3: Performance Analysis');
    const speedImprovement = Math.round(((duration1 - duration2) / duration1) * 100);
    console.log('✓ Speed improvement:', speedImprovement + '%');
    console.log('✓ Cache working:', result2.cached ? '✅ YES' : '❌ NO');
    
    // Step 4: Test different voice (should generate new)
    console.log('\nStep 4: Test different voice');
    const start3 = Date.now();
    const response3 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        voiceName: 'Puck'
      })
    });
    
    const result3 = await response3.json();
    const duration3 = Date.now() - start3;
    
    console.log('✓ Status:', response3.status);
    console.log('✓ Success:', result3.success);
    console.log('✓ Cached:', result3.cached, '(should be false)');
    console.log('✓ Duration:', duration3 + 'ms');
    console.log('✓ Audio URL:', result3.audioUrl ? '✅ Generated' : '❌ Missing');
    
    // Step 5: Test second voice cache
    console.log('\nStep 5: Test second voice cache');
    const start4 = Date.now();
    const response4 = await fetch(`${BASE_URL}/api/story/narrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyText: testStory,
        voiceName: 'Puck'
      })
    });
    
    const result4 = await response4.json();
    const duration4 = Date.now() - start4;
    
    console.log('✓ Status:', response4.status);
    console.log('✓ Success:', result4.success);
    console.log('✓ Cached:', result4.cached, '(should be true)');
    console.log('✓ Duration:', duration4 + 'ms');
    console.log('✓ Audio URL:', result4.audioUrl ? '✅ Retrieved' : '❌ Missing');
    
    // Final validation
    console.log('\n🎯 Final Validation:');
    const validationResults = {
      audioGeneration: result1.success && result1.audioUrl,
      cacheStorage: result2.cached,
      cacheRetrieval: result2.success && result2.audioUrl,
      differentVoices: result3.success && !result3.cached,
      voiceCaching: result4.success && result4.cached,
      performanceGain: speedImprovement > 50
    };
    
    console.log('✅ Audio Generation:', validationResults.audioGeneration ? 'PASS' : 'FAIL');
    console.log('✅ Cache Storage:', validationResults.cacheStorage ? 'PASS' : 'FAIL');
    console.log('✅ Cache Retrieval:', validationResults.cacheRetrieval ? 'PASS' : 'FAIL');
    console.log('✅ Different Voices:', validationResults.differentVoices ? 'PASS' : 'FAIL');
    console.log('✅ Voice Caching:', validationResults.voiceCaching ? 'PASS' : 'FAIL');
    console.log('✅ Performance Gain:', validationResults.performanceGain ? 'PASS' : 'FAIL');
    
    const allPassed = Object.values(validationResults).every(result => result === true);
    console.log('\n🚀 Overall Status:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    
    return allPassed;
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    return false;
  }
}

// Run validation
validateAudioCaching().then(success => {
  if (success) {
    console.log('\n🎉 TTS Audio Caching is working perfectly!');
  } else {
    console.log('\n⚠️  TTS Audio Caching needs attention.');
  }
}); 