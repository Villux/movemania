import { Theme, theme } from "../styled";

type ThemeKey = keyof Theme;

export function themeProp<P extends string, T extends ThemeKey>(
  prop: P,
  themeKey: T,
  getStyles: (token: string) => any
) {
  const values: Record<string, any> = { [prop]: {} };

  Object.values(theme[themeKey]).forEach(({ token }) => {
    values[prop][token] = getStyles(`$${token}`);
  });

  return values as {
    [prop in P]: { [token in keyof Theme[T]]: any };
  };
}
