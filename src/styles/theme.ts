
export const COLORS = {
  background: "#000000",     
  surface: "#2c2c2c",        
  primary: "#FF9800",        
  accent: "#FF5722",         
  onPrimary: "#FFFFFF",      
  onSurface: "#FFFFFF",     
  border: "#FF9800",         
  borderAccent: "#FF5722",   
  error: "#FF3B30",          
  secondaryText: "#FFA040",  
  hint: "#aaaaaa",           
  placeholder: "#ffffff98", 
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

export const INPUT = {
  backgroundColor: COLORS.surface, 
  color: COLORS.primary,          
  borderColor: COLORS.primary,     
  borderWidth: 1,
  borderRadius: 8,
  padding: 12,
  marginBottom: 15,
};
