import React, { useEffect, useRef } from "react";

const Petals = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let petals = [];
    const maxPetals = 35; // Increased slightly for richer visual depth

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create a petal object
    const createPetal = (initialY = false) => {
      return {
        x: Math.random() * canvas.width,
        y: initialY ? Math.random() * canvas.height : -20,
        r: 6 + Math.random() * 8, // size radius
        op: 0.4 + Math.random() * 0.5, // opacity
        swing: Math.random() * Math.PI * 2, // current swing angle
        swingSpeed: 0.01 + Math.random() * 0.02,
        speedY: 1.2 + Math.random() * 1.5,
        speedX: -0.3 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: 0.005 + Math.random() * 0.01,
      };
    };

    // Populate initial petals across the screen
    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    // Draw custom vector cherry blossom shape
    const drawPetal = (ctx, petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.beginPath();
      
      // Draw a cute cherry blossom petal shape using bezier curves
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-petal.r, -petal.r, -petal.r * 1.5, petal.r / 2, 0, petal.r);
      ctx.bezierCurveTo(petal.r * 1.5, petal.r / 2, petal.r, -petal.r, 0, 0);
      
      // Radial-like gradient look with fill styles
      ctx.fillStyle = `rgba(255, 182, 193, ${petal.op})`;
      ctx.fill();
      
      // Draw a subtle darker line in the middle of the petal for details
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, petal.r * 0.85);
      ctx.strokeStyle = `rgba(255, 105, 180, ${petal.op * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((petal, index) => {
        // Update position and rotation
        petal.y += petal.speedY;
        petal.x += petal.speedX + Math.sin(petal.swing) * 0.4;
        petal.rotation += petal.rotationSpeed;
        petal.swing += petal.swingSpeed;

        // If a petal goes off screen, recycle it to the top with new random properties
        if (petal.y > canvas.height + 20 || petal.x < -20 || petal.x > canvas.width + 20) {
          petals[index] = createPetal(false);
        }

        drawPetal(ctx, petal);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

// Memoize to prevent React updates from re-rendering the Canvas
export default React.memo(Petals);