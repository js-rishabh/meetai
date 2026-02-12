import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!!session) {
        redirect("/");
    }
    return <SignUpView />
}

export default Page;

//this will create a route at https://localhost:3000/auth/sign-up

/*
agar hum chahte hai ki hum sign-up page ko https://localhost:3000/auth/sign-up ke bjaye
https://localhost:3000/sign-up se access kare auth file hone ke bad bhi to
hame auth file ko brackets () ke under dal dena hoga i.e, (auth) aur fir uske  under
sign-in page aur sign-up page to hum in dono page ko https://localhost:3000/sign-in
https://localhost:3000/sign-up se access kar  skate h.
*/

