import clsx from "clsx";

type TextAreaProps = {
  className?: string;
  placeholder: string;
  label?: string;
  value: string;
  theme?: "dark" | "light";
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const TextArea = ({
  className,
  placeholder,
  label,
  theme,
  value,
  disabled = false,
  onChange,
}: TextAreaProps) => {
  return (
    <div id="text-area">
      {label && <label className="text-xs text-slate-400">{label}</label>}
      <textarea
        disabled={disabled}
        className={clsx(
          className,
          "w-full p-3 mt-2 text-sm border rounded-md placeholder-slate-400 transition",
          theme === "dark"
            ? "bg-slate-800 border-slate-700 text-white focus:ring-slate-700 focus:border-slate-700"
            : "bg-white border-slate-300 text-black focus:ring-blue-500 focus:border-blue-500",
          disabled &&
            "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
