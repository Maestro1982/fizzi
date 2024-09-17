import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";

type ButtonProps = {
  buttonLink: LinkField;
  buttonText: string | null;
  className?: string;
};

export default function Button({
  buttonLink,
  buttonText,
  className,
}: ButtonProps) {
  return (
    <PrismicNextLink
      field={buttonLink}
      className={clsx(
        "rounded-xl bg-[#ef9709] px-5 py-4 text-center font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-[#D68707] md:text-2xl",
        className,
      )}
    >
      {buttonText}
    </PrismicNextLink>
  );
}
