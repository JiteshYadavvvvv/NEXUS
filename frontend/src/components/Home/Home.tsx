import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import Shuffle from "./Shuffle";
import TextType from './TextType';
import CurvedLoop from '@/components/ui/CurvedLoop';
import Beams from './Beams';
import { FeatureGrid } from './FeatureGrid';

export default function Home() {
  return (
    <>
    <section className="relative px-6 pt-32 pb-32 md:pt-48 md:pb-40 text-center overflow-hidden max-w-[100vw]">
        <div className="absolute inset-0 -z-10 h-full w-full bg-transparent">
             <Beams
               beamWidth={3}
               beamHeight={30}
               beamNumber={20}
               lightColor="#ffffff"
               speed={2}
               noiseIntensity={1.75}
               scale={0.2}
               rotation={30}
             />
        </div>

      <div className="mx-auto max-w-5xl space-y-8 relative z-10">


        <div>
            <Shuffle
            text="Your campus just got smarter"
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
            loop={false}
            loopDelay={0}
            className="text-5xl md:text-7xl lg:text-8xl leading-[1.1] font-bold text-white oi-regular" onShuffleComplete={undefined} colorFrom={undefined} colorTo={undefined}            />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-3xl text-xl mt-[-8px] text-muted-foreground md:text-xl font-light leading-relaxed"
          >
            <TextType 
              text={["where every club finds home", "where every student community connects"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="|"
              deletingSpeed={50}
              cursorBlinkDuration={0.5}
              onSentenceComplete={undefined}
              variableSpeed={undefined}
            />
          </motion.div>

          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-row items-center justify-center gap-0 mt-5"
          >
            <Button variant="default" asChild size="lg" className="h-12 rounded-full px-8 text-base bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_30px_-10px_rgba(37,99,235,0.6)] transition-all hover:scale-105 active:scale-95 duration-300 group">
              <Link to="/clubs">
                Explore Clubs <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
             <Button variant="outline" asChild size="lg" className="h-12 rounded-full bg-transparent hover:bg-white/10 border border-white/10 text-white ml-2" style={{ width: '180px' }}>
                  <a href="https://github.com/Jitesh-Yadav01/SYNC-AIT" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 transition-colors">
                      <Github className="h-4 w-4 shrink-0" />
                      <span className="text-base font-medium">Star on GitHub</span>
                  </a>
             </Button>
          </motion.div>
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-full mt-20 ml-[-60px] mb-[-200px] foldit-regular md:-mt-4"
        >
            <CurvedLoop 
              marqueeText="OSS ✦ GDG ✦ CP ✦ PR Cell ✦ Radio Raga ✦ E Cell ✦ EV Club ✦ GDXR ✦ ISDF ✦ Sports Club ✦ Cultural Board ✦ Technical Board ✦ RnD Cell ✦ Cycling club ✦ NSS ✦ Nature Club ✦ MAGBOARD ✦ MINERVA ✦ FEET TAPPERS ✦ "
              speed={2}
              curveAmount={0}
              interactive
              className=""
            />
        </motion.div>

      </div>
    </section>
    <FeatureGrid />
    </>
  );
}
