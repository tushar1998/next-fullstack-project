"use client";

import Conditional from "@/components/server/conditional";
import { Input as Comp, InputProps as CompProps } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

import React, { ClipboardEventHandler, ForwardedRef, forwardRef, useMemo, useState } from "react";

interface InputProps extends CompProps {
  withShowPassword?: boolean;
}

export const Input = forwardRef(
  ({ type, withShowPassword, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const [inputType, setType] = useState(type);

    const noCopy: ClipboardEventHandler<HTMLInputElement> = (e) => {
      if (withShowPassword) {
        e.preventDefault();
      }
    };

    return (
      <div className="relative">
        <Comp
          {...props}
          type={inputType}
          ref={ref}
          onCopy={noCopy}
          onPaste={noCopy}
          onCut={noCopy}
        />

        <Conditional satisfies={withShowPassword}>
          <Conditional satisfies={inputType === "password"}>
            <Eye
              className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
              onClick={() => setType("text")}
            />
            <EyeOff
              className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
              onClick={() => setType("password")}
            />
          </Conditional>
        </Conditional>
      </div>
    );
  }
);

Input.displayName = "Input(Common)";
