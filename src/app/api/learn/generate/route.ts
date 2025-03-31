import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerateRequest } from '@/types/api';

// Helper function to validate the API key
const validateApiKey = (apiKey: string): boolean => {
    return apiKey.startsWith('AI') && apiKey.length > 20;
};

// Helper function to get API key
const getApiKey = (customApiKey?: string): string => {
    const defaultKey = process.env.GEMINI_API_KEY;
    if (customApiKey && validateApiKey(customApiKey)) {
        return customApiKey;
    }
    if (!defaultKey) {
        throw new Error('No valid API key provided');
    }
    return defaultKey;
};

export async function POST(request: Request) {
    try {
        // Parse the request body
        const body = await request.json() as GenerateRequest;
        const { prompt, customApiKey } = body;

        if (!prompt) {
            return NextResponse.json(
                { success: false, error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Use custom API key if provided, otherwise use the one from environment variables
        let apiKey: string;
        try {
            apiKey = getApiKey(customApiKey);
        } catch (error) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'No API key available. Please provide a valid Gemini API key.' 
                },
                { status: 400 }
            );
        }

        console.log("API key obtained, initializing Gemini API...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp-image-generation",
            generationConfig: {
                responseModalities: ['Text', 'Image']
            },
        });



// console.log('Steps map:', stepsMap);

const result = {
    success: true,
    message: '',
    steps: []
  };

// for (let key = 0; key < stepsMap.size; key++) {
  
//     if(!stepsMap.get(key.toString())) {
//         break;
//     }

//     let generationContent;
    
//     if(key > 0 && stepsMap.get(key-1).imageData) {

//         const imagePart = {
//             inlineData: {
//               data: stepsMap.get(key-1).imageData,
//               mimeType: "image/png"
//             }
//           };

//         generationContent = [
//             imagePart,
//             {text:  stepsMap.get(key.toString()).text + " Maintain a 960x540 canvas size (16:9 aspect ratio) with the same minimal line doodle style. Use clean, bold strokes suitable for a children's drawing."}
//         ];
//     } else {
//         generationContent = stepsMap.get(key.toString()).text + "Create a simple black and white sketch sized for a 960x540 canvas (16:9 aspect ratio). Use thick, bold lines like a drawing made with a heavy marker. Ensure solid, well-defined strokes with no color, blurring, or shading - just clean, prominent black outlines on white background.";
//     }


//     // console.log('Generation content:', generationContent);  
//     console.log("Calling Gemini API...");
//     const response = await model.generateContent(generationContent);
//     console.log("Gemini API response received", response.response.candidates?.length);
    
//     for (const part of response.response.candidates[0].content.parts) {
//         // Based on the part type, either get the text or image data
//         if (part.text) {
//           result.message = part.text;
//           console.log("Received text response:", part.text);
//         } else if (part.inlineData) {
//           const imageData = part.inlineData.data;
//           console.log('Step : ', key, "Received image data, length:", imageData.length);
         
//           stepsMap.set(key, {
//             text: stepsMap.get(key.toString()).text,
//             imageData: imageData
//           });
//           // Include the base64 data in the response
//           result.steps.push({image: imageData});
//         }
//       } 

// }
    

let generationContent = [{
    text: `
---


### **Algorithm: Sketching an Idea in Hand-Drawn Style**  

### **Input:** ${prompt}


### Details
The drawing style is raw, sketchy, and full of energy—like an amateur pencil sketch with loose strokes and imperfections that make it feel lively. Instead of aiming for clean, polished lines, the focus is on:

✅ Rough & Messy Lines – Let extra strokes stay, no erasing needed.  
✅ Expressive & Imperfect – Wobbly lines, uneven shapes, and exaggerated features add charm.  
✅ Hand-Drawn Feel – Looks like a quick pencil doodle, not a digital vector illustration.  
✅ Motion & Energy – Wiggly lines around limbs show movement and action.  
✅ Minimal Detailing – No rigid perfection, just enough to tell the story.  
✅ No Solid Black Fills – Shading is done with hatching (short pencil strokes) instead of smooth gradients.  

Think of it like a kid’s playful sketchbook doodle—imperfect but full of personality! ✏️🎨  

**Goal:** Create one drawing that **progresses through 5 steps**, with each step building on the previous one. Each image should show the drawing **evolving from rough outlines to a complete, expressive sketch**.

---

### **Step 1: Rough Outline with Loose Strokes**  
- **Start Light & Messy:** Use soft, rough strokes to sketch basic shapes (**circles, ovals, rectangles**)—don’t aim for precision!  
- **No Erasing Yet:** Let extra lines stay; they add charm and personality.  
- **Stay Loose:** Let your pencil **flow freely**, avoiding rigid symmetry.  
- **Generate 1 image** showing the initial rough outline with basic shapes.  

---

### **Step 2: Build Up the Character’s Form**  
- **Darken Key Lines:** Trace over important shapes to create a more defined body.  
- **Keep It Sketchy:** Leave some extra strokes near the edges—this makes the drawing feel alive.  
- **Avoid Over-Detailing:** Focus on the character's form and pose rather than tiny details.  
- **Generate 1 image** showing the transition from rough shapes to a more solid figure.  

---

### **Step 3: Expressive Details with Light & Dark Strokes**  
- **Bold Features First:** Use darker strokes for key expressions (eyes, mouth, hands).  
- **Simple Hands & Feet:** No need for perfect fingers or toes—rough, quick strokes work!  
- **Imperfections = Personality:** A crooked smile, uneven eyes, or wobbly lines make it **more expressive and fun**.  
- **Generate 1 image** showing the character with bold features and expressive details.  

---

### **Step 4: Texture & Motion Using Loose Lines**  
- **Shading with Pencil Strokes:** Use **hatching (quick short lines)** instead of smooth shading for a natural sketch look.  
- **Movement Lines:** Add tiny wiggly lines near arms, legs, or tails to suggest action.  
- **Messy Strokes = Energy!** Keep the sense of movement and rawness intact.  
- **Generate 1 image** showing texture, shading, and motion effects.  

---

### **Step 5: Final Touch – Keep It Raw & Simple**  
- **No Solid Black Fills:** Use only pencil strokes; let the **white space breathe**.  
- **Avoid Over-Refining:** Stop before it looks too polished—the sketchy look is key!  
- **Ground Line (Optional):** A few quick, uneven marks can help ground the drawing.  
- **Generate 1 image** showing the final drawing with raw, hand-drawn style intact, and optional ground line.  

---

💡 **Tip:** If it looks **too clean**, add a few extra rough lines! The beauty of a **hand-drawn sketch** is in its imperfections.  

🎨 **Done!** Now, your idea has come to life in a raw, expressive, pencil-stroked sketch! 🚀

---

    
    `.replaceAll('subject', prompt)
}];



console.log("Calling Gemini API...");
console.log('generationContent',generationContent);

const response = await model.generateContentStream(generationContent, {
    generationConfig: {
        maxOutputTokens: 5000, // Set the max token size here
    }
});
console.log("Gemini API response received");

// TODO: This is the old way of getting the response
for await (const chunk of response.stream) {
    // Check if chunk and its properties are defined before accessing them
    if (chunk?.candidates?.[0]?.content?.parts?.[0]) {
        console.log('chunk text', chunk.candidates[0].content.parts[0].text);
        console.log('chunk inlineData length', chunk.candidates[0].content.parts[0].inlineData?.data.length);
        // console.log('chunk parts', chunk.candidates[0].content.parts[0]);

        if (chunk.candidates[0].content.parts[0].inlineData?.data) {
            result.steps.push({ image: chunk.candidates[0].content.parts[0].inlineData.data, instruction: chunk.candidates[0].content.parts[0].text});
        }
    } else {
        console.log('Received chunk is missing expected properties:', chunk);
    }
}
console.log('result',result);
     

// console.log('usageMetadata : ',response.response.usageMetadata);


// // Process response parts
// for (const part of response.response.candidates[0].content.parts) {
//     // Based on the part type, either get the text or image data
//     if (part.text) {
//       result.message = part.text;
//       console.log("Received text response:", part.text);
//     } else if (part.inlineData) {
//       const imageData = part.inlineData.data;
//       console.log("Received image data, length:", imageData.length);
      
//       // Include the base64 data in the response
//       result.steps.push({image: imageData});
//     }
//   }


// let currentStep = 1;
// let currentImageData = [];
// let accumulatedText = "";

// for await (const chunk of response.stream) {
//     if (chunk?.candidates?.[0]?.content?.parts) {
//         for (const part of chunk.candidates?.[0]?.content?.parts) {
//             if (part?.inlineData?.data) {
//                 currentImageData.push(part.inlineData.data);
//             }
//             if (part?.text) {
//                 console.log('part.text',part.text);
//                 accumulatedText += part.text;
//                 const nextStepLabel = `Step ${currentStep + 1}:`;
//                 if (accumulatedText.includes(nextStepLabel) || currentStep === 8) {
//                     // We've likely reached the end of the current step's content
//                     if (currentImageData.length > 0) {
//                         result.steps.push({ image: currentImageData.join(''), instruction: accumulatedText }); // Join the chunks
//                         currentImageData = [];
//                     }
//                     currentStep++;
//                     accumulatedText = ""; // Reset text for the next step
//                 }
//             }
//         }
//     } else {
//         console.log('Received chunk is missing expected properties:', chunk);
//     }
// }

console.log('Final Result:', result);
    
    return NextResponse.json(result);

    } catch (error) {
        console.error('Error generating learning steps:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'An unexpected error occurred' 
            },
            { status: 500 }
        );
    }
} 