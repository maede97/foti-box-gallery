import { environmentVariables } from '@/config/environment';
import { MetadataRoute } from 'next';

export default function siteamp(): MetadataRoute.Sitemap {
  return [
    {
      url: environmentVariables.APP_HOST_URL,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${environmentVariables.APP_HOST_URL}/impressum`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${environmentVariables.APP_HOST_URL}/upload`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${environmentVariables.APP_HOST_URL}/admin`,
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}
