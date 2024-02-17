import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import astronautSvg from '../../assets/images/astronaut.svg';
import planetSvg from '../../assets/images/planet.svg';
import { Helmet } from 'react-helmet';
import './pageNotFound.css';

const PageNotFound: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById('stars-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const stars: { x: number; y: number; radius: number; alpha: number; dAlpha: number; }[] = [];
    const numStars = 100; // Reduce the number of stars

    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 0.3; // Make the stars even smaller
      const alpha = Math.random() * 0.3 + 0.7; // Adjust alpha value for clarity
      const dAlpha = Math.random() * 0.02; // Adjust the rate of change of alpha value

      stars.push({ x, y, radius, alpha, dAlpha });
    }

    const draw = () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx?.beginPath();
        ctx?.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
        if (ctx) ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`; // Check if ctx is truthy
        ctx?.fill();
        ctx?.closePath();
    
        star.alpha += star.dAlpha;
        if (star.alpha > 1 || star.alpha < 0.7) {
          star.dAlpha *= -1;
        }
      });
    
      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      // Clean up on component unmount
      cancelAnimationFrame(draw as unknown as number);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Space | tsParticles 404</title>
        <link rel="icon" type="image/x-icon" href="../images/tsParticles-64.png" />
      </Helmet>
      <div className="permission_denied">
        <canvas id="stars-canvas" style={{ position: 'fixed', width: '100%', height: '100%', top: 0, left: 0 }}></canvas>
        <div className="denied__wrapper">
          <h1>404</h1>
          <h3>Hmm, looks like that page doesn't exist.</h3>
          <img id="astronaut" src={astronautSvg} alt="Astronaut" />
          <img id="planet" src={planetSvg} alt="Planet" />
          <Link to="/admin/dashboard"><button className="denied__link">Go Home</button></Link>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
