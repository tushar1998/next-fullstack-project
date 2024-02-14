import { Head, Html, Preview, Body, Tailwind } from "@react-email/components";
import * as React from "react";
import Header from "./components/header";
import Footer from "./components/footer";

interface RegisterEmailProps {
  email?: string;
  name?: string;
}

export default function Email({ email, name }: RegisterEmailProps) {
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
