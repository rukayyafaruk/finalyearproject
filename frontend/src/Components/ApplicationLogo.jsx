export default function ApplicationLogo({ className = '', compact = false, ...props }) {
    return (
        <img
            {...props}
            src={compact ? '/images/kindred-path-mark.webp' : '/images/kindred-path-logo.webp'}
            alt="Kindred Path"
            className={`object-contain ${className}`.trim()}
        />
    );
}
