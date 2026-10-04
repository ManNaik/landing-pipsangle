export const OPEN_LOGIN_EVENT = "pipsangel:open-login";

export function openLogin(): void {
  window.dispatchEvent(new Event(OPEN_LOGIN_EVENT));
}
