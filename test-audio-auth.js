const fetch = require('node-fetch');

async function testAudioAuth() {
  console.log('🔍 Testing audio API authentication...');
  
  try {
    const response = await fetch('http://localhost:3000/api/story/narrate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyText: 'Once upon a time, there was a brave little dragon.',
        voiceName: 'Kore'
      }),
    });

    const data = await response.json();
    console.log('Response:', {
      status: response.status,
      success: data.success,
      cached: data.cached,
      hasAudioUrl: !!data.audioUrl,
      hasAudioData: !!data.audioData,
      message: data.message,
      error: data.error
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAudioAuth(); 