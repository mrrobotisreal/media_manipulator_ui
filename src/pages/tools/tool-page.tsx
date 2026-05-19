import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import ToolLandingPage from './tool-landing-page';
import { getToolBySlug } from '@/content/toolPages';

/**
 * Single-slug wrapper around ToolLandingPage. Looks the tool up from
 * the content map; renders a friendly fallback if the slug is unknown.
 */
const ToolPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) {
    return (
      <Card className="max-w-3xl mx-auto my-8 sci-fi-frame">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-card-foreground mb-2">
            Tool not found
          </h1>
          <p className="text-muted-foreground mb-4">
            We could not find the tool you were looking for. Browse all available tools below.
          </p>
          <Link
            to="/tools"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Browse all tools
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <ToolLandingPage tool={tool} />;
};

export default ToolPage;
