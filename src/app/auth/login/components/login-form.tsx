"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/utils/serverActions/firebaseMethods";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/lib/store";

import { updateUser } from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/firebase";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export default function LoginForm() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await loginWithFirebase(data.email, data.password);
  };

  const loginWithFirebase = async (email: string, pass: string) => {
    setIsLoading(true);
    const resp: any = await login(email, pass);

    if (resp.data) {
      // console.log("current User =>", auth.currentUser?.email);

      if (auth.currentUser) {
        dispatch(
          updateUser({
            user: {
              displayName: auth.currentUser.displayName,
              email: auth.currentUser.email,
              photoURL: auth.currentUser.photoURL,
              uid: auth.currentUser.uid,
            },
            isLoggedIn: true,
          }),
        );
      }

      router.push("/dashboard");
      setIsLoading(false);
    } else {
      console.log("the error message is =>", resp?.error);
      toast({
        title: "Wittyworkbooks",
        description: await resp?.error,
        variant: "default",
      });

      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className="w-full">
          {isLoading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  );
}
