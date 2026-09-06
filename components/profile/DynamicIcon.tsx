import React from "react";
import {
  Sparkles,
  Globe,
  Code,
  Palette,
  Zap,
  Layers,
  Film,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Briefcase,
  Camera,
  Star,
  Download,
  Share2,
  FileText,
  BookOpen,
  PlayCircle,
  ShoppingBag,
  LucideProps,
} from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name?: string;
}

const iconMap: Record<string, React.FC<LucideProps>> = {
  sparkles: Sparkles,
  globe: Globe,
  code: Code,
  palette: Palette,
  zap: Zap,
  layers: Layers,
  film: Film,
  phone: Phone,
  mail: Mail,
  mappin: MapPin,
  "map-pin": MapPin,
  calendar: Calendar,
  externallink: ExternalLink,
  "external-link": ExternalLink,
  briefcase: Briefcase,
  camera: Camera,
  star: Star,
  download: Download,
  share: Share2,
  "file-text": FileText,
  "book-open": BookOpen,
  play: PlayCircle,
  "play-circle": PlayCircle,
  "shopping-bag": ShoppingBag,
};

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  if (!name) return <Sparkles {...props} />;

  const cleanName = name.toLowerCase().trim();
  const IconComponent = iconMap[cleanName] || Sparkles;

  return <IconComponent {...props} />;
}
