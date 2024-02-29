import type { PropsWithChildren } from "react";
import { Children, forwardRef } from "react";

interface ConditionalProps {
  satisfies?: null | unknown | boolean;
}

const Conditional = forwardRef(
  ({ children, satisfies }: PropsWithChildren<ConditionalProps>, _) => {
    const [truthy, falsy] = Children.toArray(children);

    return satisfies ? truthy : falsy;
  }
);

Conditional.displayName = Conditional.name;

export default Conditional;
