import { ForwardedRef, forwardRef, PropsWithChildren } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ModalProps extends DialogPrimitive.DialogProps {}

export const Modal = ({ ...props }: ModalProps) => <Dialog {...props} />;

Modal.Button = DialogTrigger;

interface ModalContentProps {
  title: string;
  description?: string;
  onClose?: () => void;
}

// eslint-disable-next-line react/display-name
Modal.Content = forwardRef(
  (
    { title, description, children, ...props }: PropsWithChildren<ModalContentProps>,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <DialogPortal>
        <DialogOverlay />

        <DialogContent {...props} ref={forwardedRef}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>

            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}

          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogContent>
      </DialogPortal>
    );
  }
);
Modal.Footer = DialogFooter;
