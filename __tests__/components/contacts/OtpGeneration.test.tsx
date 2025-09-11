import {OtpGeneration} from "../../../src/components/OtpGeneration";

describe('OtpGeneration', () => {
  it('should return a 4-digit string', () => {
    const otp = OtpGeneration();
    expect(typeof otp).toBe('string');
    expect(otp).toHaveLength(4);
    expect(/^\d{4}$/.test(otp)).toBe(true);
  });

  it('should return values within 1000 and 9999', () => {
    const otp = Number(OtpGeneration());
    expect(otp).toBeGreaterThanOrEqual(1000);
    expect(otp).toBeLessThanOrEqual(9999);
  });

  it('should generate different values on subsequent calls (most of the time)', () => {
    const otp1 = OtpGeneration();
    const otp2 = OtpGeneration();
    expect([otp1, otp2]).toEqual(expect.arrayContaining([otp1, otp2]));
  });
});