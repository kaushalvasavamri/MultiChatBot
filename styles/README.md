# Common Styles System

This directory contains a comprehensive common styles system for the MultiChatBot React Native application. The system is designed to eliminate code duplication and provide consistent styling across the entire app.

## Structure

### `common.ts`
The main styles file containing all shared styles, colors, spacing, and common UI elements.

## Available Exports

### Colors
- `Colors.primary` - Main brand color (#0D75B0)
- `Colors.primaryLight` - Light primary color (#e6f3ff)
- `Colors.secondary` - Secondary brand color (#2563eb)
- `Colors.textPrimary` - Primary text color (#222b45)
- `Colors.textSecondary` - Secondary text color (#6b7280)
- `Colors.textLight` - Light text color (#9ca3af)
- `Colors.textInverse` - Inverse text color (#ffffff)
- `Colors.background` - Main background color (#ffffff)
- `Colors.error` - Error color (#ef4444)
- `Colors.success` - Success color (#10b981)
- `Colors.warning` - Warning color (#f59e0b)
- `Colors.gray` - Gray color scale (50-900)

### Spacing
- `Spacing.xs` - 4px
- `Spacing.sm` - 8px
- `Spacing.md` - 12px
- `Spacing.lg` - 16px
- `Spacing.xl` - 20px
- `Spacing.xxl` - 24px
- `Spacing.xxxl` - 32px
- `Spacing.xxxxl` - 40px

### Typography
- `Typography.sizes` - Font sizes (xs, sm, md, lg, xl, xxl, xxxl, xxxxl)
- `Typography.weights` - Font weights (normal, medium, semibold, bold)

### Border Radius
- `BorderRadius.sm` - 4px
- `BorderRadius.md` - 8px
- `BorderRadius.lg` - 12px
- `BorderRadius.xl` - 16px
- `BorderRadius.full` - 32px

### Shadows
- `Shadows.sm` - Small shadow
- `Shadows.md` - Medium shadow
- `Shadows.lg` - Large shadow
- `Shadows.primary` - Primary color shadow
- `Shadows.primaryStrong` - Strong primary shadow

### Layout
- `Layout.container` - Main container style
- `Layout.center` - Center alignment
- `Layout.row` - Row layout
- `Layout.rowSpaceBetween` - Row with space between
- `Layout.safeArea` - Safe area container

### Buttons
- `Buttons.primary` - Primary button style
- `Buttons.primaryText` - Primary button text
- `Buttons.secondary` - Secondary button style
- `Buttons.secondaryText` - Secondary button text
- `Buttons.outline` - Outline button style
- `Buttons.outlineText` - Outline button text
- `Buttons.icon` - Icon button style
- `Buttons.iconSecondary` - Secondary icon button
- `Buttons.send` - Send button style

### Texts
- `Texts.h1` - Heading 1
- `Texts.h2` - Heading 2
- `Texts.h3` - Heading 3
- `Texts.h4` - Heading 4
- `Texts.body` - Body text
- `Texts.bodySecondary` - Secondary body text
- `Texts.caption` - Caption text
- `Texts.label` - Label text
- `Texts.button` - Button text
- `Texts.input` - Input text
- `Texts.placeholder` - Placeholder text

### Inputs
- `Inputs.base` - Base input style
- `Inputs.bar` - Input bar style
- `Inputs.textInput` - Text input style

### Cards
- `Cards.base` - Base card style
- `Cards.history` - History card style
- `Cards.message` - Message card style
- `Cards.userMessage` - User message style
- `Cards.botMessage` - Bot message style

### Headers
- `Headers.drawer` - Drawer header style
- `Headers.drawerTitle` - Drawer title
- `Headers.drawerSubtitle` - Drawer subtitle
- `Headers.simple` - Simple header
- `Headers.simpleTitle` - Simple header title

### Lists
- `Lists.container` - List container
- `Lists.item` - List item
- `Lists.itemText` - List item text

### States
- `States.loadingContainer` - Loading container
- `States.loadingText` - Loading text
- `States.errorContainer` - Error container
- `States.errorText` - Error text
- `States.emptyContainer` - Empty state container
- `States.emptyText` - Empty state text
- `States.emptySubtext` - Empty state subtitle

### Dividers
- `Dividers.horizontal` - Horizontal divider
- `Dividers.vertical` - Vertical divider

### SpacingUtils
- `SpacingUtils.p` - Padding all
- `SpacingUtils.px` - Padding horizontal
- `SpacingUtils.py` - Padding vertical
- `SpacingUtils.m` - Margin all
- `SpacingUtils.mx` - Margin horizontal
- `SpacingUtils.my` - Margin vertical

### CommonValues
- `CommonValues.borderRadius` - Common border radius values (small: 14, medium: 18, large: 25)
- `CommonValues.fontSize` - Common font sizes (small: 12, medium: 14, large: 16, xlarge: 24, xxlarge: 26, xxxlarge: 28)
- `CommonValues.spacing` - Additional spacing values (tiny: 4, small: 5, medium: 6, large: 10, xlarge: 12, xxlarge: 16, xxxlarge: 24)
- `CommonValues.dimensions` - Common dimensions (scrollButtonSize: 50, scrollButtonRadius: 25, imageSize: 180)

## Usage Examples

### Basic Import
```typescript
import { Colors, Spacing, Buttons, Texts } from '../styles/common';
```

### Using Colors
```typescript
<View style={{ backgroundColor: Colors.primary }}>
  <Text style={{ color: Colors.textInverse }}>Hello World</Text>
</View>
```

### Using Buttons
```typescript
<TouchableOpacity style={Buttons.primary}>
  <Text style={Buttons.primaryText}>Click Me</Text>
</TouchableOpacity>
```

### Using Text Styles
```typescript
<Text style={Texts.h1}>Heading</Text>
<Text style={Texts.body}>Body text</Text>
<Text style={Texts.caption}>Caption</Text>
```

### Using Layout
```typescript
<View style={Layout.container}>
  <View style={Layout.center}>
    <Text>Centered content</Text>
  </View>
</View>
```

### Using Cards
```typescript
<View style={Cards.base}>
  <Text>Card content</Text>
</View>
```

### Using CommonValues
```typescript
<View style={{ borderRadius: CommonValues.borderRadius.medium }}>
  <Text style={{ fontSize: CommonValues.fontSize.large }}>Content</Text>
</View>
```

## Benefits

1. **Consistency**: All components use the same color palette, spacing, and typography
2. **Maintainability**: Changes to styles can be made in one place
3. **Reusability**: Common patterns are defined once and reused
4. **Type Safety**: TypeScript ensures proper usage of style properties
5. **Performance**: Reduced bundle size by eliminating duplicate styles
6. **Scalability**: Easy to add new styles and maintain the design system

## Migration Guide

When migrating existing components to use common styles:

1. Import the required styles from `../styles/common`
2. Replace hardcoded colors with `Colors.*` references
3. Replace hardcoded spacing with `Spacing.*` references
4. Replace custom text styles with `Texts.*` styles
5. Replace custom button styles with `Buttons.*` styles
6. Remove duplicate StyleSheet definitions
7. Test the component to ensure visual consistency

## Best Practices

1. Always use common styles instead of hardcoded values
2. Import only the styles you need to keep bundle size small
3. Use semantic color names (e.g., `Colors.primary` instead of `#0D75B0`)
4. Use spacing scale for consistent spacing throughout the app
5. Use typography scale for consistent text sizing
6. Test components on different screen sizes to ensure responsiveness 