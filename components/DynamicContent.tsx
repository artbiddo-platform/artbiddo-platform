'use client';

import { useState, useEffect } from 'react';

interface ContentBlock {
  id: string;
  name: string;
  title?: string;
  content: string;
  type: 'TEXT' | 'HTML' | 'IMAGE' | 'VIDEO' | 'JSON';
  metadata?: string;
  isActive: boolean;
}

interface SiteSettings {
  id: string;
  key: string;
  value: string;
  type: string;
  description?: string;
  isPublic: boolean;
}

interface DynamicContentProps {
  blockName?: string;
  settingKey?: string;
  fallback?: string;
  className?: string;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

export default function DynamicContent({ 
  blockName, 
  settingKey, 
  fallback = '', 
  className = '',
  as = 'div'
}: DynamicContentProps) {
  const [content, setContent] = useState<string>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (blockName) {
          const response = await fetch(`/api/content?block=${blockName}`);
          if (response.ok) {
            const data = await response.json();
            if (data.content) {
              setContent(data.content.content);
            }
          }
        } else if (settingKey) {
          const response = await fetch('/api/content');
          if (response.ok) {
            const data = await response.json();
            const setting = data.siteSettings?.find((s: SiteSettings) => s.key === settingKey);
            if (setting) {
              setContent(setting.value);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dynamic content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [blockName, settingKey]);

  if (loading) {
    return <span className={`${className} animate-pulse bg-gray-200 rounded`}>Cargando...</span>;
  }

  const Component = as;
  return <Component className={className}>{content}</Component>;
}
