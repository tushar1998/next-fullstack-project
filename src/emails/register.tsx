import { Text, Section, Button } from "@react-email/components";
import * as React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Layout from "./components/layout";

interface RegisterEmailProps {
  email?: string;
  name?: string;
  href?: string;
}

export default function Register({ email, name, href }: RegisterEmailProps) {
  return (
    <Layout>
      <Header />
      {/* Main Content */}
      <Section className="px-6 py-8">
        <Text className="m-0 pb-4 text-base text-slate-500">Hi {name ?? "John Doe"},</Text>

        <Text className="m-0 pb-4 text-base text-slate-500">
          We&#39;re excited to welcome you to Untitled and we&#39;re even more excited about what
          we&#39;ve got planned. You&#39;re already on your way to creating beautiful visual
          products.
        </Text>

        <Text className="m-0 pb-4 text-base text-slate-500">
          Whether you&#39;re here for your brand, for a cause, or just for fun — welcome! If
          there&#39;s anything you need, we&#39;ll be here every step of the way.
        </Text>

        <Button
          className="rounded-md bg-black px-4 py-2.5 text-sm text-white"
          href={href ?? "https://google.com"}
        >
          Verify Email
        </Button>

        <Text className="m-0 pt-4 text-base text-slate-500">Thanks,</Text>
        <Text className="m-0 text-base text-slate-500">The Team</Text>
      </Section>
      <Footer email={email} />
    </Layout>
  );
}
