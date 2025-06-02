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
  if (!steps?.length) {
    return null;
  }
  //console.log(steps);
  return (
    <div className="w-full">
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 p-2">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 transform
              ${currentStep === index 
                ? 'ring-4 ring-[#58CC02] scale-105 shadow-lg border-4 border-[#FFD900]' 
                : 'ring-2 ring-[#E5E5E5] hover:ring-[#FFD900] border-2 border-[#E5E5E5]'
              }
              ${index < currentStep ? 'opacity-80' : ''}
            `}
          >
            {/* Step Image */}
            <div className="bg-white">
              {step.image && (
                <img 
                  src={`data:image/png;base64,${step.image}`} 
                  alt={`Step ${index + 1}`}
                  className="w-full h-full object-contain" 
                />
              )}
            </div>

            {/* Step Number Bubble */}
            <div 
              className={`absolute top-2 left-2 w-2 h-2 rounded-full flex items-center justify-center text-lg font-bold
                ${currentStep === index 
                  ? 'bg-[#58CC02] text-white border-2 border-white' 
                  : index < currentStep 
                    ? 'bg-[#1CB0F6] text-white'
                    : 'bg-[#FFD900] text-[#4B4B4B]'
                }
              `}
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              {index + 1}
            </div>

            {/* Progress Indicator */}
            {index <= currentStep && (
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#58CC02]"></div>
            )}

            {/* Completion Star */}
            {index < currentStep && (
              <div className="absolute top-2 right-2 text-[#FFD900] text-xl drop-shadow-md">
                ⭐
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}