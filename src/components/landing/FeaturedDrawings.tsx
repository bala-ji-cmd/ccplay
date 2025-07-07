import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SVGProps } from "react"

type FeaturedDrawing = {
  imagePath: string
  title: string
  description: string
  kidName: string
  kidAge: number
  backgroundColor: string
  borderColor: string
  textColor: string
  icon: {
    type: 'image' | 'svg'
    src: string
    bgColor: string
    borderColor: string
  }
  tag: {
    text: string
    bgColor: string
    textColor: string
    borderColor: string
  }
}

const featuredDrawings: FeaturedDrawing[] = [
  {
    imagePath: "/drawings/Dodos from Cocomelon Play.png",
    title: "Dodos Adventure",
    description: "Colorful dodos exploring a whimsical world.",
    kidName: "Emma",
    kidAge: 4,
    backgroundColor: "#FFF9E5",
    borderColor: "#FF4B4B",
    textColor: "#58CC02",
    icon: {
      type: 'image',
      src: "/jj-happy.png",
      bgColor: "#FFC800",
      borderColor: "white"
    },
    tag: {
      text: "AI Assisted",
      bgColor: "#FFECEC",
      textColor: "#FF4B4B",
      borderColor: "#FF4B4B"
    }
  },
  {
    imagePath: "/drawings/Kids Building Castle at Beach - Cocomelon Play.png",
    title: "Beach Castle",
    description: "Kids building a sandcastle by the beach.",
    kidName: "Lucas",
    kidAge: 5,
    backgroundColor: "#E2F4FF",
    borderColor: "#1CB0F6",
    textColor: "#1CB0F6",
    icon: {
      type: 'svg',
      src: "bus",
      bgColor: "#FF4B4B",
      borderColor: "white"
    },
    tag: {
      text: "AI Animated",
      bgColor: "#FFECEC",
      textColor: "#FF4B4B",
      borderColor: "#FF4B4B"
    }
  },
  {
    imagePath: "/drawings/Nature Scenes from Cocomelon Play.png",
    title: "Nature Wonder",
    description: "A collage of nature elements like trees, mountains, and rivers.",
    kidName: "Ava",
    kidAge: 3,
    backgroundColor: "#FFF9E5",
    borderColor: "#FFC800",
    textColor: "#78510D",
    icon: {
      type: 'svg',
      src: "bath",
      bgColor: "#1CB0F6",
      borderColor: "white"
    },
    tag: {
      text: "Step-by-Step",
      bgColor: "#FFECEC",
      textColor: "#FF4B4B",
      borderColor: "#FF4B4B"
    }
  },
  {
    imagePath: "/drawings/George Imagines Things - Cocomelon Play.png",
    title: "George Imagines",
    description: "George imagines a colorful world of elephant",
    kidName: "George",
    kidAge: 6,
    backgroundColor: "#FFF9E5",
    borderColor: "#FF4B4B",
    textColor: "#58CC02",
    icon: {
      type: 'svg',
      src: "cow",
      bgColor: "#FFC800",
      borderColor: "white"
    },
    tag: {
      text: "AI Colored",
      bgColor: "#FFECEC",
      textColor: "#FF4B4B",
      borderColor: "#FF4B4B"
    }
  },
  {
    imagePath: "/drawings/May Moons Earth Cocomelon.png",
    title: "May Moons Earth",
    description: "A magical moon scene illuminating Earth in glow.",
    kidName: "May",
    kidAge: 4,
    backgroundColor: "#E2F4FF",
    borderColor: "#1CB0F6",
    textColor: "#1CB0F6",
    icon: {
      type: 'image',
      src: "/yoyo-happy.png",
      bgColor: "#FF4B4B",
      borderColor: "white"
    },
    tag: {
      text: "Daily Challenge",
      bgColor: "#FFECEC",
      textColor: "#FF4B4B",
      borderColor: "#FF4B4B"
    }
  },
  {
    imagePath: "/drawings/Herd of Sheep Cocomelon Play.png",
    title: "Herd of Sheep",
    description: "A peaceful meadow scene with a herd of sheep grazing under blue skies.",
    kidName: "Sophie",
    kidAge: 5,
    backgroundColor: "#FFF9E5",
    borderColor: "#FFC800",
    textColor: "#78510D",
    icon: {
      type: 'svg',
      src: "party-popper",
      bgColor: "#8549BA",
      borderColor: "white"
    },
    tag: {
      text: "AI Enhanced",
      bgColor: "#FFECEC",
      textColor: "#FF4B4B",
      borderColor: "#FF4B4B"
    }
  }
]

const DrawingCard = ({ drawing, priority }: { drawing: FeaturedDrawing, priority?: boolean }) => {
  const getIcon = () => {
    if (drawing.icon.type === 'image') {
      return (
        <Image 
          src={drawing.icon.src} 
          alt={drawing.title} 
          width={30} 
          height={30} 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      )
    }
    
    // SVG icons
    const svgProps: SVGProps<SVGSVGElement> = {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "white",
      strokeWidth: "2",
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
      className: "lucide lucide-" + drawing.icon.src
    }

    switch (drawing.icon.src) {
      case 'bus':
        return (
          <svg {...svgProps}>
            <path d="M8 6v6" />
            <path d="M16 6v6" />
            <path d="M2 12h20" />
            <path d="M18 18h2a2 2 0 0 0 2-2v-6a8 8 0 0 0-16 0v6a2 2 0 0 0 2 2h2" />
            <path d="M9 18h6" />
            <path d="M5 18v2" />
            <path d="M19 18v2" />
            <rect x="5" y="18" width="14" height="2" rx="1" />
          </svg>
        )
      case 'bath':
        return (
          <svg {...svgProps}>
            <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
            <line x1="10" x2="8" y1="5" y2="7" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <line x1="7" x2="7" y1="19" y2="21" />
            <line x1="17" x2="17" y1="19" y2="21" />
          </svg>
        )
      case 'cow':
        return (
          <svg {...svgProps}>
            <path d="M12 15h2a6 6 0 0 0 6-6v-1a2 2 0 0 0-2-2h-2.5" />
            <path d="M10 15h2" />
            <path d="M12 15v4" />
            <path d="M10 19h4" />
            <path d="M12 9v.01" />
            <path d="M6 15h2a6 6 0 0 1 6-6v-1a2 2 0 0 0-2-2h-2.5" />
            <path d="M4 8v1" />
            <path d="M20 8v1" />
          </svg>
        )
      case 'party-popper':
        return (
          <svg {...svgProps}>
            <path d="M5.8 11.3 2 22l10.7-3.79" />
            <path d="M4 3h.01" />
            <path d="M22 8h.01" />
            <path d="M15 2h.01" />
            <path d="M22 20h.01" />
            <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
            <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
            <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
            <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="group relative">
      {/* Decorative background */}
      <div
        className="absolute -inset-1 rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform"
        style={{ background: drawing.borderColor }}
      ></div>

      <div
        className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 transform transition-all group-hover:scale-105"
        style={{ borderColor: drawing.borderColor }}
      >
        <div className="relative h-48">
          <Image
            src={drawing.imagePath}
            alt={drawing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
          <div className="absolute top-3 right-3">
            <div
              className="rounded-full h-10 w-10 flex items-center justify-center border-2"
              style={{ background: drawing.icon.bgColor, borderColor: drawing.icon.borderColor }}
            >
              {getIcon()}
            </div>
          </div>
        </div>
        <div className="p-3" style={{ background: drawing.backgroundColor }}>
          <h3
            className="text-lg font-bold"
            style={{ color: drawing.textColor, fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            {drawing.title}
          </h3>
          <p className="text-[#4B4B4B] mb-2" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
            {drawing.description}
          </p>
          <div className="flex justify-between items-center">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full border-2"
              style={{
                background: drawing.backgroundColor,
                color: drawing.textColor,
                borderColor: drawing.borderColor,
                fontFamily: "Comic Sans MS, cursive, sans-serif"
              }}
            >
              By {drawing.kidName}, age {drawing.kidAge}
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full border-2"
              style={{
                background: drawing.tag.bgColor,
                color: drawing.tag.textColor,
                borderColor: drawing.tag.borderColor,
                fontFamily: "Comic Sans MS, cursive, sans-serif"
              }}
            >
              {drawing.tag.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeaturedDrawings() {
  return (
    <section id="drawings" className="py-10 bg-[#FFF4E5]">
      <div className="container mx-auto px-4">
        <h2
          className="text-2xl md:text-4xl font-extrabold text-center mb-4"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          <span className="bg-[#FF4B4B] text-white px-4 py-2 rounded-xl inline-block transform -rotate-2 border-4 border-[#E43B3B]">
            Look What Our
          </span>
          <span className="text-[#58CC02] px-2">Little Artists</span>
          <span className="bg-[#FFC800] text-[#78510D] px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2 border-4 border-[#E5B800]">
            Created!
          </span>
        </h2>
        <p
          className="text-lg text-center text-[#4B4B4B] mb-8 max-w-3xl mx-auto"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          These amazing Cocomelon-inspired masterpieces were all made using Cocomelon Play's AI drawing tools! ✨
        </p>

        {/* App context banner */}
        <div className="bg-white rounded-full py-2 px-4 flex items-center justify-center gap-3 max-w-xs mx-auto mb-6 shadow-md border-4 border-[#FFC800]">
          <Image src="/logo.png" alt="Cocomelon Play Logo" width={40} height={40} className="rounded-full" />
          <p className="text-[#58CC02] font-bold" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
            Created with CCPlay! ✨
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredDrawings.map((drawing, index) => (
            <DrawingCard key={index} drawing={drawing} priority={index === 0} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            className="bg-[#58CC02] hover:bg-[#46A302] text-white rounded-full px-6 py-4 text-lg font-bold shadow-lg transition-transform hover:scale-105 border-b-4 border-[#46A302]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            See More Amazing Drawings! ✨
          </Button>
        </div>
      </div>
    </section>
  )
}
