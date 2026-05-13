import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/admin_vxf',
        '/api/*',
        '/_next/*',
      ],
    },
    sitemap: 'https://voxflow.ai/sitemap.xml',
  };
}
