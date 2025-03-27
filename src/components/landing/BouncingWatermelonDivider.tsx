export function BouncingWatermelonDivider() {
    return (
        <div className="relative h-24 overflow-hidden bg-[#E9F7FF] my-8">
        <div className="absolute inset-0 flex justify-around items-center">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="w-16 h-16 bg-[#FF4D79] rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                backgroundImage: "radial-gradient(circle at 30% 30%, #FF4D79 60%, #E03D69 100%)",
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-4 bg-[#4A66E0] rounded-full transform rotate-45"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}