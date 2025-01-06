"use server";

import { deleteCookie, setCookie } from "cookies-next";

export const createAuthCookie = async () => {
  setCookie("userAuth", "myToken", { secure: true });
};

export const deleteAuthCookie = async () => {
  deleteCookie("userAuth");
};
