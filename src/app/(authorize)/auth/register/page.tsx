import { Send } from "lucide-react";
import React from "react";

import Conditional from "@/components/server/conditional";
import { siteConfig } from "@/config/site";
import type { PageProps } from "@/types/page";

const Register = ({ searchParams }: PageProps) => {
  //! What if the unknown user comes from direct link - Implement Error cases

  return (
    <div className="flex items-start gap-4">
      <Send className="mt-2" />

      <Conditional satisfies={searchParams?.email}>
        <h2 className="w-80">
          Thankyou for registering with {siteConfig?.name}. A verification mail has been sent to
          your email address {searchParams?.email}
        </h2>
      </Conditional>
    </div>
  );
};

export default Register;
