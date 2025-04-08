import { Suspense } from "react";
import { Login } from "../login";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export default function SignUpPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {/* <Header /> */}
        <Login mode="signup" />
      </Suspense>
      {/* Footer is static, move it outside of the Suspense boundary. */}
      {/* <Footer /> */}
    </>
  );
}
