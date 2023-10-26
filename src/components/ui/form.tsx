"use client";

import React, { ForwardedRef, PropsWithChildren, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  FieldPath,
  FieldValues,
  FormProvider,
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";

import { SelectOptions } from "@/types/nav";
import { cn } from "@/lib/utils";
import { Label, LabelProps } from "@/components/ui/label";

import { Checkbox } from "./checkbox";
import Conditional from "../server/conditional";

const Form = FormProvider;

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName>,
    PropsWithChildren {
  label: ReactNode;
  description?: ReactNode;
  message?: boolean;
  className?: string;
  options?: SelectOptions[];

  // RestProps
  labelProps?: LabelProps;
  descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
  messageProps?: React.HTMLAttributes<HTMLParagraphElement>;
}

const FormInput = React.forwardRef(
  <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >(
    { className, children, ...props }: FormInputProps<TFieldValues, TName>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const {
      name,
      control,
      rules,
      shouldUnregister,
      label,
      labelProps,
      description,
      descriptionProps,
      message = true,
      messageProps,
      ...restProps
    } = props;

    const id = React.useId();
    const { field, formState } = useController({
      name,
      control,
      rules,
      shouldUnregister,
    });
    const { getFieldState } = useFormContext();

    const { error } = getFieldState(name, formState);

    const formLabelId = `${id}-form-label`;
    const formDescriptionId = `${id}-form-item-description`;
    const formMessageId = `${id}-form-item-message`;

    const body = error ? String(error?.message) : null;

    return (
      <div ref={ref} className={cn("mb-4 space-y-1", className)} id={id} {...restProps}>
        <Label
          className={cn("ml-0.5", error && "text-destructive", labelProps?.className)}
          htmlFor={formLabelId}
          {...labelProps}
        >
          {label}
        </Label>

        <Slot
          id={formLabelId}
          aria-describedby={
            !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          {...field}
        >
          {children}
        </Slot>

        <Conditional satisfies={description && !body}>
          <p
            id={formDescriptionId}
            className={cn("text-xs text-muted-foreground", descriptionProps?.className)}
            {...descriptionProps}
          >
            {description}
          </p>
          <Conditional satisfies={message && body}>
            <p
              id={formMessageId}
              className={cn("text-xs font-medium text-destructive", messageProps?.className)}
              {...messageProps}
            >
              {body}
            </p>
          </Conditional>
        </Conditional>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

const ToggleInput = React.forwardRef(
  <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >(
    { className, children, ...props }: FormInputProps<TFieldValues, TName>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const {
      name,
      control,
      rules,
      shouldUnregister,
      label,
      labelProps,
      description,
      descriptionProps,
      message = true,
      messageProps,
      ...restProps
    } = props;

    const id = React.useId();
    const { field, formState } = useController({
      name,
      control,
      rules,
      shouldUnregister,
    });
    const { getFieldState } = useFormContext();

    const { error } = getFieldState(name, formState);

    const formLabelId = `${id}-form-label`;
    const formDescriptionId = `${id}-form-item-description`;
    const formMessageId = `${id}-form-item-message`;

    const body = error ? String(error?.message) : null;

    return (
      <div
        ref={ref}
        className={cn("mb-4 flex items-start gap-2", className)}
        id={id}
        {...restProps}
      >
        <Slot
          id={formLabelId}
          aria-describedby={
            !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          aria-checked={field.value}
          {...field}
          //@ts-ignore - //! Find Solution why checked and onCheckedChange does not exists on Slot
          checked={field.value}
          onCheckedChange={field.onChange}
        >
          {children}
        </Slot>

        <div className="space-y-1 leading-none">
          <Label
            className={cn(error && "text-destructive", labelProps?.className)}
            htmlFor={formLabelId}
            {...labelProps}
          >
            {label}
          </Label>

          <Conditional satisfies={description && !body}>
            <p
              id={formDescriptionId}
              className={cn("text-xs text-muted-foreground", descriptionProps?.className)}
              {...descriptionProps}
            >
              {description}
            </p>
            <Conditional satisfies={message && body}>
              <p
                id={formMessageId}
                className={cn("text-xs font-medium text-destructive", messageProps?.className)}
                {...messageProps}
              >
                {body}
              </p>
            </Conditional>
          </Conditional>
        </div>
      </div>
    );
  }
);

ToggleInput.displayName = ToggleInput.name;

const CheckboxGroup = React.forwardRef(
  <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >(
    { className, ...props }: FormInputProps<TFieldValues, TName>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const {
      name,
      control,
      rules,
      shouldUnregister,
      label,
      labelProps,
      description,
      descriptionProps,
      message = true,
      messageProps,
      options = [],
      ...restProps
    } = props;

    const id = React.useId();
    const { field, formState } = useController({
      name,
      control,
      rules,
      shouldUnregister,
    });
    const { getFieldState } = useFormContext();

    const { error } = getFieldState(name, formState);

    const formLabelId = `${id}-form-label`;
    const formDescriptionId = `${id}-form-item-description`;
    const formMessageId = `${id}-form-item-message`;

    const body = error ? String(error?.message) : null;

    return (
      <div ref={ref} className={cn("mb-4 flex flex-col gap-2", className)} id={id} {...restProps}>
        <Label
          className={cn(error && "text-destructive", labelProps?.className)}
          htmlFor={formLabelId}
          {...labelProps}
        >
          {label}
        </Label>

        <Conditional satisfies={description && !body}>
          <p
            id={formDescriptionId}
            className={cn("text-xs text-muted-foreground", descriptionProps?.className)}
            {...descriptionProps}
          >
            {description}
          </p>
        </Conditional>
        {options?.map((item) => {
          return (
            <div key={item.value} className="flex items-center gap-2">
              <Checkbox
                checked={field.value?.includes(item.value)}
                onCheckedChange={(checked) =>
                  checked
                    ? field.onChange([...field.value, item.value])
                    : field.onChange(field.value?.filter((value: string) => value !== item.value))
                }
              />
              <Label
                className={cn(error && "text-destructive", labelProps?.className)}
                htmlFor={formLabelId}
                {...labelProps}
              >
                {item.label}
              </Label>
            </div>
          );
        })}

        {/* <Slot
          id={formLabelId}
          aria-describedby={
            !error
              ? `${formDescriptionId}`
              : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          aria-checked={field.value}
          {...field}
        >
          {children}
        </Slot> */}

        <Conditional satisfies={message && body}>
          <p
            id={formMessageId}
            className={cn("text-xs font-medium text-destructive", messageProps?.className)}
            {...messageProps}
          >
            {body}
          </p>
        </Conditional>
      </div>
    );
  }
);

CheckboxGroup.displayName = CheckboxGroup.name;

export { Form, FormInput, ToggleInput, CheckboxGroup };
