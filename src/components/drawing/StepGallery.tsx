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

  return (
    <div className="w-full">
      <h2 
        className="text-2xl font-bold text-purple-600 mb-4 text-center"
        style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
      >
        Follow Along! 🎨
      </h2>
      
      <div className="grid grid-cols-6 gap-4 w-full">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 transform
              ${currentStep === index 
                ? 'ring-4 ring-purple-500 scale-105 shadow-lg' 
                : 'ring-2 ring-gray-200 hover:ring-purple-300'
              }
              ${index < currentStep ? 'opacity-70' : ''}
            `}
          >
            {/* Step Image */}
            <div className="w-full h-full bg-white">
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
              className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold
                ${currentStep === index 
                  ? 'bg-purple-500 text-white' 
                  : index < currentStep 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }
              `}
            >
              {index + 1}
            </div>

            {/* Progress Indicator */}
            {index <= currentStep && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
            )}

            {/* Completion Star */}
            {index < currentStep && (
              <div className="absolute top-2 right-2 text-yellow-400 text-xl">
                ⭐
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 