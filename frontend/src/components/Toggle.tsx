/**
 * Toggle.tsx - Stylized toggle switch replacing native checkboxes.
 */

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "default" | "small";
}

export function Toggle({ checked, onChange, disabled, size }: ToggleProps) {
  return (
    <label className={`toggle${size === "small" ? " toggle-sm" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
    </label>
  );
}
