import { Body, Head, Html, Preview, Tailwind } from "@react-email/components";
import * as React from "react";

import Footer from "./components/footer";
import Header from "./components/header";

export default function Email() {
  return (
    <Html>
      <Head />
      <Preview>Verify your email and continue registration</Preview>
      <Tailwind>
        <Body className="bg-white" style={{ fontFamily: "Arial" }}>
          <Header />

          <Footer />
        </Body>
      </Tailwind>
    </Html>
  );
}
