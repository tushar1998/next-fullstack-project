import Conditional from "@/components/server/conditional";
import { siteConfig } from "@/config/site";
import { PageProps } from "@/types/page";
import { Send } from "lucide-react";
import React from "react";

const Register = ({ searchParams }: PageProps) => {
  //! What if the unknown user comes from direct link - Implement Error cases

  return (
    <div className="flex items-start gap-4">
      <Send className="mt-2" />

      <Conditional satisfies={searchParams?.email}>
        <h2 className="text-md w-80 leading-0">
          Thankyou for registering with {siteConfig?.name}. A verification mail has been sent to
          your email address {searchParams?.email}
        </h2>
      </Conditional>
    </div>
  );
};

export default Register;
