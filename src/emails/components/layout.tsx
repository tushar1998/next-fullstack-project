import { Body, Font, Head, Html, Preview, Tailwind } from "@react-email/components";
import type { PropsWithChildren } from "react";
import React from "react";

interface LayoutProps {
  preview?: string;
  className?: string;
}

const Layout = ({ preview, className, children, ...restProps }: PropsWithChildren<LayoutProps>) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="GgSans"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://res.cloudinary.com/dq8ftemg9/raw/upload/v1705481652/gg-sans_scvzg9.ttf",
            format: "truetype",
          }}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview ?? ""}</Preview>
      <Tailwind>
        <Body
          className={`mx-auto max-w-[576px] rounded border border-solid border-gray-300 bg-white p-8 ${className}`}
          {...restProps}
        >
          {children}
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Layout;
