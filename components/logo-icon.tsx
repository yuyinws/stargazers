import { useTheme } from "next-themes";
export default function LogoIcon() {
  const { resolvedTheme } = useTheme();
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 382 362"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M191 1.61802L235.427 138.351L235.54 138.697H235.903H379.672L263.36 223.202L263.066 223.416L263.179 223.761L307.606 360.494L191.294 275.989L191 275.775L190.706 275.989L74.394 360.494L118.821 223.761L118.934 223.416L118.64 223.202L2.32754 138.697H146.097H146.46L146.573 138.351L191 1.61802Z"
        fill={resolvedTheme === "light" ? "#000" : "#fff"}
        stroke={resolvedTheme === "light" ? "#000" : "#fff"}
      />
    </svg>
  );
}