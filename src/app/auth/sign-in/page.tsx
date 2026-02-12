import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
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
    return <SignInView />
}

export default Page;

//this will create a route at https://localhost:3000/auth/sign-in

/* and page.tsx is reserved name only when your file contain this page then
that file is considered as route 
eg: sign-in file contains page.tsx then https://localhost:3000/sign-in is a route 

if auth file contains sign-in file and that file contains page.tsx then https://localhost:3000/auth/sign-in is desired route 
*/