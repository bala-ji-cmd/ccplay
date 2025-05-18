export function BouncingWatermelonDivider() {
  return (
    <div className="relative h-16 overflow-hidden bg-[#FFF4E5] my-8 border-y-4 border-[#58CC02]">
      <div className="absolute inset-0 flex justify-around items-center">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="relative w-8 h-8 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.1}s`,
              backgroundColor: "#FF4B4B",
              backgroundImage: "radial-gradient(circle at 30% 30%, #FF4B4B 60%, #E43B3B 100%)",
            }}
          >
            {/* Watermelon seeds */}
            <div className="absolute top-1/4 left-1/4 w-1 h-2 bg-[#78510D] rounded-full transform rotate-45"></div>
            <div className="absolute top-2/4 left-1/2 w-1 h-2 bg-[#78510D] rounded-full transform rotate-12"></div>
            <div className="absolute top-1/2 left-1/4 w-1 h-2 bg-[#78510D] rounded-full transform -rotate-20"></div>

            {/* Watermelon stem */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-[#58CC02] rounded-t-full"></div>

            {/* Watermelon face (on some) */}
            {/* {i % 3 === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="flex space-x-4 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  </div>
                  <div className="w-3 h-1.5 bg-black rounded-full transform translate-y-1"></div>
                </div>
              </div>
            )} */}
          </div>
        ))}
      </div>

      {/* Duolingo-style decorative elements */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">✨</div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">✨</div>
    </div>
  )
}
