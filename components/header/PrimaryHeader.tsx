import clsx from "clsx";
import { Icon } from "../icon/Icon";

type PrimaryHeaderProps = {
  className?: string;
  title: string;
  prevBtn?: () => void;
  withClose?: boolean;
  onClose?: () => void;
};

export const PrimaryHeader = ({
  className,
  title,
  prevBtn,
  withClose = false,
  onClose,
}: PrimaryHeaderProps) => {
  return (
    <nav>
      <div
        id="title"
        className={clsx(
          className,
          "flex items-center gap-3",
          "justify-between"
        )}
      >
        <div className="h-10 w-10 flex items-center justify-center">
          {prevBtn && (
            <div onClick={prevBtn} className="cursor-pointer min-w-[36px] h-[36px] w-[36px] flex items-center justify-center rounded-xl bg-[#ECF0EF] hover:bg-[#D8E3DF] transition-colors">
              <Icon name="chevron-left" className="text-[#003E2C] text-xl" />
            </div>
          )}
        </div>
        <p className={clsx("flex-1 font-poppins font-normal")}>{title}</p>
        <div className="h-10 w-10 flex items-center justify-center">
          {withClose && (
            <div onClick={onClose}>
              <Icon name="close" className="cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
