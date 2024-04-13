import { Send } from "lucide-react";
import React from "react";

import Conditional from "@/components/server/conditional";
import { siteConfig } from "@/config/site";
import type { PageProps } from "@/types/page";

const Register = ({ searchParams }: PageProps) => {
  //! 1. What if the unknown user comes from direct link - Implement Error cases
  // ? 2. Add login button -> use case where he is opening email link in another browser/tab
  return (
    <div className="flex items-start gap-4">
      <Send className="mt-2" />

      <Conditional satisfies={searchParams?.email}>
        <h2 className="w-80">
          Thankyou for registering with {siteConfig?.name}. A verification mail has been sent to
          your email address {searchParams?.email}
        </h2>
      </Conditional>

      {/* 2. -> Button to take user to login page */}
    </div>
  );
};

export default Register;
