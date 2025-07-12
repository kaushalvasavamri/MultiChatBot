import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color Palette
export const Colors = {
  // Primary Colors
  primary: '#0D75B0',
  primaryLight: '#e6f3ff',
  primaryDark: '#0a5a8a',
  
  // Secondary Colors
  secondary: '#2563eb',
  secondaryLight: '#dbeafe',
  
  // Neutral Colors
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Text Colors
  textPrimary: '#222b45',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  textInverse: '#ffffff',
  
  // Background Colors
  background: '#ffffff',
  backgroundSecondary: '#f8f9fa',
  backgroundTertiary: '#f1f5f9',
  
  // Border Colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  // Shadow Colors
  shadow: '#000000',
  shadowPrimary: '#0D75B0',
};

// Spacing Scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

// Typography
export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 26,
    xxxxl: 32,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 32,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  primary: {
    shadowColor: Colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryStrong: {
    shadowColor: Colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Common Layout Styles
export const Layout = {
  container: {
    flex: 1,
    marginTop: Spacing.xxl,
    backgroundColor: Colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
};

// Common Button Styles
export const Buttons = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    ...Shadows.md,
  },
  primaryText: {
    color: Colors.textInverse,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  secondary: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryText: {
    color: Colors.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outlineText: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  iconSecondary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13,117,176,0.7)',
  },
  send: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryStrong,
  },
});

// Common Text Styles
export const Texts = StyleSheet.create({
  h1: {
    fontSize: Typography.sizes.xxxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  h4: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: Typography.sizes.md,
    color: Colors.textPrimary,
  },
  bodySecondary: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  button: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  input: {
    fontSize: Typography.sizes.md,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textLight,
  },
});

// Common Input Styles
export const Inputs = StyleSheet.create({
  base: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.textPrimary,
    borderWidth: 0.2,
    borderColor: Colors.border,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadows.primary,
    borderWidth: 0.2,
    overflow: 'visible',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 0,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.md,
    marginRight: Spacing.sm,
  },
});

// Common Card Styles
export const Cards = StyleSheet.create({
  base: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  history: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  message: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.xs,
  },
  userMessage: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: Colors.backgroundSecondary,
    alignSelf: 'flex-start',
  },
});

// Common Header Styles
export const Headers = StyleSheet.create({
  drawer: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingTop: 16,
    paddingBottom: 16, // Remove gap below header
  },
  drawerTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
  },
  drawerSubtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.textInverse,
    opacity: 0.9,
  },
  simple: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.white,
  },
  simpleTitle: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
});

// Common List Styles
export const Lists = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    marginBottom: Spacing.xs,
  },
  itemText: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    marginLeft: Spacing.md,
    fontWeight: Typography.weights.medium,
  },
});

// Common Loading and Error Styles
export const States = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  emptySubtext: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
  },
});

// Common Divider Styles
export const Dividers = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  vertical: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
});

// Common Spacing Utilities
export const SpacingUtils = StyleSheet.create({
  p: { padding: Spacing.md },
  px: { paddingHorizontal: Spacing.md },
  py: { paddingVertical: Spacing.md },
  pt: { paddingTop: Spacing.md },
  pb: { paddingBottom: Spacing.md },
  pl: { paddingLeft: Spacing.md },
  pr: { paddingRight: Spacing.md },
  
  m: { margin: Spacing.md },
  mx: { marginHorizontal: Spacing.md },
  my: { marginVertical: Spacing.md },
  mt: { marginTop: Spacing.md },
  mb: { marginBottom: Spacing.md },
  ml: { marginLeft: Spacing.md },
  mr: { marginRight: Spacing.md },
});

// Additional common values that were hardcoded
export const CommonValues = {
  // Common border radius values
  borderRadius: {
    small: 14,
    medium: 18,
    large: 25,
  },
  // Common font sizes
  fontSize: {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 24,
    xxlarge: 26,
    xxxlarge: 28,
  },
  // Common spacing values
  spacing: {
    tiny: 4,
    small: 5,
    medium: 6,
    large: 10,
    xlarge: 12,
    xxlarge: 16,
    xxxlarge: 24,
  },
  // Common dimensions
  dimensions: {
    scrollButtonSize: 50,
    scrollButtonRadius: 25,
    imageSize: 180,
  },
};

// Export all styles as a single object for easy importing
export default {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
  Layout,
  Buttons,
  Texts,
  Inputs,
  Cards,
  Headers,
  Lists,
  States,
  Dividers,
  SpacingUtils,
  CommonValues,
}; 