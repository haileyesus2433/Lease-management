import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import qs from "query-string";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertDate = (isoDate: string): string | null => {
  try {
    const dateObj = new Date(isoDate);
    const formattedDate = `${dateObj
      .getUTCDate()
      .toString()
      .padStart(2, "0")}/${(dateObj.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObj.getUTCFullYear()}`;
    return formattedDate;
  } catch (error) {
    console.error(`Error parsing date: ${error}`);
    return null;
  }
};
export const formatAndDivideNumber = (number: number): string => {
  if (number >= 1000000) {
    const millions = (number / 1000000).toFixed(1);
    return `${millions}M`;
  } else if (number >= 1000) {
    const thousands = (number / 1000).toFixed(1);
    return `${thousands}K`;
  } else {
    return `${number}`;
  }
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
