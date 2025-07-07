// Modularized drawing prompt templates for server-only use

export function getInitialSketchPrompt(userPrompt: string) {
  return `${userPrompt}. Create a black and white hand-drawn sketch on a 1280 x 720 canvas (16:9 aspect ratio). Use thick, bold strokes similar to a heavy marker or ink pen. Ensure the lines are sharp, solid, and well-defined with no blurring, feathering, or shading—just clean black outlines on a white background`;
}

export function getColorizePrompt() {
  return `Apply bright and solid colors to this 1280 x 720 line drawing, filling it in like a children's coloring book. Use vibrant, cheerful colors suitable for children's illustrations. Each distinct element should have its own clear color. Avoid grayscale, maintaining the original black line work while adding solid, clean colors between the lines.`;
}

export function getRedrawPrompt(userPrompt: string) {
  return `${userPrompt}. Keep a 1280 x 720 canvas (16:9 aspect ratio) with a minimal line doodle style. Ensure clean, bold strokes with sharp edges, avoiding any blurring or feathering. The lines should be well-defined and suitable for a children's drawing. Strictly use black and white. No colors.`;
} 