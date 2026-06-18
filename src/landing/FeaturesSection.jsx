import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Container, Typography, Stack, Chip, Button } from '@mui/material';
import { keyframes, styled } from '@mui/system';
import {
  IconBolt,
  IconChartLine,
  IconShieldLock,
  IconPlugConnected,
  IconGitMerge,
  IconHeadset,
  IconArrowRight,
  IconCloud,
  IconBrain,
  IconClock,
  IconWorld,
  IconDeviceMobile
} from '@tabler/icons-react';

// ─── Animations ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Styled card ─────────────────────────────────────────────────────────────
const FeatureCard = styled(Box)(({ bordercolor }) => ({
  flexShrink: 0,
  width: 300,
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(218,220,224,0.5)',
  padding: '32px 28px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.45s cubic-bezier(0.2,1,0.3,1)',
  scrollSnapAlign: 'center',
  cursor: 'default',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: bordercolor,
    boxShadow: `0 24px 48px -12px rgba(0,0,0,0.09), 0 12px 28px -12px ${bordercolor}33`,
    '& .icon-box': {
      backgroundColor: bordercolor,
      color: '#fff',
      transform: 'scale(1.06)'
    },
    '& .icon-box svg': {
      transform: 'scale(1.1)'
    },
    '& .icon-glow': { opacity: 1 },
    '& .top-line': { opacity: 1 },
    '& .arrow-btn': { opacity: 1, transform: 'translateX(0)' }
  }
}));

const IconBox = styled(Box)(({ iconbg }) => ({
  width: 56,
  height: 56,
  borderRadius: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  background: `linear-gradient(135deg, ${iconbg}, ${iconbg}cc)`,
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
  '& svg': {
    position: 'relative',
    zIndex: 1,
    transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)'
  }
}));

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    id: 0,
    title: 'Smart Automation',
    desc: 'Trigger intelligent workflows based on real events. Let the system handle the routine so your team focuses on what matters.',
    icon: IconBolt,
    color: '#6366f1',
    bg: '#ede9fe',
    tags: ['Triggers', 'Flows']
  },
  {
    id: 1,
    title: 'Real-time Analytics',
    desc: "Live dashboards, cohort analysis, and anomaly detection. See what's happening the moment it happens — no SQL required.",
    icon: IconChartLine,
    color: '#7c3aed',
    bg: '#ede9fe',
    tags: ['Dashboards', 'Cohorts']
  },
  {
    id: 2,
    title: 'Secure Infrastructure',
    desc: 'SOC 2 Type II certified. End-to-end encryption at rest and in transit. Your data never leaves your defined boundaries.',
    icon: IconShieldLock,
    color: '#8b5cf6',
    bg: '#ede9fe',
    tags: ['SOC 2', 'E2E']
  },
  {
    id: 3,
    title: 'Easy Integration',
    desc: 'Connect in minutes, not months. 200+ native connectors plus a REST API and webhooks for everything else.',
    icon: IconPlugConnected,
    color: '#6d28d9',
    bg: '#ede9fe',
    tags: ['REST API', '200+ Apps']
  },
  {
    id: 4,
    title: 'Custom Workflows',
    desc: 'Build processes that fit your team. Visual editor, version history, and branch-based testing before you ship.',
    icon: IconGitMerge,
    color: '#5b21b6',
    bg: '#ede9fe',
    tags: ['Visual', 'Version Control']
  },
  {
    id: 5,
    title: '24/7 Support',
    desc: 'Engineers on call around the clock. Median first response under 4 minutes. Dedicated Slack channel for Pro teams.',
    icon: IconHeadset,
    color: '#4c1d95',
    bg: '#ede9fe',
    tags: ['< 4 min', 'Slack']
  },
  {
    id: 6,
    title: 'Cloud Native',
    desc: 'Built for the cloud from day one. Auto-scaling, multi-region deployment, and zero-downtime updates out of the box.',
    icon: IconCloud,
    color: '#0ea5e9',
    bg: '#e0f2fe',
    tags: ['Auto-scale', 'Multi-region']
  },
  {
    id: 7,
    title: 'AI Powered',
    desc: 'Machine learning models that adapt to your data. Predictive insights, smart recommendations, and automated decisions.',
    icon: IconBrain,
    color: '#8b5cf6',
    bg: '#ede9fe',
    tags: ['ML', 'Predictions']
  },
  {
    id: 8,
    title: 'Time Tracking',
    desc: 'Built-in time tracking for every project. Automatic reports, billable hours, and team productivity analytics.',
    icon: IconClock,
    color: '#f59e0b',
    bg: '#fef3c7',
    tags: ['Reports', 'Billing']
  },
  {
    id: 9,
    title: 'Global CDN',
    desc: 'Content delivered from edge servers worldwide. Sub-100ms latency for your users no matter where they are.',
    icon: IconWorld,
    color: '#10b981',
    bg: '#d1fae5',
    tags: ['Edge', '< 100ms']
  },
  {
    id: 10,
    title: 'Mobile Ready',
    desc: 'Fully responsive design with native mobile apps for iOS and Android. Your team stays connected everywhere.',
    icon: IconDeviceMobile,
    color: '#ec4899',
    bg: '#fce7f3',
    tags: ['iOS', 'Android']
  }
];

const CARD_W = 300;
const GAP = 16;

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Intersection observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Update active dot on scroll
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth < 600 ? el.clientWidth : CARD_W + GAP;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIdx(Math.min(idx, features.length - 1));
  }, []);

  // Snap to card
  const goTo = (idx) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth < 600 ? el.clientWidth : CARD_W + GAP;
    el.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
  };

  // Drag scroll
  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  return (
    <Box
      ref={sectionRef}
      component="section"
      id="features"
      sx={{
        py: { xs: 6, md: 10 },
        background: 'transparent',
        overflow: 'hidden',
        mt: { xs: '-20px', md: '-40px' },
        position: 'relative',
        zIndex: 5
      }}
    >
      <Container maxWidth="lg">
        {/* ── Header ── */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 5, md: 7 },
            opacity: visible ? 1 : 0,
            animation: visible ? `${fadeUp} 0.7s ease-out forwards` : 'none'
          }}
        >
          <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label="Platform capabilities"
              sx={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 600,
                fontSize: '10.5px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                bgcolor: '#7c3aed',
                color: '#fff',
                height: 26,
                borderRadius: '6px',
                px: 0.5
              }}
            />
          </Stack>

          <Typography
            variant="h2"
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: { xs: '2.2rem', md: '3.4rem' },
              letterSpacing: '-0.04em',
              color: '#0d1117',
              lineHeight: 1.1,
              mb: 2
            }}
          >
            Powerful Features for
            <br />
            <Box component="span" sx={{ color: '#7c3aed' }}>
              Your Business
            </Box>
          </Typography>

          <Typography
            sx={{
              color: '#5f6368',
              maxWidth: 520,
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: '1rem',
              fontWeight: 400
            }}
          >
            Everything your team needs to move fast, stay secure, and scale — all in one place.
          </Typography>
        </Box>

        {/* ── Scroll track ── */}
        <Box sx={{ position: 'relative' }}>
          {/* Fade edges — hidden on mobile since cards are full-width */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: '20px',
              width: 48,
              zIndex: 2,
              pointerEvents: 'none',
              background: 'linear-gradient(to right, rgba(248,247,255,1), transparent)',
              display: { xs: 'none', sm: 'block' }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: '20px',
              width: 48,
              zIndex: 2,
              pointerEvents: 'none',
              background: 'linear-gradient(to left, rgba(248,247,255,1), transparent)',
              display: { xs: 'none', sm: 'block' }
            }}
          />

          {/* Cards row */}
          <Box
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            sx={{
              display: 'flex',
              gap: `${GAP}px`,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              cursor: 'grab',
              userSelect: 'none',
              pb: 2,
              px: { xs: '16px', sm: '4px' },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            {features.map((f, index) => {
              const Icon = f.icon;
              return (
                <FeatureCard
                  key={f.id}
                  bordercolor={f.color}
                  sx={{
                    width: { xs: 'calc(100vw - 32px)', sm: `${CARD_W}px` },
                    opacity: visible ? 1 : 0,
                    animation: visible ? `${fadeUp} 0.6s ease-out ${index * 0.08}s forwards` : 'none'
                  }}
                >
                  {/* Top accent line */}
                  <Box
                    className="top-line"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      bgcolor: f.color,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      borderRadius: '24px 24px 0 0'
                    }}
                  />

                  <IconBox className="icon-box" iconbg={f.bg}>
                    <Icon size={24} color={f.color} stroke={1.5} />
                  </IconBox>

                  {/* Number */}
                  <Typography
                    sx={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '10px',
                      fontWeight: 500,
                      color: '#dadce0',
                      letterSpacing: '0.06em',
                      mb: 0.5
                    }}
                  >
                    {String(f.id + 1).padStart(2, '0')}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '15.5px',
                      color: '#0d1117',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.25,
                      mb: 1
                    }}
                  >
                    {f.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#5f6368',
                      lineHeight: 1.75,
                      mb: 2.5
                    }}
                  >
                    {f.desc}
                  </Typography>

                  {/* Tags + arrow */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Stack direction="row" spacing={0.75}>
                      {f.tags.map((tag) => (
                        <Typography
                          key={tag}
                          sx={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: f.color,
                            bgcolor: `${f.color}14`,
                            px: 1.25,
                            py: 0.4,
                            borderRadius: '6px'
                          }}
                        >
                          {tag}
                        </Typography>
                      ))}
                    </Stack>
                    <Box className="arrow-btn" sx={{ opacity: 0, transform: 'translateX(-8px)', transition: 'all 0.25s ease' }}>
                      <IconArrowRight size={18} color={f.color} stroke={1.5} />
                    </Box>
                  </Box>
                </FeatureCard>
              );
            })}
          </Box>
        </Box>

        {/* ── Progress bar dots ── */}
        <Stack direction="row" gap="6px" justifyContent="center" sx={{ mt: 2.5 }} alignItems="center">
          {features.map((f, i) => (
            <Box
              key={f.id}
              component="button"
              onClick={() => goTo(i)}
              aria-label={f.title}
              sx={{
                height: '4px',
                width: activeIdx === i ? '28px' : '14px',
                borderRadius: '99px',
                border: 'none',
                cursor: 'pointer',
                p: 0,
                bgcolor: activeIdx === i ? features[activeIdx].color : '#e2e8f0',
                transition: 'width 0.28s ease, background-color 0.28s ease'
              }}
            />
          ))}
        </Stack>

        <Typography
          sx={{
            textAlign: 'center',
            mt: 1.5,
            fontSize: '11.5px',
            color: '#b0bec5',
            letterSpacing: '0.02em'
          }}
        >
          Swipe to explore
        </Typography>

        {/* ── CTA ── */}
        <Box sx={{ mt: { xs: 6, md: 8 }, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<IconArrowRight size={18} stroke={1.5} />}
            sx={{
              bgcolor: '#0d1117',
              color: '#fff',
              px: 5,
              py: 1.6,
              borderRadius: '100px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '-0.01em',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#7c3aed', boxShadow: '0 12px 28px rgba(124,58,237,0.3)' }
            }}
          >
            Let's talk about your project
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
