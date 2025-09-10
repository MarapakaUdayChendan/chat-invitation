
// export const COLORS = {
//   background: "#fff",     
//   surface: "#2c2c2c",        
//   primary: "#FF9800",        
//   accent: "#FF5722",         
//   onPrimary: "#FFFFFF",      
//   onSurface: "#FFFFFF",     
//   border: "#FF9800",         
//   borderAccent: "#FF5722",   
//   error: "#FF3B30",          
//   secondaryText: "#FFA040",  
//   hint: "#aaaaaa",           
//   placeholder: "#ffffff98", 
// };

export const COLORS = {
  background: "#FFFFFF",     // white background
  surface: "#FFFFFF",        // white surfaces/cards
  primary: "#007AFF",        // main blue (iOS style)
  accent: "#007AFF",         // same blue for accents
  onPrimary: "#FFFFFF",      // text/icons on blue
  onSurface: "#000000",      // text/icons on white
  border: "#007AFF",         // borders in blue
  borderAccent: "#005BBB",   // darker blue for emphasis
  error: "#FF3B30",          // iOS-style error red
  secondaryText: "#555555",  // dark gray for secondary text
  hint: "#888888",           // lighter gray for hints
  placeholder: "#00000040",  // black with transparency
  
};


export const FONT = {
  family: "System",
  size: {
    heading: 28,
    subheading: 18,
    button: 18,
    input: 16,
    label: 14,
  },
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    bold: "700" as const,
  },
};

// export const INPUT = {
//   backgroundColor: COLORS.surface, 
//   color: COLORS.primary,          
//   borderColor: COLORS.primary,     
//   borderWidth: 1,
//   borderRadius: 8,
//   padding: 12,
//   marginBottom: 15,
// };
export const INPUT = {
  backgroundColor: COLORS.surface,   // white background
  color: COLORS.onSurface,           // black text
  borderColor: COLORS.primary,       // blue border
  borderWidth: 1,
  borderRadius: 8,
  padding: 12,
  marginBottom: 15,
  placeholderTextColor: COLORS.hint, // subtle gray placeholder
};
