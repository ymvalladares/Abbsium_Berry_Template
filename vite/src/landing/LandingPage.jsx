import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import AbbsiumHero from './AbbsiumHero';
import FeaturesSection from './FeaturesSection';
import PricingComponent from './PricingComponent';
import BrandSection from './BrandSection';
import Footer from './Footer';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

const LandingPage = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* ── Capa de gradiente principal ── */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 80% 50% at 10% -10%, rgba(139, 92, 246, 0.09) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 95% 5%,  rgba(99, 102, 241, 0.08) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 50% 100%, rgba(147, 197, 253, 0.07) 0%, transparent 60%),
            linear-gradient(160deg, #f8f7ff 0%, #f0f4ff 35%, #f5f8ff 65%, #ffffff 100%)
          `
        }}
      />

      {/* ── Textura de ruido muy sutil (SVG inline) ── */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.018,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />

      {/* ── Orb decorativo top-left ── */}
      <Box
        sx={{
          position: 'fixed',
          top: '-120px',
          left: '-80px',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(40px)'
        }}
      />

      {/* ── Orb decorativo top-right ── */}
      <Box
        sx={{
          position: 'fixed',
          top: '-60px',
          right: '-100px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(48px)'
        }}
      />

      {/* ── Orb decorativo bottom-center ── */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(147,197,253,0.08) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(40px)'
        }}
      />

      {/* ── Navbar ── */}
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <Navbar sx={{ bgcolor: 'transparent', backgroundImage: 'none', boxShadow: 'none' }} />
      </Box>

      {/* ── Contenido principal ── */}
      <Box component="main" sx={{ position: 'relative', zIndex: 1, bgcolor: 'transparent' }}>
        <AbbsiumHero />
        <FeaturesSection />
        <PricingComponent />
        <BrandSection />
      </Box>

      {/* ── Footer ── */}
      <Box sx={{ mt: 'auto', position: 'relative', zIndex: 1, bgcolor: 'transparent' }}>
        <Footer />
      </Box>
      {/* WhatsApp flotante */}
      <FloatingWhatsApp
        phoneNumber="+19048523178"
        accountName="Yordan Jesus"
        statusMessage="Typically replies within minutes"
        chatMessage="Hey! 👋 How can I help you today?"
        placeholder="Type a message..."
        allowClickAway={true}
        avatar="https://avatars.githubusercontent.com/u/103406224"
        notificationSound={true}
        chatboxHeight={400}
        chatboxWidth={350}
        styles={{ zIndex: 9999 }}
      />
    </Box>
  );
};

export default LandingPage;
