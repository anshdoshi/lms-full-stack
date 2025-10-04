# UI/UX Design Rules & Guidelines

## Design System

### Color Palette
- **Primary Colors**: Use consistent brand colors throughout the application
- **Secondary Colors**: Complementary colors for accents and highlights
- **Semantic Colors**:
  - Success: Green tones
  - Warning: Yellow/Orange tones
  - Error: Red tones
  - Info: Blue tones
- **Neutral Colors**: Grays for backgrounds, borders, and text hierarchies

### Typography
- **Font Hierarchy**:
  - H1: 2.5rem (40px) - Page titles
  - H2: 2rem (32px) - Section headers
  - H3: 1.5rem (24px) - Subsection headers
  - H4: 1.25rem (20px) - Card titles
  - Body: 1rem (16px) - Regular text
  - Small: 0.875rem (14px) - Helper text
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Line Height**: 1.5 for body text, 1.2 for headings
- **Letter Spacing**: Use sparingly for uppercase text

### Spacing System
Use consistent spacing based on 4px/8px grid:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## Layout Principles

### Responsive Design
- **Mobile First**: Design for mobile, then scale up
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
  - Large Desktop: > 1280px
- **Flexible Grids**: Use flexbox/grid for responsive layouts
- **Touch Targets**: Minimum 44x44px for mobile interactive elements

### Container & Grid
- **Max Width**: 1280px for main content
- **Gutters**: 16px on mobile, 24px on tablet, 32px on desktop
- **Grid Columns**: 12-column grid system
- **Card Spacing**: Minimum 16px between cards

### Navigation
- **Consistent Position**: Navigation should remain in predictable locations
- **Active States**: Clearly indicate current page/section
- **Mobile Menu**: Hamburger menu for mobile, expanded for desktop
- **Breadcrumbs**: Use for deep navigation hierarchies

## Component Guidelines

### Buttons
- **Sizes**: Small (32px), Medium (40px), Large (48px)
- **Types**: Primary, Secondary, Tertiary, Ghost, Danger
- **States**: Default, Hover, Active, Disabled, Loading
- **Min Width**: 80px for text buttons
- **Border Radius**: 6-8px for modern look

### Forms
- **Input Height**: 40-48px for comfortable interaction
- **Labels**: Always visible, positioned above inputs
- **Placeholders**: Use for examples, not for labels
- **Validation**:
  - Real-time validation for complex fields
  - On-submit validation for simple forms
  - Clear error messages below fields
- **Focus States**: Visible outline/border change
- **Required Fields**: Mark with asterisk (*) or "Required" label

### Cards
- **Padding**: 16-24px internal padding
- **Border Radius**: 8-12px
- **Shadow**: Subtle elevation (0 2px 8px rgba(0,0,0,0.1))
- **Hover State**: Slight shadow increase or border color change
- **Content Hierarchy**: Clear title, description, action hierarchy

### Modals/Dialogs
- **Overlay**: Semi-transparent dark background (rgba(0,0,0,0.5))
- **Max Width**: 600px for standard modals
- **Padding**: 24-32px
- **Close Button**: Always provide clear way to dismiss
- **Focus Trap**: Keep keyboard focus within modal
- **Esc Key**: Allow Esc to close modal

### Tables
- **Header**: Fixed or sticky headers for long tables
- **Row Height**: 48-56px for comfortable scanning
- **Zebra Striping**: Alternate row colors for readability
- **Hover State**: Highlight row on hover
- **Actions**: Right-align action buttons
- **Pagination**: Show items per page and total count

## Interaction Patterns

### Loading States
- **Skeleton Screens**: Use for content loading
- **Spinners**: Use for actions/submissions
- **Progress Bars**: Use for multi-step processes
- **Disable Actions**: Prevent duplicate submissions

### Feedback & Notifications
- **Toast/Snackbar**: For non-critical notifications (auto-dismiss)
- **Inline Messages**: For form validation
- **Alert Banners**: For system-wide messages
- **Duration**: 3-5 seconds for success, 7-10 seconds for errors
- **Position**: Top-right or top-center for toasts

### Micro-interactions
- **Transitions**: 200-300ms for most interactions
- **Hover Effects**: Subtle scale/color changes
- **Click Feedback**: Visual response to all clicks
- **Smooth Scrolling**: Use for anchor links

## Accessibility (a11y)

### Standards
- **WCAG 2.1 Level AA Compliance**
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Indicators**: Visible focus states for all focusable elements
- **Skip Links**: Allow skipping to main content

### Color Contrast
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio
- **Don't Rely on Color Alone**: Use icons, patterns, or text

### Screen Readers
- **Alt Text**: Descriptive alt text for all images
- **ARIA Labels**: Use for custom components
- **Semantic HTML**: Use proper heading hierarchy and landmarks
- **Form Labels**: Associate labels with inputs

### Motion
- **Reduced Motion**: Respect prefers-reduced-motion setting
- **No Auto-Play**: Videos/animations should be user-initiated
- **Pause Controls**: Provide for animations over 5 seconds

## Performance

### Images
- **Optimization**: Compress images, use modern formats (WebP, AVIF)
- **Lazy Loading**: Load images as they enter viewport
- **Responsive Images**: Serve appropriate sizes for devices
- **Alt Text**: Always provide meaningful alt text

### Code Splitting
- **Route-based**: Split code by routes
- **Component-based**: Lazy load heavy components
- **Third-party**: Load libraries on demand

### Caching
- **Static Assets**: Cache with versioning
- **API Responses**: Cache when appropriate
- **Service Workers**: Consider for offline support

## Content Guidelines

### Writing Style
- **Clear & Concise**: Use simple, direct language
- **Action-Oriented**: Use verbs for buttons (Save, Delete, Submit)
- **Consistent Terminology**: Use same words for same concepts
- **Error Messages**: Be specific and provide solutions

### Microcopy
- **Button Labels**: Clear action verbs
- **Empty States**: Helpful, friendly messages with next steps
- **Confirmation Messages**: Clear about what will happen
- **Success Messages**: Confirm action completion

## LMS-Specific Guidelines

### Course Cards
- Thumbnail image (16:9 aspect ratio)
- Course title (2 line max)
- Instructor name with avatar
- Progress indicator
- Rating and enrollment count
- Clear CTA button

### Video Player
- Standard controls (play, pause, volume, fullscreen)
- Progress bar with chapters/sections
- Playback speed controls
- Keyboard shortcuts
- Resume from last position
- Quality selector

### Learning Dashboard
- Progress overview with visual indicators
- Recent courses/continue learning section
- Upcoming deadlines/assignments
- Achievement badges
- Study streak counter

### Discussion Forums
- Threaded conversations
- Upvote/downvote system
- Best answer marking
- Search and filter capabilities
- User reputation indicators

### Assignments/Quizzes
- Clear instructions and deadlines
- Progress indication (Question 1 of 10)
- Save draft functionality
- Time remaining indicator
- Review answers before submission
- Immediate feedback when appropriate

## Mobile-Specific Considerations

### Touch Interactions
- **Swipe Gestures**: Use for natural mobile interactions
- **Pull to Refresh**: For content feeds
- **Bottom Navigation**: Key actions within thumb reach
- **Fixed Bottom Bar**: For primary actions

### Mobile Forms
- **Appropriate Keyboards**: Number pad for phone, email keyboard for email
- **Autofill Support**: Support browser autofill
- **One Column**: Stack form fields vertically
- **Large Touch Targets**: Minimum 44x44px

### Mobile Performance
- **Minimize Animations**: Reduce motion for better performance
- **Optimize Images**: Use smaller sizes for mobile
- **Reduce Bundle Size**: Critical for slower connections
- **Progressive Enhancement**: Core functionality works everywhere

## Design Checklist

Before marking any UI component complete, verify:

- [ ] Responsive across all breakpoints
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets ≥ 44x44px on mobile
- [ ] Consistent with design system
- [ ] Transitions smooth (200-300ms)
- [ ] Focus indicators visible
- [ ] Forms validated with clear errors
- [ ] Images optimized and lazy loaded
- [ ] Text readable (proper hierarchy, spacing)
- [ ] Icons have labels/tooltips

## Resources

- **Design System**: Refer to Figma/Sketch files
- **Icon Library**: Use consistent icon set (e.g., Heroicons, Feather)
- **Color Palette**: Reference brand guidelines
- **Component Library**: Document reusable components
- **Accessibility Testing**: Use axe DevTools, WAVE
- **Performance Testing**: Lighthouse, WebPageTest

---

*This document should be treated as a living guideline and updated as the design system evolves.*
