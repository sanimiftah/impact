# IMPACT Platform Logo Guidelines

## Brand Identity

The IMPACT platform logo represents **"Planting Seeds of Change"** - our core mission of transforming ideas into meaningful action for community impact.

## Logo Elements

### Primary Logo (`impact-logo.svg`)
- **Dimensions**: 120×40px (scalable SVG)
- **Icon**: Stylized growth symbol with plant/seed elements
- **Text**: "IMPACT" with tagline "Planting Seeds of Change"
- **Colors**: 
  - Primary: Green gradient (#10b981 → #059669 → #047857)
  - Text: Multi-color gradient (Green → Blue → Purple)

### Favicon (`favicon.svg`)
- **Dimensions**: 32×32px (scalable SVG)
- **Simplified version**: Just the icon without text
- **Usage**: Browser tabs, bookmarks, PWA icon

## Design Philosophy

### Symbolism
- **Circle**: Represents community, wholeness, and global impact
- **Growth Symbol**: Central plant/seed representing potential and growth
- **Leaves**: Spreading impact and reaching out to help others
- **Rays**: Energy radiating outward, showing positive influence
- **Core**: The heart of change - individual action leading to collective impact

### Color Psychology
- **Green**: Growth, sustainability, positive change, environmental consciousness
- **Blue**: Trust, reliability, technology, global perspective
- **Purple**: Innovation, creativity, transformation

## Usage Guidelines

### Navigation
- Logo appears in top-left of navigation bar
- Clickable to return to homepage
- Responsive: Shows full logo on desktop, icon-only on mobile

### File Locations
```
public/
├── impact-logo.svg      # Full logo with text
├── favicon.svg          # Icon-only favicon
└── index.html          # Uses logo in navigation
```

### Implementation
```html
<!-- Navigation Logo -->
<img src="impact-logo.svg" alt="IMPACT Logo" class="h-8 w-auto">

<!-- Favicon -->
<link rel="icon" href="favicon.svg" type="image/svg+xml">
```

## Brand Colors

### Primary Palette
- **Green Primary**: `#10b981` (Emerald 500)
- **Green Secondary**: `#059669` (Emerald 600)
- **Green Dark**: `#047857` (Emerald 700)

### Accent Colors
- **Blue**: `#3b82f6` (Blue 500)
- **Purple**: `#8b5cf6` (Violet 500)
- **Gray**: `#6b7280` (Gray 500)

## Future Considerations

### Logo Variations Needed
1. **Horizontal version**: For wide banner placements
2. **Vertical version**: For app icons and square formats
3. **Monochrome version**: For print and single-color usage
4. **White version**: For dark backgrounds

### Mobile App Integration
- The current SVG logo is perfect for React Native and Flutter
- Scalable for all device densities
- Consistent branding across web and mobile platforms

## Technical Notes

- **Format**: SVG (vector) for infinite scalability
- **Fallback**: Inline SVG data URI in HTML head
- **Performance**: Optimized SVG with minimal paths
- **Accessibility**: Proper alt text and semantic markup

---

*Created for IMPACT Platform - Planting Seeds of Change* 🌱
