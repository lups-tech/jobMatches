import logoContainer from '/assets/logoContainer.png';
import logoCore from '/assets/logoCore.png';

export const SpinningLogo = () => {
  return (
    <div className="relative w-1/3">
      <img
        src={logoContainer}
        alt="Logo Text"
        className="absolute inset-0 object-cover animate-customSpin motion-reduce:transition-none"
      />
      <img
        src={logoCore}
        alt="Spinning"
        className="absolute inset-0 object-cover"
      />
    </div>
  );
};
