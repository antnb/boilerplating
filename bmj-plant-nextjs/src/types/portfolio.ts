// Portfolio types — extracted from mock-portfolio-detail.ts
// Used by: PortfolioDetailClient

export interface DeliveryStage {
  step: string;
  label: string;
  description: string;
  icon: string;
  images: { id: string; src: string; alt: string }[];
}
