import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { AppProps } from "next/dist/shared/lib/router/router";
import React from "react";

export type NextPageWithLayout = NextPage & {
  Layout?: React.FC;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export type NextApiRequestX = NextApiRequest & {
  user?: any;
};

export type NextApiHandlerX<T = any> = (
  req: NextApiRequestX,
  res: NextApiResponse
) => void | Promise<void>;
