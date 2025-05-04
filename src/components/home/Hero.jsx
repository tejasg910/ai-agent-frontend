// import { cn } from "@/lib/utils";
// import { AnimatedGridPattern } from "../magicui/animated-grid-pattern";

// export function AnimatedGridBackground() {
//   return (
//     <div className="relative flex min-h-screen bg-black w-full  justify-center overflow-hidden   p-20">
//       <div className="z-10">
//         <div>
//           <div className="px-2 mb-4 mx-auto shadow-md border border-gray-200 rounded-full bg-white w-[250px] text-center">
//             <div className="">
//               <div className="px-1 inline-block border-r-2 py-2 text-sm border-gray-200">🎉</div>
//               <div className="px-1 inline-block py-2 text-sm font-light">Introducing Interview Sheduler &gt;</div>
//             </div>
//           </div>
//         </div>
//         <h2 className="text-7xl font-bold text-white mb-4">
//           Streamline Your <span>Hiring</span>
//         </h2>
//         <h2 className="text-7xl font-bold text-white mb-4">
//           With AI-Driven Insights
//         </h2>
//         <h4 className="text-center text-gray-100 text-xl">Effectively appointment, candidates, jobs <br /> with our intelligent sheduling assistant</h4>
//       </div>

//       <div>

//       </div>
//       <AnimatedGridPattern
//         numSquares={30}
//         maxOpacity={0.1}
//         duration={3}
//         repeatDelay={1}
//         className={cn(
//           "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
//           "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
//         )}
//       />
//     </div>
//   );
// }

"use client";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "../magicui/animated-grid-pattern";
import GetStarted from "./GetStarted";

export function AnimatedGridBackground() {
  return (
    <div className="relative flex flex-col min-h-screen bg-black w-full items-center overflow-hidden p-8 md:p-20">
      {/* Grid background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "absolute inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 z-0"
        )}
      />

      {/* Content section */}
      <div className="z-10 text-center max-w-4xl mb-12">
        <div className="px-2 mb-6 mx-auto shadow-sm shadow-orange-400 border border-gray-200 rounded-full bg-white w-auto inline-block text-center">
          <div className="flex items-center">
            <div className="px-3 inline-block border-r py-2 text-sm border-gray-300">
              🎉
            </div>
            <div className="px-4 inline-block py-2 text-sm font-light">
              Introducing Interview Scheduler &gt;
            </div>
          </div>
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
          Streamline Your <span className="text-yellow-300">Hiring</span>
        </h2>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
          With AI-Driven Insights
        </h2>
        <h4 className="text-center text-gray-100 text-lg md:text-xl mb-10">
          Effectively manage appointments, candidates, jobs <br /> with our
          intelligent scheduling assistant 
        </h4>
<GetStarted />
        {/* yellow gradient button with hover effect - matching the reference image */}
       
      </div>

      {/* Calendar Image with Aura Effect */}
      {/* <GlowEffect /> */}
      <EnhancedGlowEffect />
    </div>
  );
}

function GlowEffect() {
  return (
    <div className="relative z-10 mt-8 w-full max-w-4xl mx-auto">
      <div className="relative">
        <div
          className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
          style={{
            background: [
              // Core bright spot
              "radial-gradient(ellipse at center bottom, rgba(128,0,128,1) 0%, rgba(128,0,128,0) 60%)",
              // Optional second layer for extra punch
              "radial-gradient(ellipse at center bottom, rgba(128,0,128,0.6) 10%, rgba(128,0,128,0) 80%)",
            ].join(","),
            filter: "blur(120px)",
          }}
        />
      </div>

      {/* Calendar image */}
      <div className="relative">
        <img
          src="/dashboard.png"
          alt="AI Scheduling Calendar Interface"
          className="w-full rounded-xl border border-yellow-900 shadow-lg"
        />

        {/* Subtle light beam on top center border */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
      </div>
    </div>
  );
}


function EnhancedGlowEffect() {
    return (
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="relative">
          {/* Main gradient glow effect - more intense at top */}
          <div
            className="absolute inset-x-0 -top-10 h-64 pointer-events-none"
            style={{
              background: [
                // Core intense spot (darker orange, closer to image)
                'radial-gradient(ellipse at center top, rgba(194, 65, 12, 1) 0%, rgba(194, 65, 12, 0.8) 20%, rgba(194, 65, 12, 0) 70%)',
                // Middle layer with medium intensity (orange)
                'radial-gradient(ellipse at center top, rgba(234, 88, 12, 0.9) 5%, rgba(234, 88, 12, 0) 60%)',
                // Outer glow with lower intensity (yellow)
                'radial-gradient(ellipse at center top, rgba(250, 204, 21, 0.5) 10%, rgba(250, 204, 21, 0) 80%)'
              ].join(','),
              filter: 'blur(70px)',
            }}
          />
          
          {/* Secondary glow for depth */}
          <div
            className="absolute inset-x-0 -top-5 h-40 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center top, rgba(217, 119, 6, 1) 0%, rgba(217, 119, 6, 0) 70%)',
              filter: 'blur(40px)',
            }}
          />
          
          {/* Dashboard image */}
          <div className="relative">
            <img 
              src="/dashboard.png" 
              alt="Dashboard Interface" 
              className="w-full rounded-xl border border-yellow-900 shadow-xl"
            />
          </div>
          
          {/* Bottom border highlight */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        </div>
      </div>
    );
  }