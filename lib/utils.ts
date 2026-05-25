export const shadows = {
  nesRaised:  "inset -3px -3px 0px #6b6b6b, inset 3px 3px 0px #e0d8cc",
  nesPressed: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc",
  nesDanger:  "inset -3px -3px 0px #7f0000, inset 3px 3px 0px #ff8080",
  nesSuccess: "inset -3px -3px 0px #1a5c2a, inset 3px 3px 0px #86efac",
  nesInfo:    "inset -3px -3px 0px #155e75, inset 3px 3px 0px #67e8f9",
  nesPurple:  "inset -3px -3px 0px #581c87, inset 3px 3px 0px #d8b4fe",
};

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
