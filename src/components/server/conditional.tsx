import { Children, forwardRef, PropsWithChildren } from "react";

interface ConditionalProps {
  satisfies?: null | unknown | boolean;
}

const Conditional = forwardRef(
  ({ children, satisfies }: PropsWithChildren<ConditionalProps>, _) => {
    const [truthy, falsy] = Children.toArray(children);

    const elsy = falsy ?? <></>;

    return satisfies ? truthy : elsy;
  }
);

Conditional.displayName = Conditional.name;

export default Conditional;
