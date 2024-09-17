"use client";

import { useRef } from "react";
import { Environment } from "@react-three/drei";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {};

export default function Scene({}: Props) {
  const canOneRef = useRef<Group>(null);
  const canTwoRef = useRef<Group>(null);
  const canThreeRef = useRef<Group>(null);
  const canFourRef = useRef<Group>(null);
  const canFiveRef = useRef<Group>(null);

  const canOneGroupRef = useRef<Group>(null);
  const canTwoGroupRef = useRef<Group>(null);

  const groupRef = useRef<Group>(null);

  const FLOAT_SPEED = 1.5;

  useGSAP(() => {
    if (
      !canOneRef.current ||
      !canTwoRef.current ||
      !canThreeRef.current ||
      !canFourRef.current ||
      !canFiveRef.current ||
      !canOneGroupRef.current ||
      !canTwoGroupRef.current ||
      !groupRef.current
    )
      return;

    // Set can start location
    gsap.set(canOneRef.current.position, { x: -1.5 });
    gsap.set(canOneRef.current.rotation, { z: -0.5 });

    gsap.set(canTwoRef.current.position, { x: 1.5 });
    gsap.set(canTwoRef.current.rotation, { z: 0.5 });

    gsap.set(canThreeRef.current.position, { y: 5, z: 2 });
    gsap.set(canFourRef.current.position, { x: 2, y: 4, z: 2 });
    gsap.set(canFiveRef.current.position, { y: -5 });

    const introTl = gsap.timeline({
      defaults: {
        duration: 3,
        ease: "back.out(1.4)",
      },
    });

    if (window.scrollY < 20) {
      introTl
        .from(canOneGroupRef.current.position, { y: -5, x: 1 }, 0)
        .from(canOneGroupRef.current.rotation, { z: 3 }, 0)
        .from(canTwoGroupRef.current.position, { y: 5, x: 1 }, 0)
        .from(canTwoGroupRef.current.rotation, { z: 3 }, 0);
    }

    const scrollTl = gsap.timeline({
      defaults: {
        duration: 2,
      },
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    scrollTl
      // Rotate can group
      .to(groupRef.current?.rotation, { y: Math.PI * 2 })

      // Can one - blackcherry
      .to(canOneRef.current.position, { x: -0.2, y: -0.7, z: -2 }, 0)
      .to(canOneRef.current.rotation, { z: 0.3 }, 0)

      // Can two - lemonlime
      .to(canTwoRef.current.position, { x: 1, y: -0.2, z: -1 }, 0)
      .to(canThreeRef.current.rotation, { z: 0 }, 0)

      // Can three - grape
      .to(canThreeRef.current.position, { x: -0.3, y: 0.5, z: -1 }, 0)
      .to(canThreeRef.current.rotation, { z: -0.1 }, 0)

      // Can four - strawberry lemonade
      .to(canFourRef.current.position, { x: 0, y: -0.3, z: 0.5 }, 0)
      .to(canFourRef.current.rotation, { z: 0.3 }, 0)

      // Can five - watermelon
      .to(canFiveRef.current.position, { x: 0.3, y: 0.5, z: -0.5 }, 0)
      .to(canFiveRef.current.rotation, { z: -0.25 }, 0)

      // Shift everything to the right on a certain time
      .to(
        groupRef.current.position,
        { x: 1, duration: 3, ease: "sine.inOut" },
        1.3,
      );
  });

  return (
    <group ref={groupRef}>
      <group ref={canOneGroupRef}>
        <FloatingCan
          ref={canOneRef}
          flavor="blackCherry"
          floatSpeed={FLOAT_SPEED}
        />
      </group>
      <group ref={canTwoGroupRef}>
        <FloatingCan
          ref={canTwoRef}
          flavor="lemonLime"
          floatSpeed={FLOAT_SPEED}
        />
      </group>
      <FloatingCan ref={canThreeRef} flavor="grape" floatSpeed={FLOAT_SPEED} />
      <FloatingCan
        ref={canFourRef}
        flavor="strawberryLemonade"
        floatSpeed={FLOAT_SPEED}
      />
      <FloatingCan
        ref={canFiveRef}
        flavor="watermelon"
        floatSpeed={FLOAT_SPEED}
      />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}
