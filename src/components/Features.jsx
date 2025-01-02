import React, {  useRef, useState } from 'react'

const BentoTilt =({ children,className = ''})=>{

  const[transformStyle,setTransformStyle]=useState("")

  const itemsRef =useRef(null);

  const handleMouseMove = (e) => {
    if(!itemsRef.current) return;
   
    const {left,top,width,height} =itemsRef.current.getBoundingClientRect();

    const  relativeX = (e.clientX-left)/width;
    const  relativeY = (e.clientY-top)/height;
   
    const tiltX=(relativeY-0.5) * 5;
    const tiltY=(relativeX-0.5) *-5;

     const newTransform=`perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98,0.98,0.98)`

    setTransformStyle(newTransform)
  }

  const handleMouseLeave = () =>{
    setTransformStyle("");
  }

 return(
     <div className={className} ref={itemsRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{transform: transformStyle}} >
      {children}
     </div>
 )
}
const BentoCard =({src,title,description})=>{
    return (
        <div className="relative size-full">
          <video 
            src={src}  
            loop
            muted
            autoPlay
            className="absolute left-0 top-0 size-full object-cover object-center"
          />
          <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
          <div>
            <h1 className='bento-title special-font'>{title}</h1>  {/* Use the `title` prop */}
            {description && (
              <p className="mt-3 max-w-64 text-xs md:text-base text-blue-50">
                {description}  {/* Use the `description` prop */}
              </p>
            )}
            </div>
          </div>
        </div>
      );
}


const Features = () => {
    return (
      <section className="bg-black pb-52">
        <div className="container mx-auto px-3 md:px-10">
          <div className="px-5 py-32">
            <p className="font-circular-web text-lg text-blue-50">
              Explore the Art of Football Optimization
            </p>
  
            <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
              Immerse yourself in a dynamic and constantly evolving platform where
              cutting-edge football strategies and team optimization converge to create
              winning solutions
            </p>
          </div>
  
          <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
            <BentoCard
              src="videos/feature-1.mp4"  
              title=<> W<b>inn</b>ing F<b>or</b>mula</>
              description="A cross-platform football experience that turns your strategic decisions into rewards, unlocking new levels of success across games and challenges"  
            />
          </BentoTilt>
          <div className='grid h-[135vh] w-full grid-cols-2 gird-rows-3 gap-7 '>
                <BentoTilt className='bento-tilt_1 row-span-1 md:col-span-1  md:row-span-2 '>
               <BentoCard
                src="videos/feature-2.mp4"
               title={<>
                 P<b>la</b>yG<b>e</b>n
               </>}
               description="A football-focused platform blending cutting-edge strategy with real-time optimization, ready for expansion and evolution"
               />
                </BentoTilt>
                <BentoTilt className='bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0'>
                   <BentoCard
                    src="videos/feature-3.mp4"
                    title={<>
                     E<b>le</b>vate
                    </>}
                    description="A football-driven hub, enhancing strategies and teamwork with real-time optimization for players and coaches"
                   />
                </BentoTilt>
                <BentoTilt className='bento-tilt_1 me-14 md:col-span-1 md:me-0 '>
                   <BentoCard
                    src="videos/feature-4.mp4"
                    title={<>
                    Fo<b>rmu</b>late
                    </>}
                    description="A cutting-edge AI-driven platform - enhancing your football strategy for smarter, more rewarding gameplay"
                   />
                </BentoTilt>
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;
  

