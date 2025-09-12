import { OtpGeneration } from "../../src/components/OtpGeneration";

describe('OtpGeneration', () => {
  it('returns a 4-digit string', () => {
    const otp = OtpGeneration();
    expect(typeof otp).toBe('string');
    expect(otp).toHaveLength(4);
    expect(/^\d{4}$/.test(otp)).toBe(true);
  });

  it('returns number within 1000 and 9999', () => {
    const otp = Number(OtpGeneration());
    expect(otp).toBeGreaterThanOrEqual(1000);
    expect(otp).toBeLessThanOrEqual(9999);
  });

  it('generates different values on subsequent calls', () => {
    const otp1 = OtpGeneration();
    const otp2 = OtpGeneration();
    expect(otp1).not.toBe(otp2);
  });
});
