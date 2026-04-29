"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, useMemo, useEffect, useState } from "react";

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */

function useMouseGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);

  return { x, y };
}

function useParallax(ref: React.RefObject<HTMLElement | null>, strength = 50) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], [strength, -strength]);
}

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  y = 40,
  scale = 1,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, scale }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function FloatingImage({
  src,
  className,
  parallaxStrength = 30,
  mouseStrength = 0.02,
}: {
  src: string;
  className: string;
  parallaxStrength?: number;
  mouseStrength?: number;
}) {
  const ref = useRef(null);
  const parallaxY = useParallax(ref, parallaxStrength);
  const smoothY = useSpring(parallaxY, { stiffness: 50, damping: 20 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothMY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) * mouseStrength);
      mouseY.set((e.clientY - cy) * mouseStrength);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY, mouseStrength]);

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY, x: smoothMX, translateY: smoothMY }}
      className={className}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden="true" />
    </motion.div>
  );
}

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 6}s`,
        size: `${1 + Math.random() * 2.5}px`,
        glow: Math.random() > 0.7,
      })),
    [],
  );

  return (
    <div className="hero__particles">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`particle ${p.glow ? "particle--glow" : ""}`}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

function TeamSparks() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        top: `${10 + Math.random() * 80}%`,
        delay: `${Math.random() * 12}s`,
        duration: `${10 + Math.random() * 8}s`,
        size: `${1 + Math.random() * 2.5}px`,
        green: Math.random() > 0.6,
      })),
    [],
  );

  return (
    <div className="team__particles">
      {sparks.map((s) => (
        <span
          key={s.id}
          className={`team-spark ${s.green ? "team-spark--green" : ""}`}
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.duration,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
    </div>
  );
}

function CryptParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${40 + Math.random() * 58}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 12}s`,
        duration: `${7 + Math.random() * 8}s`,
        size: `${1 + Math.random() * 3.5}px`,
        dim: Math.random() > 0.4,
      })),
    [],
  );

  return (
    <div className="crypt-zone__particles">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`crypt-particle ${p.dim ? "crypt-particle--dim" : ""}`}
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

function MouseGlow() {
  const { x, y } = useMouseGlow();
  const smoothX = useSpring(x, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(y, { stiffness: 40, damping: 25 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <motion.div
      className="mouse-glow"
      style={{ left: smoothX, top: smoothY }}
    />
  );
}

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const TEAM = [
  { name: "Gaultier", role: "Dev", avatar: "/assets/team/team-2.png" },
  {
    name: "Mattéo",
    role: "Création / Game Design",
    avatar: "/assets/team/team-3.png",
  },
  { name: "Illona", role: "Dev / Scénario", avatar: "/assets/team/team-7.png" },
  {
    name: "François",
    role: "Dev / Game Design",
    avatar: "/assets/team/team-5.png",
  },
  { name: "Noémie", role: "Dev", avatar: "/assets/team/team-1.png" },
  { name: "Coranthin", role: "Dev", avatar: "/assets/team/team-6.png" },
  {
    name: "Wilfrid",
    role: "Dev / Game Design",
    avatar: "/assets/team/team-4.png",
  },
  { name: "Ibtissam", role: "Dev", avatar: "/assets/team/team-8.png" },
];

const HEROINE = {
  name: "L'Exploratrice",
  quote: "« Je raconterai votre histoire. »",
  avatar: "/assets/explorer.png",
};

const CHARACTERS = [
  {
    name: "Mnara",
    quote: "« Les symboles ne mentent jamais. »",
    avatar: "/assets/mnara.png",
  },
  {
    name: "Dornak",
    quote: "« La pierre se souvient de tout. »",
    avatar: "/assets/dornak.png",
  },
  {
    name: "Lioran",
    quote: "« J'ai tout écrit, pour ceux qui viendront. »",
    avatar: "/assets/lioran.png",
  },
  { name: "Luma", quote: "« ... »", avatar: "/assets/luma.png" },
];

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroLogoScale = useTransform(heroScroll, [0, 1], [1, 0.85]);
  const heroLogoOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroParallax = useTransform(heroScroll, [0, 1], [0, 150]);

  return (
    <main>
      <MouseGlow />

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg" />
        <div className="hero__vignette" />
        <Particles />
        <motion.div
          className="hero__content"
          style={{
            y: heroParallax,
            scale: heroLogoScale,
            opacity: heroLogoOpacity,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/logo.png"
              alt="La Crypte Oubliée"
              width={500}
              height={500}
              className="hero__logo"
              priority
            />
          </motion.div>
          <motion.p
            className="hero__tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Puzzle-aventure narratif sur navigateur
          </motion.p>
          <motion.a
            href="#pitch"
            className="hero__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Découvrir</span>
          </motion.a>
        </motion.div>
        <motion.div
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </motion.div>
      </section>

      {/* ═══════════ PITCH ═══════════ */}
      <section className="pitch" id="pitch">
        <div className="pitch__inner">
          <Reveal delay={0.1}>
            <span className="pitch__mark">&ldquo;</span>
            <p className="pitch__quote">
              Une jeune exploratrice se retrouve piégée dans la dernière crypte
              d&apos;un culte oublié, connu pour invoquer des démons. En
              déchiffrant un langage symbolique perdu, elle découvre les traces
              d&apos;une famille dont les esprits hantent encore les lieux.
              Chaque énigme résolue révèle un fragment de leur histoire et remet
              en question tout ce qu&apos;elle croyait savoir.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <span className="pitch__question">
              Sont-ils vraiment les monstres décrits par l&apos;Histoire...
              <br />
              ou les victimes d&apos;un terrible malentendu ?
            </span>
          </Reveal>
        </div>
        <div className="pitch__door">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/banner_door.png" alt="" aria-hidden="true" />
        </div>
      </section>

      {/* ═══════════ ORIGINES ═══════════ */}
      <section className="section origin">
        <Reveal>
          <p className="section__label">Nos racines</p>
          <h2 className="section__title">L&apos;héritage Flash</h2>
          <div className="section__divider" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="section__text">
            En 1996, Macromedia Flash ouvrait la voie aux jeux navigateur. De{" "}
            <em>Pico&apos;s School</em> à <em>Dofus</em>, ces jeux avaient un
            point commun : on cliquait et on jouait. Pas d&apos;installation,
            pas de tutoriel. Fans de cette époque, nous avons voulu ramener cet
            esprit avec la qualité d&apos;aujourd&apos;hui.
          </p>
        </Reveal>
        <div className="origin__grid">
          <Reveal delay={0.2}>
            <div className="origin__feature">
              <span className="origin__feature-title">Immersion immédiate</span>
              <p className="origin__feature-text">
                Là où des jeux comme Pokémon Legends Z-A prennent 2 à 3 heures
                pour lancer le joueur, nous le plongeons dans l&apos;action dès
                la première seconde. C&apos;est un véritable sujet dans le jeu
                vidéo actuel.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="origin__feature">
              <span className="origin__feature-title">Accessible à tous</span>
              <p className="origin__feature-text">
                Jouable directement dans le navigateur. Aucune installation,
                aucune configuration. Ouvrez la page, commencez l&apos;aventure.
                L&apos;esprit Flash, la puissance moderne.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ ZONE CRYPTE (récit → gameplay) ═══════════ */}
      <div className="crypt-zone">
        <div className="crypt-zone__image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/crypt.png"
            alt=""
            className="crypt-zone__image"
            aria-hidden="true"
          />
        </div>
        <CryptParticles />

        {/* ═══════════ HISTOIRE ═══════════ */}
        <section className="section story">
          <div className="story__bg-glow" />
          <div className="story__content">
            <Reveal>
              <p className="section__label">Le récit</p>
              <h2 className="section__title">Le récit</h2>
              <div className="section__divider" />
            </Reveal>
            <div className="story__layout">
              <Reveal delay={0.1}>
                <div className="story__block">
                  <p className="story__block-text">
                    Quelque part sous la pierre, une porte s&apos;est refermée
                    depuis des siècles. Les murs portent encore les traces de
                    ceux qui ont vécu ici — des symboles que personne n&apos;a
                    su lire, des voix que personne n&apos;a voulu entendre. Ils
                    attendent. Quelqu&apos;un qui prendra le temps de
                    comprendre. Quelqu&apos;un qui ne fuira pas à la première
                    ombre. La crypte ne livre pas ses secrets à ceux qui se
                    pressent. Elle les murmure, lentement, à ceux qui osent
                    rester.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════ PERSONNAGES ═══════════ */}
        <section className="section">
          <Reveal>
            <p className="section__label">Les personnages</p>
            <h2 className="section__title">Les personnages</h2>
            <div className="section__divider" />
          </Reveal>

          <div className="characters__row characters__row--heroine">
            <Reveal delay={0.1} y={30}>
              <motion.div
                className="character-card"
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
              >
                <div className="character-card__avatar-frame heroine__avatar-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={HEROINE.avatar} alt={HEROINE.name} className="character-card__avatar heroine__avatar" />
                </div>
                <h3 className="character-card__name">{HEROINE.name}</h3>
                <p className="character-card__quote">{HEROINE.quote}</p>
              </motion.div>
            </Reveal>
          </div>

          <div className="characters__row">
            {CHARACTERS.map((char, i) => (
              <Reveal key={char.name} delay={0.12 * (i + 1)} y={30}>
                <motion.div
                  className="character-card"
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="character-card__avatar-frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="character-card__avatar"
                    />
                  </div>
                  <h3 className="character-card__name">{char.name}</h3>
                  <p className="character-card__quote">{char.quote}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══════════ GAMEPLAY ═══════════ */}
        <section className="section">
          <Reveal>
            <p className="section__label">Mécaniques</p>
            <h2 className="section__title">Gameplay</h2>
            <div className="section__divider" />
          </Reveal>
          <div className="gameplay__pillars">
            <Reveal delay={0.1}>
              <motion.div
                className="pillar"
                whileHover={{
                  borderColor: "rgba(212, 168, 67, 0.2)",
                  transition: { duration: 0.3 },
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/icon_light.png"
                  alt=""
                  className="pillar__icon-img"
                  aria-hidden="true"
                />
                <h3 className="pillar__title">Lumière</h3>
                <p className="pillar__text">
                  Manipulez l&apos;éclairage, redirigez des miroirs, allumez des
                  flambeaux pour révéler des secrets cachés dans l&apos;ombre.
                  La gestion de luminosité est au coeur de chaque salle.
                </p>
              </motion.div>
            </Reveal>
            <Reveal delay={0.2}>
              <motion.div
                className="pillar"
                whileHover={{
                  borderColor: "rgba(212, 168, 67, 0.2)",
                  transition: { duration: 0.3 },
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/icon_sound.png"
                  alt=""
                  className="pillar__icon-img"
                  aria-hidden="true"
                />
                <h3 className="pillar__title">Son</h3>
                <p className="pillar__text">
                  Naviguez dans l&apos;obscurité grâce à des indices audio.
                  Murmures, échos et craquements guident votre exploration.
                  L&apos;ambiance sonore évolue selon vos choix.
                </p>
              </motion.div>
            </Reveal>
          </div>
          <div className="gameplay__enigmes">
            <Reveal>
              <p className="gameplay__atmosphere">
                Les murs murmurent à ceux qui savent écouter. Chaque symbole
                gravé dans la pierre est un fragment de mémoire, chaque ombre
                une invitation à comprendre. Ici, la lumière ne se donne pas —
                elle se mérite. Un flambeau éteint cache un secret. Un coffre
                ouvert trop vite peut se refermer sur vous. Les parchemins
                dispersés attendent d&apos;être réunis, et quelque part dans
                l&apos;obscurité, un cube de pierre tourne en silence, gardien
                d&apos;un motif que personne n&apos;a su lire depuis des
                siècles.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="gameplay__atmosphere gameplay__atmosphere--whisper">
                Avancez prudemment. La crypte protège ses morts.
              </p>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ═══════════ ÉQUIPE ═══════════ */}
      <section className="section team">
        <div className="team__bg" />
        <TeamSparks />
        <div className="team__line" />
        <Reveal>
          <p className="section__label">Qui sommes-nous</p>
          <h2 className="section__title">L&apos;équipe</h2>
          <div className="section__divider" />
        </Reveal>
        <div className="team__grid">
          {TEAM.map((member, i) => (
            <Reveal key={member.name} delay={0.06 * (i + 1)}>
              <motion.div
                className="team-member"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="team-member__avatar"
                />
                <p className="team-member__name">{member.name}</p>
                <p className="team-member__role">{member.role}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ RÉFÉRENCES ═══════════ */}
      <section className="section">
        <Reveal>
          <p className="section__label">Positionnement</p>
          <h2 className="section__title">Références</h2>
          <div className="section__divider" />
        </Reveal>
        <div className="references__list">
          {[
            {
              label: "Aventure",
              games:
                "Zelda (Spirit Tracks, Phantom Hourglass, Wind Waker, Minish Cap)",
            },
            { label: "Énigmes", games: "Professeur Layton, Another Code" },
            { label: "Narration", games: "Undertale, Deltarune, Oxenfree" },
            {
              label: "Tension",
              games: "Resident Evil, Metroid Fusion, Danganronpa",
            },
          ].map((ref, i) => (
            <Reveal key={ref.label} delay={0.1 * (i + 1)}>
              <motion.div
                className="reference-row"
                whileHover={{ x: 8, transition: { duration: 0.25 } }}
              >
                <span className="reference-row__label">{ref.label}</span>
                <span className="reference-row__games">{ref.games}</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="footer">
        <Reveal>
          <h2 className="footer__title">La Crypte Oubliée</h2>
          <p className="footer__whisper">« Je raconterai votre histoire. »</p>
          <p className="footer__text">
            Un jeu navigateur par des passionnés — 2026
          </p>
        </Reveal>
      </footer>
    </main>
  );
}
