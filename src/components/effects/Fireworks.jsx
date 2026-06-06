import { useEffect, useRef } from "react";

// Fyrverkerier på en canvas – raketer som exploderar i färgglada partiklar.
export default function Fireworks() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];
    const colors = ["#ffd23f", "#ef4b4b", "#25c685", "#1e90ff", "#ff5fa2", "#00ffd0", "#ffffff"];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function burst() {
      const x = canvas.width * (0.15 + Math.random() * 0.7);
      const y = canvas.height * (0.12 + Math.random() * 0.4);
      const color = colors[(Math.random() * colors.length) | 0];
      const n = 50 + ((Math.random() * 30) | 0);
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n;
        const sp = 1 + Math.random() * 4;
        particles.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          color,
        });
      }
    }

    const interval = setInterval(burst, 800);
    burst();

    function frame() {
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gravitation
        p.life -= 0.012;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="fx-canvas" />;
}
