// Modularized learning prompt templates for server-only use

export function getLearningSeriesPrompt(thingToDraw: string) {
  return [{
    text: `
---

**Generate a step-by-step drawing guide for a kid to learn how to draw "${thingToDraw}" in EXACTLY 6 simple steps.**  

**IMPORTANT: You must generate exactly 6 images - one for each step. Do not skip any steps.**

- Each step should be **easy to follow** and progressively build the final drawing.  
- Use **bold stroke lines (heavy marker style)** for clarity.  
- Keep the **resolution high (1920x1080 Full HD)**  16:9 aspect ratio to maintain quality.  
- **Do not add any annotations, text, or labels to the images**—they should be purely visual.  
- **Generate exactly 6 images total** - no more, no less.

### **Breakdown of Each Step (Generate 1 image per step):**  
1️⃣ **Start with the simplest shape** – Begin with **basic circles, squares, or lines** to outline the structure.  
2️⃣ **Add more structure** – Introduce additional **simple shapes** to develop the main form.  
3️⃣ **Define key features** – Outline **recognizable features** while keeping it minimal.  
4️⃣ **Refine the details** – Enhance proportions slightly, but **keep it simple**.  
5️⃣ **Final touches** – Add any small but important finishing elements.  
6️⃣ **Complete and color** – Encourage creativity by suggesting fun ways to **color or customize** the drawing.  

**Remember: Generate exactly 6 images total, one for each numbered step above.**

By ensuring **bold strokes, high resolution, and structured simplicity**, kids will have a fun and intuitive drawing experience! 🚀  

---            
    `
  }];
}

export const learningStepInstructions = [
  `Start with the simplest shape – Begin with basic circles, squares, or lines to outline the structure.`,
  `Add more structure – Introduce additional simple shapes to develop the main form.`,
  `Define key features – Outline recognizable features while keeping it minimal.`,
  `Refine the details – Enhance proportions slightly, but keep it simple.`,
  `Final touches – Add any small but important finishing elements.`,
  `Complete and color – Encourage creativity by suggesting fun ways to color or customize the drawing.`
]; 