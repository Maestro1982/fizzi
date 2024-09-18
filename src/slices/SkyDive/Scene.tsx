"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Cloud, Clouds, Environment, Text } from "@react-three/drei";
import { Content } from "@prismicio/client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import FloatingCan from "@/components/FloatingCan";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type SkyDiveProps = {
  sentence: string | null;
  flavor: Content.SkyDiveSliceDefaultPrimary["flavor"];
};

export default function Scene({ sentence, flavor }: SkyDiveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const canRef = useRef<THREE.Group>(null);
  const cloudOneRef = useRef<THREE.Group>(null);
  const cloudTwoRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const wordsRef = useRef<THREE.Group>(null);

  const ANGLE = 75 * (Math.PI / 180);

  const getXposition = (distance: number) => distance * Math.cos(ANGLE);
  const getYposition = (distance: number) => distance * Math.sin(ANGLE);
  const getXYPositions = (distance: number) => ({
    x: getXposition(distance),
    y: getYposition(-1 * distance),
  });

  useGSAP(() => {
    if (
      !groupRef.current ||
      !canRef.current ||
      !cloudOneRef.current ||
      !cloudTwoRef.current ||
      !cloudsRef.current ||
      !wordsRef.current
    )
      return;

    // Set initial postions
    gsap.set(cloudsRef.current.position, { z: 10 });
    gsap.set(canRef.current.position, {
      ...getXYPositions(-4),
    });
    gsap.set(
      wordsRef.current.children.map((word) => word.position),
      {
        ...getXYPositions(7),
        z: 2,
      },
    );

    // Spinning can
    gsap.to(canRef.current.rotation, {
      y: Math.PI * 2,
      duration: 1.7,
      repeat: -1,
      ease: "none",
    });

    // Infinite cloud movement
    const DISTANCE = 15;
    const DURATION = 6;

    gsap.set([cloudTwoRef.current.position, cloudOneRef.current.position], {
      ...getXYPositions(DISTANCE),
    });

    gsap.to(cloudOneRef.current.position, {
      y: `+=${getYposition(DISTANCE * 2)}`,
      x: `+=${getXposition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      duration: DURATION,
    });

    gsap.to(cloudTwoRef.current.position, {
      y: `+=${getYposition(DISTANCE * 2)}`,
      x: `+=${getXposition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      delay: DURATION / 2,
      duration: DURATION,
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".skydive",
        pin: true,
        start: "top top",
        end: "+=2000",
        scrub: 1.5,
      },
    });

    scrollTl
      .to("body", {
        backgroundColor: "#a4d7f3",
        overwrite: "auto",
        duration: 0.1,
      })
      .to(cloudsRef.current.position, { z: 0, duration: 0.3 }, 0)
      .to(canRef.current.position, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(
        wordsRef.current.children.map((word) => word.position),
        {
          keyframes: [
            { x: 0, y: 0, z: -1 },
            { ...getXYPositions(-7), z: -7 },
          ],
          stagger: 0.3,
        },
        0,
      )
      .to(canRef.current.position, {
        ...getXYPositions(4),
        duration: 0.5,
        ease: "back.in(1.7)",
      })
      .to(cloudsRef.current.position, { z: 7, duration: 0.5 });
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, 0.5]}>
        <FloatingCan
          ref={canRef}
          flavor={flavor}
          rotationIntensity={0}
          floatIntensity={3}
          floatSpeed={3}
        >
          <pointLight intensity={30} color="#8C0413" decay={0.6} />
        </FloatingCan>
      </group>
      {/* Text */}
      <group ref={wordsRef}>
        {sentence && <ThreeText sentence={sentence} color="#d741a7" />}
      </group>

      {/* Clouds */}
      <Clouds ref={cloudsRef}>
        <Cloud ref={cloudOneRef} bounds={[10, 10, 2]} />
        <Cloud ref={cloudTwoRef} bounds={[10, 10, 2]} />
      </Clouds>

      {/* Lights */}
      <ambientLight intensity={2} color="#9DDEFA" />
      <Environment files="/hdr/field.hdr" environmentIntensity={1.5} />
    </group>
  );
}

function ThreeText({
  sentence,
  color = "white",
}: {
  sentence: string;
  color?: string;
}) {
  const words = sentence.toUpperCase().split(" ");
  const material = new THREE.MeshLambertMaterial();
  const isDesktop = useMediaQuery("(min-width:950px)", true);

  return words.map((word: string, wordIndex: number) => (
    <Text
      key={`${wordIndex}-${word}`}
      scale={isDesktop ? 1 : 0.5}
      color={color}
      material={material}
      font="/fonts/Alpino-Variable.woff"
      fontWeight={900}
      anchorX={"center"}
      anchorY={"middle"}
      characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!,.?"
    >
      {word}
    </Text>
  ));
}
