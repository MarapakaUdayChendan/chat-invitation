import { COLORS } from "../styles/theme";
export const OtpGenerationSix = ():string => {
    return Math.floor(100000 + Math.random() * 9000).toString();
}