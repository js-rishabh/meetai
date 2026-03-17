import { CommandResponsiveDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";

interface Props {
    open: boolean;
    setopen: Dispatch<SetStateAction<boolean>>
}

export const DashboardCommand = ({ open, setopen }: Props) => {
    return (
        <CommandResponsiveDialog open={open} onOpenChange={setopen}>
            <CommandInput
                placeholder="Find a meeting or agent"
            />
            <CommandList>
                <CommandItem>
                    Test
                </CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    )
}