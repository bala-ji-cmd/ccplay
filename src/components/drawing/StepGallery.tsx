interface Step {
  title?: string;
  step?: number;
  instruction?: string;
  image?: string;
}

interface StepGalleryProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export function StepGallery({ steps, currentStep, setCurrentStep }: StepGalleryProps) {
  console.log('StepGallery received steps count:', steps);

  if (!steps?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex gap-4 overflow-x-auto py-2">

      

        {steps.map((step, index) => {
          console.log(`Rendering step ${index}:`, step?.image ? 'has image' : 'no image');
          return (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-4 transition-all
                ${currentStep === index ? 'border-purple-500 scale-105' : 'border-transparent'}`}
            >
              {step.image && (
                <img 
                  src={`data:image/png;base64,${step.image}`} 
                  alt={`Step ${index + 1}`}
                  className="w-full h-full object-cover" 
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center text-sm py-1">
                {index + 1}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 