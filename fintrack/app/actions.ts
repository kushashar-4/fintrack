"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


// Project utils

export const getuserID = async() => {
  const supabase = await createClient();
  const {data, error} = await supabase.auth.getUser()

  if(data != null) {
    return data.user?.id
  }
}

export const fetchData = async ( table: string ) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select()

  return data
}

export const confirmSetup = async () => {
  const supabase = await createClient();
  const userID = await getuserID();

  if(userID != null){
    const { error } = await supabase.from("profiles").update({isSetup: true}).eq("id", userID);
    return true
  }
  else{
    return false
  }
}

export const checkForSetup = async() => {
  const data = await fetchData("profiles");
  if(data != null) {
    if(!data[0].isSetup){
      return redirect("/setup")
    }
  }
  else{
    return redirect("sign-in")
  }
}

// Financial utilities

export const editFinancialData = async(table: string, amount: number) => {
  const supabase = await createClient();
  const userID = await getuserID();

  if(userID != null) {
    const {error} = await supabase.from(table).insert({user_id: userID, amount: amount})
  }

  updateProfileFinancials()
}

export const updateProfileFinancials = async() => {
  const supabase = await createClient();
  const userID = await getuserID();

  let totalIncome = 0
  let totalExpenses = 0

  const income = await supabase.from("income").select()
  const expense = await supabase.from("expense").select()

  if(income.data != null) {
    for(let i = 0; i < income.data.length; i++){
      totalIncome += income.data[i].amount
    }
  }

  if(expense.data != null) {
    for(let i = 0; i < expense.data.length; i++){
      totalExpenses += expense.data[i].amount
    }
  }

  const balance = totalIncome - totalExpenses

  const {error} = await supabase.from("profiles").update({balance: balance}).eq("id", userID);
}
