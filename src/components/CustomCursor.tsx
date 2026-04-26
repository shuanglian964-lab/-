import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('.clickable')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      >
        {/* Simple Ring that expands */}
        <motion.div
          className="w-full h-full border border-white rounded-full flex items-center justify-center overflow-hidden"
          animate={{
            scale: isHovering ? 2.5 : 1,
            backgroundColor: isHovering ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0)',
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* Mini Book Icon when hovering? Or just stay as a ring? */}
          {isHovering && (
            <div className="text-[6px] text-white font-serif opacity-0 animate-pulse">
               阅
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Follower DOT */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-sun rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      />
    </>
  );
}
