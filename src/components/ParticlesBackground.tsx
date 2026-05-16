"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const options: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: { value: 40, density: { enable: true } },
    color: { value: "#4ade80" },
    opacity: { value: { min: 0.1, max: 0.3 } },
    size: { value: { min: 1, max: 2.5 } },
    move: {
      enable: true,
      speed: 0.4,
      direction: "none",
      outModes: { default: "out" },
    },
    links: {
      enable: true,
      distance: 140,
      color: "#4ade80",
      opacity: 0.06,
      width: 1,
    },
  },
  detectRetina: true,
};

export function ParticlesBackground({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      className={`absolute inset-0 pointer-events-none ${className}`}
      options={options}
    />
  );
}
