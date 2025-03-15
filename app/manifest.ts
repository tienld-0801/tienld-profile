import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tien Profile',
    short_name: 'T-P',
    description: 'A Progressive Web App built with Tien Profile',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/tienld.jpg',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/tienld.jpg',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
