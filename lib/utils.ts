import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import qs from "query-string";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertDate = (isoDate: string): string | null => {
  try {
    const dateObj = new Date(isoDate);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const formattedDate = `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
    return formattedDate;
  } catch (error) {
    console.error(`Error parsing date: ${error}`);
    return null;
  }
};
export const formatDate = (isoDate: string): string => {
  const dateObj = new Date(isoDate);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};
type generateUrlParams = {
  params: string;
  key: string;
  value: string | null;
};
export const generateUrlQuery = ({ params, key, value }: generateUrlParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

type removeUrlParams = {
  params: string;
  keys: string[];
};
export const removeUrlQuery = ({ params, keys }: removeUrlParams) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};
