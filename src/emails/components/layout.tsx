import { Body, Font, Head, Html, Preview, Tailwind } from "@react-email/components";
import React, { PropsWithChildren } from "react";

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
        <Body className={`bg-white border border-solid border-gray-300 rounded p-8 max-w-[576px] mx-auto ${className}`} {...restProps}>
          {children}
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Layout;
